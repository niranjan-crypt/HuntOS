// ============================================
// HuntOS FastClip — Content Script
// Engineered by Niranjan Krishnakumar
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    const rawText = document.body.innerText
      .substring(0, 5000)
      .replace(/\s+/g, ' ')
      .trim();

    sendResponse({
      title: document.title,
      url: window.location.href,
      content: rawText,
    });
  }
  return false;
});

// Listen for authentication sync messages from the HuntOS web platform
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'HUNTOS_LOGIN') {
    chrome.runtime.sendMessage({
      action: 'saveToken',
      token: event.data.token,
      user: event.data.user,
    });
  } else if (event.data.type === 'HUNTOS_LOGOUT') {
    chrome.runtime.sendMessage({ action: 'clearToken' });
  }
});
