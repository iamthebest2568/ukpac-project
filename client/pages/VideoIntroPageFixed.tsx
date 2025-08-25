/**
 * Video Intro Page - Immersive Vertical Video Experience (FIXED)
 * Interactive video experience that leads into the main survey flow
 * 
 * FIXES:
 * - Better YouTube API loading with timeout and retry
 * - Improved error handling for all player operations
 * - Fixed timer cleanup and state management
 * - Added loading states and user feedback
 * - Improved video segment handling
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '../hooks/useSession';
import { logEvent } from '../services/dataLogger.js';

interface StoryScene {
  type: 'video' | 'choices_only' | 'dynamic_choices' | 'placeholder';
  segment?: [number, number];
  question?: string;
  choices?: Array<{
    text: string;
    action: {
      type: 'LOG_AND_NAVIGATE' | 'NAVIGATE';
      log?: { key: string; value: string };
      destination: string;
    };
  }>;
  onEnd?: {
    type: 'NAVIGATE';
    destination: string;
  };
  message?: string;
}

interface StoryData {
  [key: string]: StoryScene;
}

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoIntroPageFixed = () => {
  const { navigateToPage } = useSession();
  
  // State management
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [showQuestionOverlay, setShowQuestionOverlay] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentChoices, setCurrentChoices] = useState<any[]>([]);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [userData, setUserData] = useState<{[key: string]: any}>({});
  const [currentSceneId, setCurrentSceneId] = useState('SCENE_INTRO');
  
  // New state for error handling and loading
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);

  // YouTube player refs
  const playerRef = useRef<any>(null);
  const playerReady = useRef(false);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const currentEndTime = useRef<number | null>(null);
  const lastVideoSegment = useRef<{start: number; end: number} | null>(null);
  const returnToSceneAfterReplay = useRef<string | null>(null);
  const suppressEndedHandler = useRef(false);
  const apiLoadingTimeout = useRef<NodeJS.Timeout | null>(null);
  const initializationAttempts = useRef(0);

  // Story data
  const storyData: StoryData = {
    'SCENE_INTRO': { 
      type: 'video', 
      segment: [0, 4], 
      onEnd: { type: 'NAVIGATE', destination: 'SCENE_PROFILE' } 
    },
    'SCENE_PROFILE': {
      type: 'choices_only',
      question: 'คุณเป็นใครในมหานครนี้',
      choices: [
        { text: 'ผู้ที่ต้องเข้าเมืองทำงาน', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'commuter' }, destination: 'SCENE_GENDER' } },
        { text: 'ผู้อยู่อาศัยในพื้นที่', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'resident' }, destination: 'SCENE_GENDER' } },
        { text: 'นักศึกษาที่มาเรียนในพื้นที่', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'student' }, destination: 'SCENE_GENDER' } },
        { text: 'ผู้ประกอบการที่มาขายของ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'vendor' }, destination: 'SCENE_GENDER' } },
        { text: 'ผู้ปกครองที่มารับ-ส่งลูก', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'parent' }, destination: 'SCENE_GENDER' } },
        { text: 'ผู้มาจับจ่ายซื้อของ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'profile', value: 'shopper' }, destination: 'SCENE_GENDER' } },
      ]
    },
    'SCENE_GENDER': {
      type: 'choices_only',
      question: 'เพศของคุณคืออะไร?',
      choices: [
        { text: 'ชาย', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'gender', value: 'male' }, destination: 'SCENE_STATUS' } },
        { text: 'หญิง', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'gender', value: 'female' }, destination: 'SCENE_STATUS' } },
        { text: 'เพศทางเลือก', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'gender', value: 'lgbtq' }, destination: 'SCENE_STATUS' } },
      ]
    },
    'SCENE_STATUS': {
      type: 'choices_only',
      question: 'สถานะของคุณคืออะไร?',
      choices: [
        { text: 'ผู้พิการ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'status', value: 'disabled' }, destination: 'SCENE_FREQUENCY' } },
        { text: 'เด็ก', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'status', value: 'child' }, destination: 'SCENE_FREQUENCY' } },
        { text: 'ผู้สูงอายุ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'status', value: 'elderly' }, destination: 'SCENE_FREQUENCY' } },
        { text: 'อื่นๆ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'status', value: 'other' }, destination: 'SCENE_FREQUENCY' } },
      ]
    },
    'SCENE_FREQUENCY': { type: 'dynamic_choices' },
    'SCENE_POLICY_INTRO': { 
      type: 'video', 
      segment: [4, 8], 
      onEnd: { type: 'NAVIGATE', destination: 'SCENE_ATTITUDE_CHECK' } 
    },
    'SCENE_ATTITUDE_CHECK': {
      type: 'choices_only',
      question: 'ความกังวลแรกของคุณคืออะไร?',
      choices: [
        { text: 'ไม่เชื่อว่าจะได้ผล', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'initial_attitude', value: 'wont_work' }, destination: 'SCENE_POLICY_QNA' } },
        { text: 'กลัวเป็นภาระทางการเงิน', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'initial_attitude', value: 'financial_burden' }, destination: 'SCENE_POLICY_QNA' } },
        { text: 'ไม่อยากเปลี่ยนวิธีเดินทาง', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'initial_attitude', value: 'unwilling_to_change' }, destination: 'SCENE_POLICY_QNA' } },
        { text: 'ลองดู ถ้าไม่ทำอะไร ปัญหาก็ไม่หาย', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'initial_attitude', value: 'positive' }, destination: 'SCENE_POLICY_QNA' } },
      ]
    },
    'SCENE_POLICY_QNA': { 
      type: 'video', 
      segment: [8, 13], 
      onEnd: { type: 'NAVIGATE', destination: 'SCENE_REACTION' } 
    },
    'SCENE_REACTION': {
      type: 'choices_only',
      question: 'หลังจากรับชม คุณรู้สึกอย่า���ไร?',
      choices: [
        { text: 'ดูแล้ว', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'reaction', value: 'watched' }, destination: 'SCENE_PERSUASION' } },
        { text: 'อยากรู้อยู่พอดี', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'reaction', value: 'curious' }, destination: 'SCENE_PERSUASION' } },
        { text: 'ยังไม่ดู', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'reaction', value: 'not_watched' }, destination: 'SCENE_PERSUASION' } },
      ]
    },
    'SCENE_PERSUASION': { 
      type: 'video', 
      segment: [13, 20], 
      onEnd: { type: 'NAVIGATE', destination: 'SCENE_FINAL_STANCE' } 
    },
    'SCENE_FINAL_STANCE': {
      type: 'choices_only',
      question: 'สรุปจุดยืนสุดท้ายของคุณคืออะไร?',
      choices: [
        { text: 'เห็นด้วย', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'final_stance', value: 'agree' }, destination: 'EXIT_TO_SURVEY' } },
        { text: 'กลางๆ', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'final_stance', value: 'neutral' }, destination: 'EXIT_TO_SURVEY' } },
        { text: 'ไม่เห็นด้วย', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'final_stance', value: 'disagree' }, destination: 'EXIT_TO_SURVEY' } },
      ]
    },
    'EXIT_TO_SURVEY': { 
      type: 'placeholder', 
      message: 'เข้าสู่แบบสำรวจหลัก' 
    },
  };

  // Load YouTube API with improved error handling
  useEffect(() => {
    const initializeAPI = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);

        // Log the initialization attempt
        logEvent({
          event: 'VIDEO_INTRO_INIT',
          payload: { attempt: initializationAttempts.current + 1 }
        });

        // Check if YouTube API is already loaded
        if (window.YT && window.YT.Player) {
          console.log('YouTube API already loaded');
          setApiLoaded(true);
          await initializePlayer();
          return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (!existingScript) {
          console.log('Loading YouTube API script...');
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.async = true;
          script.onerror = () => {
            setLoadingError('Failed to load YouTube API script');
            setIsLoading(false);
          };
          document.head.appendChild(script);
        }

        // Set up global callback with timeout
        const setupCallback = () => {
          window.onYouTubeIframeAPIReady = async () => {
            try {
              console.log('YouTube API ready');
              if (apiLoadingTimeout.current) {
                clearTimeout(apiLoadingTimeout.current);
              }
              setApiLoaded(true);
              await initializePlayer();
            } catch (error) {
              console.error('Error in API ready callback:', error);
              setLoadingError('Failed to initialize video player');
              setIsLoading(false);
            }
          };
        };

        setupCallback();

        // Set timeout for API loading
        apiLoadingTimeout.current = setTimeout(() => {
          if (!apiLoaded) {
            console.error('YouTube API loading timeout');
            setLoadingError('Video loading timeout. Please refresh and try again.');
            setIsLoading(false);
          }
        }, 15000);

        // Backup: Poll for API availability
        const pollInterval = setInterval(() => {
          if (window.YT && window.YT.Player && !apiLoaded) {
            console.log('YouTube API detected via polling');
            clearInterval(pollInterval);
            if (apiLoadingTimeout.current) {
              clearTimeout(apiLoadingTimeout.current);
            }
            setApiLoaded(true);
            initializePlayer();
          }
        }, 500);

        // Cleanup polling after 20 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
        }, 20000);

      } catch (error) {
        console.error('Error initializing YouTube API:', error);
        setLoadingError('Failed to initialize video system');
        setIsLoading(false);
      }
    };

    initializationAttempts.current += 1;
    initializeAPI();

    return () => {
      if (apiLoadingTimeout.current) {
        clearTimeout(apiLoadingTimeout.current);
      }
      stopProgressTimer();
    };
  }, []);

  // Initialize YouTube player with better error handling
  const initializePlayer = useCallback(async () => {
    if (!window.YT || !window.YT.Player) {
      throw new Error('YouTube API not available');
    }

    try {
      console.log('Initializing YouTube player...');
      
      playerRef.current = new window.YT.Player('youtube-player-fixed', {
        height: '100%',
        width: '100%',
        videoId: '6P5LGwaksbw',
        playerVars: {
          playsinline: 1,
          controls: 0,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            playerReady.current = true;
            setPlayerInitialized(true);
            setIsLoading(false);

            // Log successful initialization
            logEvent({
              event: 'VIDEO_PLAYER_READY',
              payload: { 
                videoId: '6P5LGwaksbw',
                duration: event.target.getDuration()
              }
            });

            // Test if video is available
            try {
              const videoData = event.target.getVideoData();
              console.log('Video data:', videoData);
            } catch (e) {
              console.warn('Could not get video data:', e);
            }
          },
          onStateChange: (event: any) => {
            if (suppressEndedHandler.current && event.data === window.YT.PlayerState.ENDED) {
              return;
            }
            
            console.log('Player state changed:', event.data);
            
            if (event.data === window.YT.PlayerState.ENDED) {
              stopProgressTimer();
              const scene = storyData[currentSceneId];
              if (scene?.onEnd) {
                handleAction(scene.onEnd);
              }
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            const errorMessages: {[key: number]: string} = {
              2: 'Invalid video ID',
              5: 'HTML5 player error',
              100: 'Video not found or private',
              101: 'Video not allowed in embedded players',
              150: 'Video not allowed in embedded players'
            };
            const errorMessage = errorMessages[event.data] || `Unknown error (${event.data})`;
            setLoadingError(`Video error: ${errorMessage}`);
            
            // Log the error
            logEvent({
              event: 'VIDEO_PLAYER_ERROR',
              payload: { 
                errorCode: event.data,
                errorMessage: errorMessage
              }
            });
          }
        }
      });

    } catch (error) {
      console.error('Failed to create YouTube player:', error);
      setLoadingError('Failed to create video player');
      setIsLoading(false);
      throw error;
    }
  }, [currentSceneId]);

  // Helper functions with improved error handling
  const stopProgressTimer = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, []);

  const logData = useCallback((key: string, value: string) => {
    setUserData(prev => ({ ...prev, [key]: value }));
    
    // Log the user choice
    logEvent({
      event: 'VIDEO_INTRO_CHOICE',
      payload: { 
        scene: currentSceneId,
        choice: key,
        value: value
      }
    });
  }, [currentSceneId]);

  const hideAllOverlays = useCallback(() => {
    setShowQuestionOverlay(false);
    setSelectedChoice(null);
  }, []);

  const showOverlay = useCallback(({ text, choices, showReplay }: {
    text?: string;
    choices?: any[];
    showReplay?: boolean;
  }) => {
    setCurrentQuestion(text || '');
    setCurrentChoices(choices || []);
    setShowReplayButton(showReplay && !!lastVideoSegment.current);
    setShowQuestionOverlay(true);
  }, []);

  const playSegment = useCallback((start: number, end: number, opts: any = {}) => {
    if (!playerRef.current || !playerReady.current) {
      console.error('Cannot play segment: Player not ready');
      return;
    }

    try {
      currentEndTime.current = end;
      stopProgressTimer();

      const doSeekAndPlay = () => {
        const earlyEnd = Math.max(0, end - 0.08);
        suppressEndedHandler.current = !!opts.onceOnEnd;

        if (playerRef.current && playerReady.current) {
          playerRef.current.seekTo(start, true);
          playerRef.current.playVideo();

          // Log video segment play
          logEvent({
            event: 'VIDEO_SEGMENT_PLAY',
            payload: { 
              scene: currentSceneId,
              start: start,
              end: end
            }
          });

          progressTimer.current = setInterval(() => {
            if (!playerReady.current) return;
            
            try {
              const currentTime = playerRef.current.getCurrentTime();
              if (currentEndTime.current != null && currentTime >= earlyEnd) {
                playerRef.current.pauseVideo();
                stopProgressTimer();

                if (typeof opts.onceOnEnd === 'function') {
                  const fn = opts.onceOnEnd;
                  opts.onceOnEnd = null;
                  suppressEndedHandler.current = false;
                  setTimeout(fn, 10);
                  return;
                }

                const scene = storyData[currentSceneId];
                if (scene?.onEnd) {
                  setTimeout(() => handleAction(scene.onEnd!), 50);
                }
              }
            } catch (error) {
              console.error('Error in progress timer:', error);
              stopProgressTimer();
            }
          }, 90);
        }
      };

      if (playerReady.current) {
        doSeekAndPlay();
      } else {
        const waitReady = setInterval(() => {
          if (playerReady.current) {
            clearInterval(waitReady);
            doSeekAndPlay();
          }
        }, 50);

        // Timeout waiting for player
        setTimeout(() => {
          clearInterval(waitReady);
          if (!playerReady.current) {
            console.error('Timeout waiting for player to be ready');
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error playing segment:', error);
    }
  }, [currentSceneId, stopProgressTimer]);

  const handleAction = useCallback((action: any) => {
    hideAllOverlays();
    if (!action) return;

    try {
      if (action.type === 'LOG_AND_NAVIGATE') {
        logData(action.log.key, action.log.value);
        loadScene(action.destination);
      } else if (action.type === 'NAVIGATE') {
        loadScene(action.destination);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  }, [hideAllOverlays, logData]);

  const loadScene = useCallback((sceneId: string) => {
    try {
      setCurrentSceneId(sceneId);
      const scene = storyData[sceneId];
      if (!scene) {
        console.error('Scene not found:', sceneId);
        return;
      }

      hideAllOverlays();

      // Log scene change
      logEvent({
        event: 'VIDEO_SCENE_CHANGE',
        payload: { 
          sceneId: sceneId,
          sceneType: scene.type
        }
      });

      // Exit to main survey
      if (sceneId === 'EXIT_TO_SURVEY') {
        // Log completion
        logEvent({
          event: 'VIDEO_INTRO_COMPLETE',
          payload: { 
            userData: userData,
            totalScenes: Object.keys(storyData).length
          }
        });

        // Navigate to Ask01 page with collected data
        navigateToPage('/ask01', userData);
        return;
      }

      if (scene.type === 'video') {
        lastVideoSegment.current = { start: scene.segment![0], end: scene.segment![1] };
        playSegment(scene.segment![0], scene.segment![1]);
      } else if (scene.type === 'choices_only') {
        const canReplay = !!lastVideoSegment.current;
        showOverlay({ text: scene.question, choices: scene.choices, showReplay: canReplay });
        stopProgressTimer();
        if (playerReady.current && playerRef.current) {
          playerRef.current.pauseVideo();
        }
      } else if (scene.type === 'dynamic_choices') {
        const profile = userData.profile;
        const choicesByProfile: {[key: string]: any} = {
          commuter: { 
            question: 'คุณขับรถยนต์ส่วนตัวเข้าเมืองบ่อยแค่ไหน?', 
            options: ['ทุกวัน', 'เกือบทุกวัน', 'สัปดาห์ละ 2-3 ครั้ง', 'สัปดาห์ละครั้ง', 'นานๆ ครั้ง'] 
          },
          resident: { 
            question: 'คุณเดินทางในพื้นที่บ่อยแค่ไหน?', 
            options: ['ทุกวัน', 'เกือบทุกวัน', 'สัปดาห์ละ 2-3 ครั้ง', 'สัปดาห์ละครั้ง', 'นานๆ ครั้ง'] 
          },
          default: { 
            question: 'คุณเดินทางบ่อยแค่ไหน?', 
            options: ['ทุกวัน', 'สัปดาห์ละครั้ง', 'เดือนละครั้ง'] 
          }
        };
        
        const currentChoices = choicesByProfile[profile] || choicesByProfile.default;
        const dynChoices = currentChoices.options.map((opt: string) => ({
          text: opt,
          action: { 
            type: 'LOG_AND_NAVIGATE', 
            log: { key: 'frequency', value: opt.toLowerCase().replace(/ /g, '_') }, 
            destination: 'SCENE_POLICY_INTRO' 
          }
        }));

        const canReplay = !!lastVideoSegment.current;
        showOverlay({ text: currentChoices.question, choices: dynChoices, showReplay: canReplay });
      } else if (scene.type === 'placeholder') {
        const canReplay = !!lastVideoSegment.current;
        showOverlay({ text: scene.message, choices: [], showReplay: canReplay });
      }
    } catch (error) {
      console.error('Error loading scene:', error);
    }
  }, [userData, hideAllOverlays, showOverlay, stopProgressTimer, playSegment, navigateToPage]);

  // Event handlers with error handling
  const handleStartClick = () => {
    try {
      setShowStartOverlay(false);
      
      // Log start event
      logEvent({
        event: 'VIDEO_INTRO_START',
        payload: { timestamp: new Date().toISOString() }
      });

      if (playerRef.current && playerReady.current) {
        try {
          playerRef.current.unMute();
        } catch (e) {
          console.warn('Could not unmute player:', e);
        }
        loadScene('SCENE_INTRO');
      } else {
        console.error('Player not ready for start');
        setLoadingError('Player not ready. Please wait a moment and try again.');
      }
    } catch (error) {
      console.error('Error starting video:', error);
    }
  };

  const handleChoiceClick = (choice: any) => {
    try {
      setSelectedChoice(choice.text);
      setTimeout(() => {
        handleAction(choice.action);
      }, 120);
    } catch (error) {
      console.error('Error handling choice click:', error);
    }
  };

  const handleReplayClick = () => {
    try {
      if (!lastVideoSegment.current) return;
      
      // Log replay event
      logEvent({
        event: 'VIDEO_REPLAY',
        payload: { 
          scene: currentSceneId,
          segment: lastVideoSegment.current
        }
      });

      returnToSceneAfterReplay.current = currentSceneId;
      hideAllOverlays();
      playSegment(lastVideoSegment.current.start, lastVideoSegment.current.end, {
        onceOnEnd: () => {
          loadScene(returnToSceneAfterReplay.current || currentSceneId);
          returnToSceneAfterReplay.current = null;
        }
      });
    } catch (error) {
      console.error('Error handling replay:', error);
    }
  };

  const handleRetry = () => {
    setLoadingError(null);
    setIsLoading(true);
    setApiLoaded(false);
    setPlayerInitialized(false);
    initializationAttempts.current = 0;
    
    // Force reload the component
    window.location.reload();
  };

  // Render loading state
  if (isLoading && !loadingError) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
          <h2 className="text-xl font-['Kanit'] mb-2">กำลังโหลดวิดีโอ...</h2>
          <p className="text-sm opacity-75">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (loadingError) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-center text-white max-w-md px-6">
          <div className="mb-4 text-red-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-['Kanit'] mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-sm opacity-75 mb-6">{loadingError}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#EFBA31] text-black rounded-full font-['Prompt'] font-medium hover:brightness-105 transition-all"
            >
              ลองใหม่
            </button>
            <button
              onClick={() => navigateToPage('/ask01')}
              className="px-6 py-3 bg-transparent text-[#EFBA31] border-2 border-[#EFBA31] rounded-full font-['Prompt'] font-medium hover:bg-[#EFBA31] hover:text-black transition-all"
            >
              ข้ามวิดีโอ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center overflow-hidden">
      <div className="w-full h-full max-w-[calc(100vh*(9/16))] mx-auto relative bg-black flex flex-col justify-center">
        
        {/* YouTube Player */}
        <div id="youtube-player-fixed" className="w-full h-full" />

        {/* Start Overlay */}
        {showStartOverlay && playerInitialized && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-end p-12 text-center text-white z-30">
            <h1 className="text-white font-bold text-3xl leading-tight mb-8 font-['Kanit']">
              <span className="text-white">แล้วถ้าหากวันหนึ่งมี</span><br/>
              <span className="text-[#EFBA31]">การเก็บค่าธรรมเนียม</span><br/>
              <span className="text-[#EFBA31]">เพื่อแก้ไขปัญหาจราจร</span><br/>
              <span className="text-white">จะเป็นอย่างไร...</span>
            </h1>
            <button 
              onClick={handleStartClick}
              className="px-8 py-4 text-black bg-white/90 font-bold rounded-full backdrop-blur-sm hover:bg-white text-lg transition-all duration-200 hover:scale-105"
            >
              เริ่มต้น
            </button>
          </div>
        )}

        {/* Question Overlay */}
        {showQuestionOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end items-center p-6 text-center z-20">
            <div className="w-full max-w-sm flex flex-col items-center gap-4 mb-8">
              
              {/* Question Text */}
              <div className="text-white font-['Kanit'] font-normal text-2xl leading-tight mb-2">
                {currentQuestion}
              </div>

              {/* Choice Buttons */}
              <div className="w-full flex flex-col items-center gap-3">
                {currentChoices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceClick(choice)}
                    className={`w-full max-w-sm px-6 py-3 rounded-full font-['Prompt'] font-medium text-lg border-2 transition-all duration-200 ${
                      selectedChoice === choice.text
                        ? 'bg-black text-[#EFBA31] border-[#EFBA31]'
                        : 'bg-[#EFBA31] text-black border-black hover:brightness-105 active:scale-98'
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {/* Replay Button */}
              {showReplayButton && (
                <button
                  onClick={handleReplayClick}
                  className="w-full max-w-sm mt-3 px-6 py-3 bg-transparent text-[#EFBA31] border-2 border-[#EFBA31] rounded-full font-['Prompt'] font-medium text-lg flex items-center justify-center gap-3 transition-all duration-200 hover:bg-[#EFBA31] hover:text-black active:scale-98"
                >
                  <span className="text-xl">🔄</span>
                  <span>ดูอีกรอบ</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoIntroPageFixed;
