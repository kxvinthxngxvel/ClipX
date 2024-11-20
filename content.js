window.onload = function () {
    const buttonContainer = document.querySelector("#top-level-buttons-computed");
  
    if (!buttonContainer) return;
  
    const clipXButton = document.createElement("button");
    clipXButton.textContent = "Download";
    clipXButton.id = "clipx-download";
    clipXButton.style.cssText = `
      padding: 8px 12px;
      background-color: #ff0000;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 8px;
    `;
  
    buttonContainer.appendChild(clipXButton);
  
    clipXButton.addEventListener("click", () => {
      const videoUrl = window.location.href;
      chrome.runtime.sendMessage({ action: "download", url: videoUrl });
    });
  };
  