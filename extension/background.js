// ============================================
// HuntOS FastClip — Background Service Worker
// Engineered by Niranjan Krishnakumar
// ============================================

// ─── Config ──────────────────────────────────────────────────────────────────
const BACKEND_URL = 'http://localhost:4000'; // Change to production URL when deployed

// ─── AI Extraction via Backend ────────────────────────────────────────────────
async function extractViaBackend(content, title, url, token) {
  const response = await fetch(`${BACKEND_URL}/api/ai/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, title, url }),
  });

  let data;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Server error (${response.status}): The backend returned an invalid response.`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
  }

  return data.data;
}

// ─── Save Application ─────────────────────────────────────────────────────────
async function saveApplication(applicationData, token) {
  // Step 1: Save application
  const appResponse = await fetch(`${BACKEND_URL}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      company_name: applicationData.company_name,
      role: applicationData.role,
      location: applicationData.location || null,
      package: applicationData.package || null,
      application_date: new Date().toISOString().split('T')[0],
      deadline: applicationData.deadline || null,
      application_link: applicationData.application_link || null,
      priority: applicationData.priority || 'Medium',
      tags: applicationData.tags || 'FastClip',
      notes: applicationData.notes || `Added via HuntOS FastClip`,
      status: 'Applied',
    }),
  });

  let appData;
  const text = await appResponse.text();
  try {
    appData = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Server error (${appResponse.status}): The backend returned an invalid response.`);
  }

  if (!appResponse.ok || !appData.success) {
    throw new Error(appData.message || `Server error: ${appResponse.status} ${appResponse.statusText}`);
  }

  let reminderCreated = false;
  let reminderDate = null;

  // Since the backend now automatically creates the reminder, 
  // we just calculate the date to show in the UI.
  if (applicationData.deadline) {
    const deadlineDate = new Date(applicationData.deadline);
    const rd = new Date(deadlineDate);

    if (rd > new Date()) {
      reminderDate = rd;
      reminderCreated = true;
    }
  }

  return {
    application: appData.data,
    reminderCreated,
    reminderDate: reminderDate ? reminderDate.toISOString() : null,
  };
}

// ─── Message Router ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractDetails') {
    extractViaBackend(request.content, request.title, request.url, request.token)
      .then((details) => sendResponse({ success: true, data: details }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async
  }

  if (request.action === 'saveApplication') {
    saveApplication(request.applicationData, request.token)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === 'getToken') {
    chrome.storage.local.get(['huntos_token', 'huntos_user', 'cf_token', 'cf_user'], (result) => {
      sendResponse({
        token: result.huntos_token || result.cf_token || null,
        user: result.huntos_user || result.cf_user || null,
      });
    });
    return true;
  }

  if (request.action === 'saveToken') {
    chrome.storage.local.set({
      huntos_token: request.token,
      huntos_user: request.user,
      cf_token: request.token,
      cf_user: request.user,
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'clearToken') {
    chrome.storage.local.remove(['huntos_token', 'huntos_user', 'cf_token', 'cf_user'], () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
