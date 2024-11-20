document.getElementById("downloadButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const videoUrl = tabs[0].url;
      chrome.runtime.sendMessage({ action: "fetchVideoData", videoUrl }, (data) => {
        if (data) {
          console.log("Download options:", data);
          alert("Check the console for available download options.");
        } else {
          alert("Unable to fetch video data.");
        }
      });
    });
  });
  