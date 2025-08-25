/**
 * Video Intro Page - Immersive Vertical Video Experience
 * Interactive video experience that leads into the main survey flow
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from '../hooks/useSession';
import { loadYouTubeAPI, createYouTubePlayer, isYouTubeAPIReady, cleanupYouTubeAPI } from '../utils/youtubeAPI';

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

// YouTube API types are now handled in the utility

const VideoIntroPage = () => {
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
  
  // YouTube player refs
  const playerRef = useRef<any>(null);
  const playerReady = useRef(false);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const currentEndTime = useRef<number | null>(null);
  const lastVideoSegment = useRef<{start: number; end: number} | null>(null);
  const returnToSceneAfterReplay = useRef<string | null>(null);
  const suppressEndedHandler = useRef(false);

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
        { text: 'ไม่อยากเปลี่ยนว���ธีเดินทาง', action: { type: 'LOG_AND_NAVIGATE', log: { key: 'initial_attitude', value: 'unwilling_to_change' }, destination: 'SCENE_POLICY_QNA' } },
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
      question: 'หลังจากรับชม คุณรู้สึกอย่างไร?',
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

  // Load YouTube API
  useEffect(() => {
    const initializeAPI = async () => {
      try {
        if (isYouTubeAPIReady()) {
          await initializePlayer();
          return;
        }

        await loadYouTubeAPI();
        await initializePlayer();
      } catch (error) {
        console.error('Error initializing YouTube API:', error);
      }
    };

    initializeAPI();

    return () => {
      stopProgressTimer();
      cleanupYouTubeAPI();
    };
  }, []);

  // Initialize YouTube player
  const initializePlayer = async () => {
    try {
      const player = await createYouTubePlayer('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: '6P5LGwaksbw',
        playerVars: {
          playsinline: 1,
          controls: 0,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3
        },
        events: {
          onReady: () => {
            playerReady.current = true;
          },
          onStateChange: (event: any) => {
            if (suppressEndedHandler.current && event.data === window.YT.PlayerState.ENDED) {
              return;
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              stopProgressTimer();
              const scene = storyData[currentSceneId];
              if (scene?.onEnd) {
                handleAction(scene.onEnd);
              }
            }
          }
        }
      });

      playerRef.current = player;
    } catch (error) {
      console.error('Failed to create YouTube player:', error);
    }
  };

  // Helper functions
  const stopProgressTimer = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, []);

  const logData = useCallback((key: string, value: string) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  }, []);

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
    currentEndTime.current = end;
    stopProgressTimer();

    const doSeekAndPlay = () => {
      const earlyEnd = Math.max(0, end - 0.08);
      suppressEndedHandler.current = !!opts.onceOnEnd;

      if (playerRef.current && playerReady.current) {
        playerRef.current.seekTo(start, true);
        playerRef.current.playVideo();

        progressTimer.current = setInterval(() => {
          if (!playerReady.current) return;
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
    }
  }, [currentSceneId, stopProgressTimer]);

  const handleAction = useCallback((action: any) => {
    hideAllOverlays();
    if (!action) return;

    if (action.type === 'LOG_AND_NAVIGATE') {
      logData(action.log.key, action.log.value);
      loadScene(action.destination);
    } else if (action.type === 'NAVIGATE') {
      loadScene(action.destination);
    }
  }, [hideAllOverlays, logData]);

  const loadScene = useCallback((sceneId: string) => {
    setCurrentSceneId(sceneId);
    const scene = storyData[sceneId];
    if (!scene) return;

    hideAllOverlays();

    // Exit to main survey
    if (sceneId === 'EXIT_TO_SURVEY') {
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
          options: ['ทุกวัน', 'เกือบทุกวัน', 'สัปดาห��ละ 2-3 ครั้ง', 'สัปดาห์ละครั้ง', 'นานๆ ครั้ง'] 
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
  }, [userData, hideAllOverlays, showOverlay, stopProgressTimer, playSegment, navigateToPage]);

  // Event handlers
  const handleStartClick = () => {
    setShowStartOverlay(false);
    if (playerRef.current && playerReady.current) {
      try {
        playerRef.current.unMute();
      } catch (e) {
        console.warn('Could not unmute player:', e);
      }
      loadScene('SCENE_INTRO');
    }
  };

  const handleChoiceClick = (choice: any) => {
    setSelectedChoice(choice.text);
    setTimeout(() => {
      handleAction(choice.action);
    }, 120);
  };

  const handleReplayClick = () => {
    if (!lastVideoSegment.current) return;
    returnToSceneAfterReplay.current = currentSceneId;
    hideAllOverlays();
    playSegment(lastVideoSegment.current.start, lastVideoSegment.current.end, {
      onceOnEnd: () => {
        loadScene(returnToSceneAfterReplay.current || currentSceneId);
        returnToSceneAfterReplay.current = null;
      }
    });
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center overflow-hidden">
      <div className="w-full h-full max-w-[calc(100vh*(9/16))] mx-auto relative bg-black flex flex-col justify-center">
        
        {/* YouTube Player */}
        <div id="youtube-player" className="w-full h-full" />

        {/* Start Overlay */}
        {showStartOverlay && (
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
              เริ่��ต้น
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

export default VideoIntroPage;
