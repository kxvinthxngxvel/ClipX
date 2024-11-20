// Function to add the "Download" button with a dropdown inside it
function addDownloadButton() {
  // Select the container for the Subscribe button and video metadata
  const targetContainer = document.querySelector("#top-row #owner");

  // Check if the container exists and the button isn't already added
  if (targetContainer && !document.getElementById("clipx-download-button")) {
    // Create the "Download" button
    const downloadButton = document.createElement("button");
    downloadButton.id = "clipx-download-button";
    downloadButton.className = "clipx-download-btn"; // Applying CSS class
    downloadButton.textContent = "Download"; // Default button text
    downloadButton.style.marginLeft = "10px";
    downloadButton.style.zIndex = "9999"; // Make sure the button is on top

    // Create the dropdown menu (hidden by default)
    const dropdownMenu = document.createElement("div");
    dropdownMenu.id = "clipx-dropdown";
    dropdownMenu.className = "clipx-dropdown-menu"; // Applying CSS class
    dropdownMenu.style.display = "none"; // Initially hidden
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = "100%";
    dropdownMenu.style.left = "0";
    dropdownMenu.style.marginTop = "5px";

    // Add options to the dropdown menu for quality, audio, thumbnail, and subtitles
    const options = [
      { text: "Select Quality", value: "quality" },
      { text: "Audio", value: "audio" },
      { text: "Thumbnail", value: "thumbnail" },
      { text: "Subtitles", value: "subtitles" },
    ];

    options.forEach((optionData) => {
      const option = document.createElement("div");
      option.className = "clipx-dropdown-option";
      option.textContent = optionData.text;
      option.setAttribute("data-value", optionData.value);
      dropdownMenu.appendChild(option);
    });

    // Add event listener for the download button to toggle the dropdown menu visibility
    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click event from propagating to the document
      const isDropdownVisible = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = isDropdownVisible ? "none" : "block";
    });

    // Add event listeners for each option in the dropdown
    dropdownMenu.addEventListener("click", (event) => {
      const selectedOption = event.target;
      if (selectedOption && selectedOption.classList.contains("clipx-dropdown-option")) {
        const action = selectedOption.getAttribute("data-value");
        const videoUrl = window.location.href; // Get the current video URL

        switch (action) {
          case "quality":
            downloadVideo(videoUrl, "video");
            break;
          case "audio":
            downloadVideo(videoUrl, "audio");
            break;
          case "thumbnail":
            downloadThumbnail(videoUrl);
            break;
          case "subtitles":
            downloadSubtitles(videoUrl);
            break;
          default:
            alert("Invalid selection");
        }
        dropdownMenu.style.display = "none"; // Close dropdown after selection
      }
    });

    // Append the dropdown menu to the download button
    downloadButton.appendChild(dropdownMenu);

    // Append the download button to the target container
    targetContainer.appendChild(downloadButton);
  }
}

// Function to download video, audio, or other content
function downloadVideo(videoUrl, type) {
  chrome.runtime.sendMessage(
    { type: "downloadVideo", videoUrl, downloadType: type },
    (response) => {
      if (response.status === "success") {
        alert(`Downloading: ${response.title}`);
      } else {
        alert(`Error: ${response.message}`);
      }
    }
  );
}

// Function to download thumbnail image
function downloadThumbnail(videoUrl) {
  const videoId = getVideoIdFromUrl(videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  chrome.runtime.sendMessage(
    { type: "downloadThumbnail", thumbnailUrl },
    (response) => {
      if (response.status === "success") {
        alert(`Downloading thumbnail...`);
      } else {
        alert(`Error: ${response.message}`);
      }
    }
  );
}

// Function to download subtitles
function downloadSubtitles(videoUrl) {
  const videoId = getVideoIdFromUrl(videoUrl);
  const subtitlesUrl = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`;

  chrome.runtime.sendMessage(
    { type: "downloadSubtitles", subtitlesUrl },
    (response) => {
      if (response.status === "success") {
        alert(`Downloading subtitles...`);
      } else {
        alert(`Error: ${response.message}`);
      }
    }
  );
}

// Function to extract video ID from YouTube URL
function getVideoIdFromUrl(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]+)|(?:.*?[?&]v=|\/)([a-zA-Z0-9_-]+)))/;
  const matches = url.match(regex);
  return matches && (matches[1] || matches[2]);
}

// Function to observe changes to the DOM (for dynamic page navigation)
function observeDOMChanges() {
  const observer = new MutationObserver(() => {
    addDownloadButton();
  });

  const targetNode = document.querySelector("ytd-app");
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }
}

// Initialize the script
addDownloadButton();
observeDOMChanges();
