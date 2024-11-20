chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "download") {
      const apiUrl = "https://your-backend-url.com/video"; // Replace with your backend URL
      fetch(`${apiUrl}?video_url=${encodeURIComponent(message.url)}`)
        .then((response) => response.json())
        .then((data) => {
          chrome.downloads.download({
            url: data.download_link,
            filename: `${data.title}.mp4`
          });
        })
        .catch((error) => console.error("Error downloading video:", error));
    }
  });
  