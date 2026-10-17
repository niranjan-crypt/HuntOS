// ============================================
// HuntOS FastClip — Popup Logic
// Engineered by Niranjan Krishnakumar
// ============================================

const HUNTOS_URL = 'http://localhost:5173'; // Default local development URL

// ─── State Helpers ─────────────────────────────────────────────────────────────
const states = ['login', 'loading', 'extracted', 'success', 'error'];

function showState(name) {
  states.forEach((s) => {
    const el = document.getElementById(`state-${s}`);
    if (el) el.classList.toggle('active', s === name);
  });
}

function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── DOM References ────────────────────────────────────────────────────────────
const btnLogout   = document.getElementById('btn-logout');
const btnLogin    = document.getElementById('btn-login');
const btnSave     = document.getElementById('btn-save');
const btnRetry    = document.getElementById('btn-retry');
const btnManual   = document.getElementById('btn-manual');
const btnView     = document.getElementById('btn-view');
const cbReminder  = document.getElementById('cb-reminder');
const cbWhatsapp  = document.getElementById('cb-whatsapp');
const rowWhatsapp = document.getElementById('row-whatsapp');

// Form fields
const fCompany  = document.getElementById('f-company');
const fRole     = document.getElementById('f-role');
const fType     = document.getElementById('f-type');
const fPriority = document.getElementById('f-priority');
const fLocation = document.getElementById('f-location');
const fPackage  = document.getElementById('f-package');
const fDeadline = document.getElementById('f-deadline');
const fLink     = document.getElementById('f-link');

// ─── Stored Auth State ─────────────────────────────────────────────────────────
let currentToken = null;
let currentUser  = null;

// ─── Populate Form ─────────────────────────────────────────────────────────────
function populateForm(details) {
  fCompany.value  = details.company_name || '';
  fRole.value     = details.role         || '';
  fLocation.value = details.location     || '';
  fPackage.value  = details.package      || '';
  fLink.value     = details.application_link || '';

  const typeMap = {
    job: 'Job',
    internship: 'Internship',
    hackathon: 'Hackathon',
    oa: 'OA',
    fellowship: 'Fellowship',
  };
  fType.value = typeMap[(details.type || '').toLowerCase()] || 'Job';

  if (fPriority && details.priority) {
    fPriority.value = details.priority;
  }

  if (details.deadline) {
    try {
      const d = new Date(details.deadline);
      if (!isNaN(d)) {
        fDeadline.value = d.toISOString().split('T')[0];
      }
    } catch {
      // ignore
    }
  }
}

// ─── AI Extraction Pipeline ────────────────────────────────────────────────────
async function runExtraction() {
  showState('loading');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) throw new Error('No active browser tab detected');

    let pageData;
    try {
      pageData = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });
    } catch {
      throw new Error('Unable to inspect page. FastClip works on standard web tabs.');
    }

    if (!pageData || !pageData.content) {
      throw new Error('Could not read page content');
    }

    // Call Gemini via background service worker
    const extractRes = await chrome.runtime.sendMessage({
      action: 'extractDetails',
      content: pageData.content,
      title: pageData.title,
      url: pageData.url,
      token: currentToken,
    });

    if (!extractRes.success) {
      throw new Error(extractRes.error || 'AI parsing error');
    }

    populateForm(extractRes.data);

    if (currentUser && currentUser.whatsapp_subscribed) {
      rowWhatsapp.style.display = 'flex';
    }

    showState('extracted');
  } catch (err) {
    document.getElementById('error-detail').textContent = err.message;
    showState('error');
  }
}

// ─── Save Application to HuntOS ────────────────────────────────────────────────
async function handleSave() {
  const company = fCompany.value.trim();
  const role    = fRole.value.trim();

  fCompany.classList.toggle('error', !company);
  fRole.classList.toggle('error', !role);
  if (!company || !role) {
    showToast('Company and Role are required fields');
    return;
  }

  const applicationData = {
    company_name: company,
    role: role,
    location: fLocation.value.trim() || null,
    package: fPackage.value.trim() || null,
    deadline: fDeadline.value || null,
    application_link: fLink.value.trim() || null,
    priority: fPriority ? fPriority.value : 'Medium',
    tags: fType.value,
    createReminder: cbReminder.checked,
    sendWhatsApp: cbWhatsapp.checked,
  };

  btnSave.disabled = true;
  btnSave.innerHTML = '<div class="btn-spinner"></div> Adding to Pipeline...';

  try {
    const saveRes = await chrome.runtime.sendMessage({
      action: 'saveApplication',
      applicationData,
      token: currentToken,
    });

    if (!saveRes.success) throw new Error(saveRes.error || 'Pipeline save failed');

    const { application, reminderCreated, reminderDate } = saveRes.data;

    document.getElementById('success-detail').textContent =
      `${application.company_name} — ${application.role} is now tracked in HuntOS.`;

    const reminderEl = document.getElementById('success-reminder');
    if (reminderCreated && reminderDate) {
      const dateStr = new Date(reminderDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      reminderEl.textContent = `🔔 Smart alert configured for ${dateStr}`;
      reminderEl.style.display = 'inline-block';
    } else {
      reminderEl.style.display = 'none';
    }

    showState('success');
  } catch (err) {
    showToast(`❌ ${err.message}`);
    btnSave.disabled = false;
    btnSave.innerHTML = 'Add to HuntOS Pipeline →';
  }
}

// ─── Initialization ────────────────────────────────────────────────────────────
async function init() {
  const authRes = await chrome.runtime.sendMessage({ action: 'getToken' });
  currentToken = authRes.token;
  currentUser  = authRes.user;

  if (!currentToken) {
    showState('login');
    btnLogout.style.display = 'none';
  } else {
    btnLogout.style.display = 'block';
    runExtraction();
  }
}

// ─── Event Handlers ────────────────────────────────────────────────────────────
btnLogin.addEventListener('click', () => {
  chrome.tabs.create({ url: `${HUNTOS_URL}/login` });

  const poll = setInterval(async () => {
    const authRes = await chrome.runtime.sendMessage({ action: 'getToken' });
    if (authRes.token) {
      clearInterval(poll);
      currentToken = authRes.token;
      currentUser  = authRes.user;
      btnLogout.style.display = 'block';
      runExtraction();
    }
  }, 1500);

  setTimeout(() => clearInterval(poll), 120000);
});

btnLogout.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'clearToken' });
  currentToken = null;
  currentUser  = null;
  btnLogout.style.display = 'none';
  showState('login');
  showToast('Logged out of HuntOS');
});

btnSave.addEventListener('click', handleSave);

btnRetry.addEventListener('click', () => {
  if (currentToken) {
    runExtraction();
  } else {
    showState('login');
  }
});

btnManual.addEventListener('click', () => {
  chrome.tabs.create({ url: `${HUNTOS_URL}/applications?add=true` });
});

btnView.addEventListener('click', () => {
  chrome.tabs.create({ url: `${HUNTOS_URL}/applications` });
});

[fCompany, fRole].forEach((el) => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

init();
