chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "downloadVideo") {
    const videoUrl = request.videoUrl;
    const quality = request.quality;

    // Logic to initiate download based on selected quality (you can customize this part)
    console.log(`Downloading video from ${videoUrl} with ${quality}`);

    sendResponse({
      status: "success",
      title: `Video Downloading in ${quality}`,
    });
  }
});
