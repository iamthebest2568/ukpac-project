/**
 * Debug Utility for Video Intro Issues
 * Run this in browser console to diagnose YouTube API problems
 */

// Global debug function
window.debugVideoIntro = function () {
  console.log("🔍 Video Intro Debug Report");
  console.log("==========================");

  // Check YouTube API state
  console.log("\n📺 YouTube API Status:");
  console.log("- window.YT exists:", !!window.YT);
  console.log("- window.YT.Player exists:", !!(window.YT && window.YT.Player));
  console.log("- API callback set:", !!window.onYouTubeIframeAPIReady);

  if (window.YT) {
    console.log("- YT object:", window.YT);
  }

  // Check script tags
  console.log("\n📜 Script Tags:");
  const youtubeScripts = document.querySelectorAll(
    'script[src*="youtube.com"]',
  );
  console.log("- YouTube scripts count:", youtubeScripts.length);
  youtubeScripts.forEach((script, index) => {
    console.log(`  ${index + 1}. ${script.src}`);
    console.log(`     - async: ${script.async}`);
    console.log(`     - loaded: ${script.readyState || "unknown"}`);
  });

  // Check DOM elements
  console.log("\n🎬 Video Player Elements:");
  const players = [
    "youtube-player",
    "youtube-player-fixed",
    "youtube-test-player",
  ];

  players.forEach((id) => {
    const element = document.getElementById(id);
    console.log(`- ${id}:`, element ? "exists" : "not found");
    if (element) {
      console.log(`  - innerHTML length: ${element.innerHTML.length}`);
      console.log(`  - children count: ${element.children.length}`);
    }
  });

  // Check network
  console.log("\n🌐 Network Status:");
  console.log("- Online:", navigator.onLine);
  console.log(
    "- Connection:",
    navigator.connection ? navigator.connection.effectiveType : "unknown",
  );

  // Check for common issues
  console.log("\n⚠️  Common Issues Check:");

  // CSP issues
  const metaTags = document.querySelectorAll(
    'meta[http-equiv="Content-Security-Policy"]',
  );
  console.log("- CSP meta tags:", metaTags.length);

  // Mixed content
  const isHTTPS = location.protocol === "https:";
  console.log("- HTTPS:", isHTTPS);

  // Third-party scripts blocked
  try {
    const testImg = new Image();
    testImg.onload = () => console.log("✅ External resources can load");
    testImg.onerror = () => console.log("❌ External resources blocked");
    testImg.src = "https://www.youtube.com/favicon.ico";
  } catch (e) {
    console.log("❌ Error testing external resources:", e.message);
  }

  // Browser compatibility
  console.log("\n🌐 Browser Info:");
  console.log("- User Agent:", navigator.userAgent);
  console.log("- Cookies enabled:", navigator.cookieEnabled);
  console.log("- Local Storage available:", typeof Storage !== "undefined");

  console.log("\n🔧 Suggested Actions:");
  console.log("1. Try: window.testYouTubeAPI()");
  console.log("2. Check browser console for errors");
  console.log("3. Verify network connectivity");
  console.log("4. Check if ad blockers are interfering");

  return {
    ytAPI: !!(window.YT && window.YT.Player),
    scriptsCount: youtubeScripts.length,
    online: navigator.onLine,
    https: isHTTPS,
  };
};

// Test YouTube API loading
window.testYouTubeAPI = async function () {
  console.log("🧪 Testing YouTube API Loading...");

  try {
    // Clear any existing scripts (for testing)
    const existingScripts = document.querySelectorAll(
      'script[src*="youtube.com"]',
    );
    console.log(`Found ${existingScripts.length} existing YouTube scripts`);

    // Load API manually
    if (!window.YT || !window.YT.Player) {
      console.log("Loading fresh YouTube API...");

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      const loadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Script load timeout"));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log("✅ Script loaded");
          resolve();
        };

        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Script load error"));
        };
      });

      document.head.appendChild(script);
      await loadPromise;
    }

    // Wait for API ready
    console.log("Waiting for YouTube API...");
    const apiPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("API ready timeout"));
      }, 15000);

      const checkAPI = () => {
        if (window.YT && window.YT.Player) {
          clearTimeout(timeout);
          console.log("✅ YouTube API ready");
          resolve();
        } else {
          setTimeout(checkAPI, 100);
        }
      };

      // Set up callback
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timeout);
        console.log("✅ API callback triggered");
        resolve();
      };

      checkAPI();
    });

    await apiPromise;

    console.log("✅ YouTube API test completed successfully");
    return true;
  } catch (error) {
    console.error("❌ YouTube API test failed:", error.message);
    return false;
  }
};

// Quick test function
window.quickVideoTest = function () {
  console.log("🚀 Quick Video Test");

  if (!window.YT || !window.YT.Player) {
    console.log("❌ YouTube API not available");
    return false;
  }

  // Create test element
  const testDiv = document.createElement("div");
  testDiv.id = "quick-test-player";
  testDiv.style.position = "fixed";
  testDiv.style.top = "10px";
  testDiv.style.right = "10px";
  testDiv.style.width = "320px";
  testDiv.style.height = "180px";
  testDiv.style.zIndex = "9999";
  testDiv.style.border = "2px solid red";
  document.body.appendChild(testDiv);

  try {
    const player = new window.YT.Player("quick-test-player", {
      height: "180",
      width: "320",
      videoId: "6P5LGwaksbw",
      events: {
        onReady: () => {
          console.log("✅ Quick test player ready");
          setTimeout(() => {
            try {
              player.destroy();
              document.body.removeChild(testDiv);
              console.log("✅ Quick test completed");
            } catch (e) {
              console.log("⚠️ Cleanup error:", e.message);
            }
          }, 3000);
        },
        onError: (event) => {
          console.log("❌ Quick test player error:", event.data);
          try {
            document.body.removeChild(testDiv);
          } catch (e) {}
        },
      },
    });

    console.log("✅ Quick test player created");
    return true;
  } catch (error) {
    console.log("❌ Quick test failed:", error.message);
    try {
      document.body.removeChild(testDiv);
    } catch (e) {}
    return false;
  }
};

console.log("🔧 Video Intro Debug Tools Loaded");
console.log("Available functions:");
console.log("- window.debugVideoIntro() - Full diagnostic");
console.log("- window.testYouTubeAPI() - Test API loading");
console.log("- window.quickVideoTest() - Quick player test");
