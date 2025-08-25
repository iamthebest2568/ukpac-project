/**
 * YouTube API Loader Utility
 * Handles robust loading and initialization of YouTube iframe API
 * Prevents multiple loading attempts and handles race conditions
 */

// Global state to track API loading
let apiLoadPromise: Promise<void> | null = null;
let apiLoaded = false;
let loadingCallbacks: (() => void)[] = [];

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 * Check if YouTube API is already available
 */
export function isYouTubeAPIReady(): boolean {
  return !!(window.YT && window.YT.Player && typeof window.YT.Player === 'function');
}

/**
 * Load YouTube API with robust error handling
 * Returns a promise that resolves when the API is ready
 */
export function loadYouTubeAPI(): Promise<void> {
  // If API is already loaded, resolve immediately
  if (isYouTubeAPIReady()) {
    apiLoaded = true;
    return Promise.resolve();
  }

  // If loading is already in progress, return the existing promise
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  // Create new loading promise
  apiLoadPromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('YouTube API loading timeout after 20 seconds'));
    }, 20000);

    const cleanup = () => {
      clearTimeout(timeout);
      apiLoadPromise = null;
    };

    const handleAPIReady = () => {
      if (isYouTubeAPIReady()) {
        console.log('✅ YouTube API is ready');
        apiLoaded = true;
        cleanup();
        
        // Execute any pending callbacks
        loadingCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('Error in YouTube API callback:', error);
          }
        });
        loadingCallbacks = [];
        
        resolve();
      }
    };

    // Check if API is already available (might have loaded while we were setting up)
    if (isYouTubeAPIReady()) {
      handleAPIReady();
      return;
    }

    // Set up the global callback
    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      // Call original callback if it existed
      if (originalCallback && typeof originalCallback === 'function') {
        try {
          originalCallback();
        } catch (error) {
          console.error('Error in original YouTube callback:', error);
        }
      }
      handleAPIReady();
    };

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    
    if (existingScript) {
      console.log('📡 YouTube API script already exists, waiting for load...');
      
      // Poll for API availability as backup
      const pollInterval = setInterval(() => {
        if (isYouTubeAPIReady()) {
          clearInterval(pollInterval);
          handleAPIReady();
        }
      }, 100);

      // Clear polling after timeout
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 25000);
      
    } else {
      console.log('📡 Loading YouTube API script...');
      
      // Create and load script
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      
      script.onload = () => {
        console.log('📡 YouTube API script loaded');
        // Don't resolve here - wait for the API callback
      };
      
      script.onerror = () => {
        cleanup();
        reject(new Error('Failed to load YouTube API script'));
      };
      
      document.head.appendChild(script);
    }

    // Backup polling mechanism
    const backupPoll = setInterval(() => {
      if (isYouTubeAPIReady()) {
        clearInterval(backupPoll);
        handleAPIReady();
      }
    }, 500);

    // Clear backup polling after timeout
    setTimeout(() => {
      clearInterval(backupPoll);
    }, 25000);
  });

  return apiLoadPromise;
}

/**
 * Create YouTube player with error handling
 */
export function createYouTubePlayer(
  elementId: string,
  options: any
): Promise<any> {
  return loadYouTubeAPI().then(() => {
    if (!isYouTubeAPIReady()) {
      throw new Error('YouTube API not ready after loading');
    }

    return new Promise((resolve, reject) => {
      try {
        const player = new window.YT.Player(elementId, {
          ...options,
          events: {
            ...options.events,
            onReady: (event: any) => {
              console.log('🎥 YouTube player ready');
              resolve(player);
              
              // Call original onReady if provided
              if (options.events?.onReady) {
                try {
                  options.events.onReady(event);
                } catch (error) {
                  console.error('Error in onReady callback:', error);
                }
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event.data);
              reject(new Error(`YouTube player error: ${event.data}`));
              
              // Call original onError if provided
              if (options.events?.onError) {
                try {
                  options.events.onError(event);
                } catch (error) {
                  console.error('Error in onError callback:', error);
                }
              }
            }
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Cleanup YouTube API resources
 */
export function cleanupYouTubeAPI() {
  if (apiLoadPromise) {
    apiLoadPromise = null;
  }
  loadingCallbacks = [];
}

/**
 * Add callback to be executed when API is ready
 */
export function onYouTubeAPIReady(callback: () => void) {
  if (apiLoaded || isYouTubeAPIReady()) {
    // Execute immediately if API is ready
    try {
      callback();
    } catch (error) {
      console.error('Error in YouTube API ready callback:', error);
    }
  } else {
    // Add to queue
    loadingCallbacks.push(callback);
  }
}

/**
 * Reset API state (for testing/debugging)
 */
export function resetYouTubeAPIState() {
  apiLoadPromise = null;
  apiLoaded = false;
  loadingCallbacks = [];
  console.log('🔄 YouTube API state reset');
}
