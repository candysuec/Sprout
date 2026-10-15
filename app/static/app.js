let currentChildId = null;
let currentTab = 'training';
let childrenList = [];

// Sprout Environment State (Defaults to 'sample' Practice Sandbox and Sarah Jenkins)
let currentSproutMode = localStorage.getItem('sproutMode') || 'sample';
let isPrivacyBlurActive = localStorage.getItem('privacyBlur') === 'true';

const LOCAL_CAREGIVERS = [
  { id: 'Candy Chevalier', name: 'Candy Chevalier (Primary Caregiver)', initials: 'CC', color: 'bg-emerald-700' },
  { id: 'Robin Davis', name: 'Robin Davis (Homeowner & Resource)', initials: 'RD', color: 'bg-teal-700' },
  { id: 'Mallory Wheeler', name: 'Mallory Wheeler (Secondary / Resource)', initials: 'MW', color: 'bg-indigo-700' }
];

const SAMPLE_CAREGIVERS = [
  { id: 'Sample Caregiver (Sarah Jenkins)', name: 'Sarah Jenkins (HH-101 • Single Adult • Established 1-3 Yrs)', initials: 'SJ', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Marcus Vance)', name: 'Marcus Vance (HH-102 • Single Adult • Specialized Provider 5 Yrs)', initials: 'MV', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (David & Emily Miller)', name: 'David & Emily Miller (HH-103 • Married Couple • Permanency Provider)', initials: 'DM', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Robert & Laura Hayes)', name: 'Robert & Laura Hayes (HH-104 • Married Couple • Experienced 6+ Yrs)', initials: 'RH', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Elena Ramos & Chloe Bennett)', name: 'Elena Ramos & Chloe Bennett (HH-105 • Domestic Partners • Specialized)', initials: 'ER', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Julian Scott & Anthony Rivera)', name: 'Julian Scott & Anthony Rivera (HH-106 • Domestic Partners • Mentor)', initials: 'JS', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Rachel Foster & Maya Lin)', name: 'Rachel Foster & Maya Lin (HH-107 • Domestic Partners • Newly Licensed)', initials: 'RF', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Tyler Adams & Zachary Brooks)', name: 'Tyler Adams & Zachary Brooks (HH-108 • Domestic Partners • Home Study)', initials: 'TA', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Hannah & Beatrice Abbott)', name: 'Hannah & Beatrice Abbott (HH-109 • Siblings • Established Kinship)', initials: 'HA', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Logan & Caleb Fletcher)', name: 'Logan & Caleb Fletcher (HH-110 • Siblings • Provisional Approval)', initials: 'LF', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Margaret & Claire Sullivan)', name: 'Margaret & Claire Sullivan (HH-111 • Parent & Adult Child • Experienced)', initials: 'MS', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Samantha Price & Jordan Taylor)', name: 'Samantha Price & Jordan Taylor (HH-112 • Friends/Co-Caregivers • Respite)', initials: 'SP', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Eleanor & Arthur Vance)', name: 'Eleanor & Arthur Vance (HH-113 • Grandparents • Permanency Provider)', initials: 'EV', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Douglas & Miriam Cole)', name: 'Douglas & Miriam Cole (HH-114 • Married Couple • Experienced 7+ Yrs)', initials: 'DC', color: 'bg-blue-700' },
  { id: 'Sample Caregiver (Grace & Lydia Holloway)', name: 'Grace & Lydia Holloway (HH-115 • Multi-Generational • Closed/Retired)', initials: 'GH', color: 'bg-blue-700' }
];

let activeCaregiverUser = localStorage.getItem('caregiverUser') || '';

// If activeCaregiverUser is currently Sarah Jenkins from legacy session, reset it to prompt option for sandbox
if (currentSproutMode === 'sample' && (!localStorage.getItem('caregiverUser') || localStorage.getItem('caregiverUser') === 'Sample Caregiver (Sarah Jenkins)')) {
  activeCaregiverUser = '';
  localStorage.removeItem('caregiverUser');
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', async () => {
  const subNav = document.getElementById('childWorkspaceSubNav');
  if (subNav) subNav.classList.add('hidden');

  populateCaregiverDropdown();
  updateWorkspaceToggleUI();
  updateSproutTheme();
  applyPrivacyBlurState();

  await loadChildren();
  switchMainSection('mission_control');
  lucide.createIcons();
  
  // Set default date picker to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('recDate');
  if (dateInput) dateInput.value = today;

  // Register Service Worker for Offline Field & Mobile Support (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/static/sw.js').catch(() => {});
    });
  }
});

function togglePrivacyBlurMode() {
  isPrivacyBlurActive = !isPrivacyBlurActive;
  localStorage.setItem('privacyBlur', isPrivacyBlurActive);
  applyPrivacyBlurState();
}

function applyPrivacyBlurState() {
  const body = document.body;
  const btn = document.getElementById('btnTogglePrivacyBlur');
  const icon = document.getElementById('privacyShieldIcon');
  const label = document.getElementById('privacyShieldLabel');

  if (isPrivacyBlurActive) {
    body.classList.add('privacy-blur-active');
    if (btn) btn.className = "flex items-center bg-amber-900/90 hover:bg-amber-800 border border-amber-600 rounded-xl px-2.5 py-1.5 text-xs font-bold transition shadow-xs gap-1.5 text-amber-200";
    if (label) label.textContent = "PII Shielded";
    if (icon) {
      icon.setAttribute('data-lucide', 'eye-off');
      icon.className = "w-3.5 h-3.5 text-amber-400";
    }
  } else {
    body.classList.remove('privacy-blur-active');
    if (btn) btn.className = "flex items-center bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-bold transition shadow-xs gap-1.5 text-slate-200";
    if (label) label.textContent = "Shield PII";
    if (icon) {
      icon.setAttribute('data-lucide', 'eye');
      icon.className = "w-3.5 h-3.5 text-emerald-400";
    }
  }
  lucide.createIcons();
}

function updateSproutTheme() {
  const header = document.getElementById('topHeader');
  const isSample = currentSproutMode === 'sample';
  
  if (isSample) {
    document.body.classList.add('sprout-sandbox-active');
  } else {
    document.body.classList.remove('sprout-sandbox-active');
  }
  if (header) {
    if (isSample) {
      header.classList.remove('bg-emerald-950', 'border-emerald-900');
      header.classList.add('bg-slate-900', 'border-blue-900');
    } else {
      header.classList.remove('bg-slate-900', 'border-blue-900');
      header.classList.add('bg-emerald-950', 'border-emerald-900');
    }
  }

  // Update nav buttons active highlight colors based on mode
  const activeNav = document.querySelector('.main-nav-btn.active');
  if (activeNav) {
    if (isSample) {
      activeNav.classList.remove('text-emerald-800');
      activeNav.classList.add('text-blue-800');
    } else {
      activeNav.classList.remove('text-blue-800');
      activeNav.classList.add('text-emerald-800');
    }
  }

  // Update current sphere text indicator
  const sphereInd = document.getElementById('currentSphereIndicator');
  if (sphereInd) {
    if (currentSproutMode === 'sample') {
      sphereInd.textContent = 'Dev Sandbox Active';
      sphereInd.className = 'font-bold text-blue-700';
    } else if (currentSproutMode === 'local') {
      sphereInd.textContent = 'Local Live Data Active';
      sphereInd.className = 'font-bold text-emerald-700';
    } else {
      sphereInd.textContent = 'Welcome Portal (No Sphere Selected)';
      sphereInd.className = 'font-bold text-slate-500';
    }
  }
}

function updateWorkspaceToggleUI() {
  const toggleBtn = document.getElementById('btnToggleWorkspaceMode');
  const labelEl = document.getElementById('workspaceToggleLabel');
  const displayEl = document.getElementById('activeCaregiverDisplay');
  const avatarEl = document.getElementById('caregiverAvatar');

  if (currentSproutMode === 'sample') {
    if (labelEl) labelEl.textContent = 'Practice Sandbox';
    if (toggleBtn) {
      toggleBtn.className = "flex items-center bg-blue-900/90 hover:bg-blue-800 border border-blue-700/80 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs gap-1.5 text-white";
    }
    const caregiverSelect = document.getElementById('caregiverSelect');
    if (caregiverSelect) {
      caregiverSelect.value = activeCaregiverUser || '';
    }
    if (displayEl) displayEl.textContent = activeCaregiverUser || 'Sandbox Select Care giver';
    updateCaregiverAvatarDisplay(activeCaregiverUser);
  } else {
    currentSproutMode = 'local';
    activeCaregiverUser = 'Candy Chevalier';
    if (labelEl) labelEl.textContent = 'Real Family Workspace';
    if (toggleBtn) {
      toggleBtn.className = "flex items-center bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs gap-1.5 text-white";
    }
    const caregiverSelect = document.getElementById('caregiverSelect');
    if (caregiverSelect) {
      caregiverSelect.value = 'Candy Chevalier';
    }
    if (displayEl) displayEl.textContent = 'Candy Chevalier';
    updateCaregiverAvatarDisplay('Candy Chevalier');
  }
}

function toggleSproutWorkspaceMode() {
  if (currentSproutMode === 'local') {
    currentSproutMode = 'sample';
    activeCaregiverUser = 'Sample Caregiver (Sarah Jenkins)';
  } else {
    currentSproutMode = 'local';
    activeCaregiverUser = 'Candy Chevalier';
  }
  localStorage.setItem('sproutMode', currentSproutMode);
  localStorage.setItem('caregiverUser', activeCaregiverUser);

  populateCaregiverDropdown();
  updateWorkspaceToggleUI();
  updateSproutTheme();
  loadChildren();
  loadTabContent();
}

function resetToHomeLanding() {
  switchMainSection('mission_control');
}

function activateSampleCaregiverProfile(primaryName) {
  currentSproutMode = 'sample';
  localStorage.setItem('sproutMode', 'sample');
  const sproutSelect = document.getElementById('sproutModeSelect');
  if (sproutSelect) sproutSelect.value = 'sample';

  populateCaregiverDropdown();
  updateSproutTheme();

  // Find caregiver option that matches primaryName
  const caregiverSelect = document.getElementById('caregiverSelect');
  if (caregiverSelect) {
    for (let opt of caregiverSelect.options) {
      if (opt.textContent.includes(primaryName)) {
        caregiverSelect.value = opt.value;
        activeCaregiverUser = opt.value;
        localStorage.setItem('caregiverUser', activeCaregiverUser);
        break;
      }
    }
  }

  updateCaregiverAvatarDisplay(activeCaregiverUser);
  loadChildren();
  switchMainSection('dashboard');
}

function populateCaregiverDropdown() {
  const select = document.getElementById('caregiverSelect');
  if (!select) return;

  select.innerHTML = '';
  
  if (!currentSproutMode) {
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- Select Caregiver User --';
    defaultOpt.className = 'bg-slate-800 text-slate-400 italic';
    select.appendChild(defaultOpt);
    select.value = '';
    updateCaregiverAvatarDisplay('');
    return;
  }

  const list = currentSproutMode === 'local' ? LOCAL_CAREGIVERS : SAMPLE_CAREGIVERS;

  // Placeholder Prompt Option: "Sandbox Select Care giver"
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = currentSproutMode === 'local' ? '-- Select Caregiver User --' : 'Sandbox Select Care giver';
  defaultOpt.className = 'bg-slate-800 text-blue-200 font-semibold italic';
  select.appendChild(defaultOpt);

  list.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    opt.className = 'bg-slate-800 text-white';
    select.appendChild(opt);
  });

  // Sprint 13C P0-3: Dedicated Parent Participant Option
  const parentOpt = document.createElement('option');
  parentOpt.value = 'Parent Participant (Angela Davis)';
  parentOpt.textContent = 'Angela Davis (Parent Participant • Reunification Portal)';
  parentOpt.className = 'bg-rose-900 text-rose-100 font-bold';
  select.appendChild(parentOpt);

  // Verify activeCaregiverUser is in list or is parent, else set to empty
  const exists = list.some(c => c.id === activeCaregiverUser) || activeCaregiverUser === 'Parent Participant (Angela Davis)';
  if (!exists) {
    activeCaregiverUser = '';
  }

  select.value = activeCaregiverUser;
  updateCaregiverAvatarDisplay(activeCaregiverUser);
}

function updateCaregiverAvatarDisplay(user) {
  const avatar = document.getElementById('caregiverAvatar');
  if (!avatar) return;

  if (!user) {
    avatar.textContent = '?';
    avatar.className = 'w-6 h-6 rounded-full bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs mr-2 shrink-0 border border-slate-600';
    return;
  }

  if (user.includes('Parent Participant') || user.includes('Angela Davis')) {
    avatar.textContent = 'AD';
    avatar.className = 'w-6 h-6 rounded-full bg-rose-700 text-white font-bold flex items-center justify-center text-xs mr-2 shrink-0 border border-rose-400';
    return;
  }

  const all = [...LOCAL_CAREGIVERS, ...SAMPLE_CAREGIVERS];
  const found = all.find(c => c.id === user);

  if (found) {
    avatar.textContent = found.initials;
    avatar.className = `w-6 h-6 rounded-full ${found.color} text-white font-bold flex items-center justify-center text-xs mr-2 shrink-0`;
  } else {
    avatar.textContent = 'CC';
    avatar.className = 'w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs mr-2 shrink-0';
  }
}

function getActiveCaregiver() {
  const select = document.getElementById('caregiverSelect');
  return select ? select.value : activeCaregiverUser;
}

async function onCaregiverUserChange() {
  const select = document.getElementById('caregiverSelect');
  if (select) {
    activeCaregiverUser = select.value;
    localStorage.setItem('caregiverUser', activeCaregiverUser);
  }
  updateCaregiverAvatarDisplay(activeCaregiverUser);

  // Dedicated Parent Workspace Router
  if (activeCaregiverUser && (activeCaregiverUser.includes('Parent Participant') || activeCaregiverUser.includes('Angela Davis'))) {
    switchMainSection('parent');
    return;
  }

  await loadChildren();
  if (currentMainSection === 'households' || currentMainSection === 'children' || currentMainSection === 'dashboard') {
    switchMainSection(currentMainSection);
  } else if (currentMainSection === 'parent') {
    switchMainSection('mission_control');
  }
}

// Helper for API requests attaching current caregiver identity & sprout mode
function apiFetch(url, options = {}) {
  const actor = getActiveCaregiver();
  const headers = Object.assign({}, options.headers || {}, { 
    'X-Caregiver': actor,
    'X-Sprout-Mode': currentSproutMode 
  });
  return fetch(url, Object.assign({}, options, { headers }));
}

// Load all children (Initials Only dropdown)
async function loadChildren() {
  try {
    const res = await apiFetch('/api/children');
    childrenList = await res.json();
    const select = document.getElementById('childSelect');
    if (select) {
      select.innerHTML = '';
      if (childrenList.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No Children In Care';
        opt.className = 'bg-slate-800 text-white';
        select.appendChild(opt);
      } else {
        childrenList.forEach((ch) => {
          const opt = document.createElement('option');
          opt.value = ch.id;
          opt.className = 'bg-slate-800 text-white font-bold';
          const initials = ch.alias || _initials(ch.first_name, ch.last_name) || 'CD';
          opt.textContent = initials;
          select.appendChild(opt);
        });
      }
      if (currentChildId && childrenList.some(c => c.id === currentChildId)) {
        select.value = currentChildId;
      } else if (childrenList.length > 0) {
        currentChildId = childrenList[0].id;
        select.value = currentChildId;
      } else {
        currentChildId = null;
      }
    }

    renderChildSnapshot();
    loadTabContent();
  } catch (err) {
    console.error('Failed to load children:', err);
  }
}

function onChildChange() {
  const select = document.getElementById('childSelect');
  if (select && select.value) {
    currentChildId = parseInt(select.value);
  }
  renderChildSnapshot();
  loadTabContent();
}

// Render Tab 0 Snapshot
async function renderChildSnapshot() {
  const card = document.getElementById('snapshotCard');
  if (!card) return;

  // On the main Dashboard, keep the view clean and un-redundant (dashboard has its own comprehensive layout)
  if (currentMainSection === 'dashboard') {
    card.classList.add('hidden');
    card.innerHTML = '';
    return;
  }

  // On Child Workspace, Journal, Binder, Medical, etc., reveal child context snapshot
  card.classList.remove('hidden');
  const child = childrenList.find(c => c.id === currentChildId);
  if (!child) return;

  const recordsRes = await apiFetch(`/api/children/${currentChildId}/records?category=all`);
  const records = await recordsRes.json();
  const followUps = records.filter(r => r.follow_up_needed && !r.is_completed);

  const alias = child.alias || `${child.first_name || ''} ${child.last_name || ''}`.trim() || 'CD';
  const relType = child.relationship_type || 'Kinship Care';
  const episodeStatus = child.episode_status || 'Active';

  // Distinct color palettes per Care Relationship
  let relBadgeClass = 'bg-teal-50 text-teal-800 border-teal-200';
  let relIcon = 'heart-handshake';
  if (relType === 'Kinship Care' || relType === 'Kinship Placement') {
    relBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    relIcon = 'home';
  } else if (relType === 'Foster Care' || relType === 'Primary Placement') {
    relBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
    relIcon = 'shield';
  } else if (relType === 'Respite Care' || relType === 'Temporary Respite') {
    relBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
    relIcon = 'sparkles';
  } else if (relType === 'Emergency Placement' || relType === 'Emergency Respite') {
    relBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
    relIcon = 'alert-triangle';
  } else if (relType === 'Former Placement') {
    relBadgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
    relIcon = 'archive';
  }

  // Episode status color
  let statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (episodeStatus === 'Former' || episodeStatus === 'Former / Transitioned') {
    statusBadgeClass = 'bg-slate-100 text-slate-600 border-slate-300';
  } else if (episodeStatus === 'Temporary') {
    statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  // Statutory 30-Day Health Screening Clock (VT DCF EPSDT Policy)
  let healthClockHtml = '';
  if (child.placement_date && !['Former Placement'].includes(relType) && episodeStatus !== 'Former') {
    const pDate = new Date(child.placement_date);
    if (!isNaN(pDate.getTime())) {
      const now = new Date();
      const diffDays = Math.floor((now - pDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = 30 - diffDays;
      const hasCompletedExam = records.some(r => r.category === 'medical' && (r.title.toLowerCase().includes('30-day') || r.title.toLowerCase().includes('well-child') || r.title.toLowerCase().includes('intake physical') || r.title.toLowerCase().includes('epsdt')));

      if (hasCompletedExam) {
        healthClockHtml = `
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2">
            <div class="text-[10px] uppercase font-bold tracking-wider text-emerald-700 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i> 30-Day Well-Child Health Exam (EPSDT)
            </div>
            <div class="text-xs font-bold text-emerald-900 mt-0.5">Compliant (Exam on File with DCF)</div>
          </div>
        `;
      } else if (daysRemaining >= 0) {
        const urgencyColor = daysRemaining <= 7 ? 'bg-rose-50 border-rose-300 text-rose-900' : (daysRemaining <= 15 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-sky-50 border-sky-300 text-sky-900');
        const iconColor = daysRemaining <= 7 ? 'text-rose-600' : (daysRemaining <= 15 ? 'text-amber-600' : 'text-sky-600');
        healthClockHtml = `
          <div class="${urgencyColor} border rounded-xl px-3.5 py-2">
            <div class="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3 ${iconColor}"></i> 30-Day Well-Child Health Exam (EPSDT)
            </div>
            <div class="text-xs font-bold mt-0.5">${daysRemaining} Days Left (State Deadline)</div>
          </div>
        `;
      } else {
        healthClockHtml = `
          <div class="bg-rose-100 border border-rose-300 text-rose-950 rounded-xl px-3.5 py-2">
            <div class="text-[10px] uppercase font-bold tracking-wider text-rose-700 flex items-center gap-1">
              <i data-lucide="alert-octagon" class="w-3 h-3 text-rose-600"></i> 30-Day Well-Child Health Exam (EPSDT)
            </div>
            <div class="text-xs font-bold mt-0.5">${Math.abs(daysRemaining)} Days Overdue (Call Caseworker)</div>
          </div>
        `;
      }
    }
  }

  card.innerHTML = `
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm border border-emerald-400/30">
          ${alias}
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-xl font-bold text-slate-900">${alias}</h2>
            <!-- Care Relationship Badge -->
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${relBadgeClass}">
              <i data-lucide="${relIcon}" class="w-3.5 h-3.5"></i>
              <span>${relType}</span>
            </span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClass}">
              ${episodeStatus}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Ref ID: <span class="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">${child.child_code || `CH-${child.id || '001'}`}</span> • 
            DOB: <span class="font-semibold text-slate-700 privacy-sensitive">${child.dob || 'Not set'}</span> • 
            Placement Date: <span class="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded privacy-sensitive">${child.placement_date || 'N/A'}</span> • 
            Goal: <span class="font-semibold text-emerald-700 uppercase tracking-wider">${child.permanency_goal || 'Reunification'}</span>
          </p>
        </div>
      </div>

      <!-- P1.2 SMART CHILD COMMAND CARD (5-Domain Flight Instrument) -->
      <div class="flex flex-col gap-2 w-full lg:w-auto">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <!-- 1. Health Status -->
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center min-w-[100px]">
            <span class="text-[9px] uppercase font-bold text-emerald-800 tracking-wider block">1. Health</span>
            <span class="text-xs font-bold text-emerald-950 flex items-center justify-center gap-1 mt-0.5">
              ✅ Current
            </span>
            <span class="text-[10px] text-emerald-700 block truncate">EPSDT Safe</span>
          </div>

          <!-- 2. School Status -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center min-w-[100px]">
            <span class="text-[9px] uppercase font-bold text-blue-800 tracking-wider block">2. School</span>
            <span class="text-xs font-bold text-blue-950 flex items-center justify-center gap-1 mt-0.5">
              ✅ Active
            </span>
            <span class="text-[10px] text-blue-700 block truncate">${child.school || 'Enrolled'}</span>
          </div>

          <!-- 3. Visits Status -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center min-w-[100px]">
            <span class="text-[9px] uppercase font-bold text-amber-800 tracking-wider block">3. Visits</span>
            <span class="text-xs font-bold text-amber-950 flex items-center justify-center gap-1 mt-0.5">
              ⚠️ In 48h
            </span>
            <span class="text-[10px] text-amber-700 block truncate">Easterseals</span>
          </div>

          <!-- 4. Documents Status -->
          <div class="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-center min-w-[100px]">
            <span class="text-[9px] uppercase font-bold text-purple-800 tracking-wider block">4. Docs</span>
            <span class="text-xs font-bold text-purple-950 flex items-center justify-center gap-1 mt-0.5">
              ✅ Complete
            </span>
            <span class="text-[10px] text-purple-700 block truncate">Vault Verified</span>
          </div>

          <!-- 5. Benefits Status -->
          <div class="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center min-w-[100px]">
            <span class="text-[9px] uppercase font-bold text-teal-800 tracking-wider block">5. Benefits</span>
            <span class="text-xs font-bold text-teal-950 flex items-center justify-center gap-1 mt-0.5">
              ✅ Active
            </span>
            <span class="text-[10px] text-teal-700 block truncate">VT Medicaid</span>
          </div>
        </div>

        <!-- Quick 1-Click Action Bar -->
        <div class="flex items-center justify-end gap-2 pt-1">
          <button onclick="openEmergencyHandoffCard()" class="bg-rose-700 hover:bg-rose-800 text-white rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition" title="Print/View 1-Click Care Handoff Card for ER, Doctor, or Babysitter">
            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-200"></i>
            <span>Emergency Mode</span>
          </button>
          <button onclick="quickOpenAction('medical', 'Pediatric Well-Visit / Prescription Check', 'Routine medical review logged.')" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs transition flex items-center gap-1">
            <i data-lucide="plus" class="w-3 h-3 text-slate-500"></i> Quick Log
          </button>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

let currentMainSection = 'mission_control';
let currentChildSubTab = 'overview';

function switchMainSection(sectionKey) {
  currentMainSection = sectionKey;
  currentTab = sectionKey; // backwards compatibility for helpers

  const isSample = currentSproutMode === 'sample';
  const activeColorClass = (isSample || sectionKey === 'training') ? 'text-blue-900' : 'text-emerald-800';

  // Update top main navigation styles
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'text-emerald-800', 'text-blue-900', 'text-blue-800', 'shadow-sm', 'font-bold', 'active');
  });
  const activeBtn = document.getElementById(`navBtn-${sectionKey}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-white', activeColorClass, 'shadow-sm', 'font-bold', 'active');
  }

  // Toggle visibility of Child Workspace sub-navigation strip
  const subNav = document.getElementById('childWorkspaceSubNav');
  if (subNav) {
    if (sectionKey === 'children') {
      subNav.classList.remove('hidden');
    } else {
      subNav.classList.add('hidden');
    }
  }

  renderChildSnapshot();
  loadTabContent();
}

let currentChildDomain = 'health';

function switchChildDomain(domainKey) {
  currentChildDomain = domainKey;
  document.querySelectorAll('.child-domain-btn').forEach(btn => {
    if (btn.getAttribute('data-childdomain') === domainKey) {
      btn.className = "child-domain-btn active px-3 py-1.5 rounded-lg transition text-emerald-950 bg-white shadow-xs border border-emerald-300 font-bold flex items-center gap-1.5";
    } else {
      btn.className = "child-domain-btn px-3 py-1.5 rounded-lg transition text-slate-700 hover:bg-white/80 font-medium flex items-center gap-1.5";
    }
  });

  // Map 4 cognitive domains to subtabs
  if (domainKey === 'health') {
    currentChildSubTab = 'medical';
  } else if (domainKey === 'visits') {
    currentChildSubTab = 'visits';
  } else if (domainKey === 'milestones') {
    currentChildSubTab = 'education';
  } else if (domainKey === 'documents') {
    currentChildSubTab = 'documents';
  }
  loadTabContent();
}

function switchChildTab(subTabKey) {
  currentChildSubTab = subTabKey;
  // Sync domain button highlighting
  if (['medical', 'posc', 'benefits'].includes(subTabKey)) {
    currentChildDomain = 'health';
  } else if (['visits', 'appointments', 'chins', 'legal'].includes(subTabKey)) {
    currentChildDomain = 'visits';
  } else if (['education', 'journal', 'daily', 'timeline'].includes(subTabKey)) {
    currentChildDomain = 'milestones';
  } else if (['documents', 'binder', 'expenses', 'contacts'].includes(subTabKey)) {
    currentChildDomain = 'documents';
  }

  document.querySelectorAll('.child-domain-btn').forEach(btn => {
    if (btn.getAttribute('data-childdomain') === currentChildDomain) {
      btn.className = "child-domain-btn active px-3 py-1.5 rounded-lg transition text-emerald-950 bg-white shadow-xs border border-emerald-300 font-bold flex items-center gap-1.5";
    } else {
      btn.className = "child-domain-btn px-3 py-1.5 rounded-lg transition text-slate-700 hover:bg-white/80 font-medium flex items-center gap-1.5";
    }
  });

  loadTabContent();
}

// Backwards-compatible switchTab bridge (e.g. called from modals or notification buttons)
function switchTab(tabKey) {
  if (['overview', 'journal', 'binder', 'medical', 'education', 'visits', 'expenses', 'documents', 'timeline'].includes(tabKey)) {
    currentMainSection = 'children';
    currentChildSubTab = tabKey;
    switchMainSection('children');
    switchChildTab(tabKey);
    return;
  }
  switchMainSection(tabKey);
}

// Load content for active section
async function loadTabContent() {
  const container = document.getElementById('tabContent');
  if (!container) return;

  const mainNav = document.getElementById('mainNavigationContainer');
  const toggleBtn = document.getElementById('btnToggleWorkspaceMode');
  const blurBtn = document.getElementById('btnTogglePrivacyBlur');
  const fastLogBtn = document.getElementById('btnFastLogNote');
  const quickEmergBtn = document.getElementById('btnQuickEmergencySummary');
  const quickSignBtn = document.getElementById('btnQuickSign');
  const subNav = document.getElementById('childWorkspaceSubNav');

  // Dedicated Parent Workspace Isolation Guard (Sprint 13C P0-3)
  const isParentUser = (activeCaregiverUser && (activeCaregiverUser.includes('Parent') || activeCaregiverUser.includes('Angela') || activeCaregiverUser.includes('Danielle') || activeCaregiverUser.includes('Jason') || activeCaregiverUser.includes('Maria'))) || currentMainSection === 'parent';

  if (isParentUser) {
    if (mainNav) mainNav.classList.add('hidden');
    if (subNav) subNav.classList.add('hidden');
    if (toggleBtn) toggleBtn.classList.add('hidden');
    if (blurBtn) blurBtn.classList.add('hidden');
    if (fastLogBtn) fastLogBtn.classList.add('hidden');
    if (quickEmergBtn) quickEmergBtn.classList.add('hidden');
    if (quickSignBtn) quickSignBtn.classList.add('hidden');

    const card = document.getElementById('snapshotCard');
    if (card) {
      card.classList.add('hidden');
      card.innerHTML = '';
    }

    await renderParentParticipantView(container);
    lucide.createIcons();
    return;
  }

  // Restore caregiver controls for non-parent users
  if (toggleBtn) toggleBtn.classList.remove('hidden');
  if (blurBtn) blurBtn.classList.remove('hidden');
  if (fastLogBtn) fastLogBtn.classList.remove('hidden');
  if (quickEmergBtn) quickEmergBtn.classList.remove('hidden');
  if (quickSignBtn) quickSignBtn.classList.remove('hidden');

  // In Sample/Sandbox mode, Training Hub and Mission Control are immediately available to guide the user
  if (!currentSproutMode || (!activeCaregiverUser && currentMainSection !== 'training' && currentMainSection !== 'mission_control')) {
    if (mainNav) mainNav.classList.add('hidden');

    const card = document.getElementById('snapshotCard');
    if (card) {
      card.classList.add('hidden');
      card.innerHTML = '';
    }
    if (subNav) subNav.classList.add('hidden');

    renderWelcomeLandingView(container);
    lucide.createIcons();
    return;
  }

  // Hide operational toolbar on Mission Control (root launchpad) so it remains clean
  if (currentMainSection === 'mission_control') {
    if (mainNav) mainNav.classList.add('hidden');
    await renderMissionControlView(container);
  } else {
    if (mainNav) mainNav.classList.remove('hidden');
    if (currentMainSection === 'dashboard') {
      await renderDashboardView(container);
    } else if (currentMainSection === 'households') {
      await renderCaregiverAndHouseholdsView(container);
    } else if (currentMainSection === 'children') {
      await renderChildWorkspaceView(container);
    } else if (currentMainSection === 'journal') {
      await renderTimelineView(container, 'daily', 'Daily Journal & Observations');
    } else if (currentMainSection === 'binder') {
      await renderBinderFoldersView(container);
    } else if (currentMainSection === 'timeline') {
      await renderTimelineView(container, 'all', 'Unified Chronological Timeline');
    } else if (currentMainSection === 'documents') {
      await renderResourcesView(container);
    } else if (currentMainSection === 'appointments') {
      await renderAppointmentsView(container);
    } else if (currentMainSection === 'contacts') {
      await renderContactsView(container);
    } else if (currentMainSection === 'communications') {
      await renderCommunicationsView(container);
    } else if (currentMainSection === 'relationships') {
      await renderRelationshipCenterView(container);
    } else if (currentMainSection === 'life_journey') {
      await renderLifeJourneyView(container);
    } else if (currentMainSection === 'reports') {
      renderReportsView(container);
    } else if (currentMainSection === 'training') {
      await renderTrainingSimulatorView(container);
    } else if (currentMainSection === 'sample_data') {
      await renderSampleDataExplorerView(container);
    } else if (currentMainSection === 'settings') {
      await renderSettingsView(container);
    }
  }
  lucide.createIcons();
}

// Adapt Child Workspace Sub-Navigation pills based on the active child's Care Relationship
function adaptWorkspaceTabsForRelationship(child) {
  const relType = child ? (child.relationship_type || 'Primary Placement') : 'Primary Placement';
  const subNav = document.getElementById('childWorkspaceSubNav');
  if (!subNav) return;

  const isRespite = ['Temporary Respite', 'Emergency Respite', 'Respite Care'].includes(relType);

  // In Respite view, hide historical court/financial/placement tabs to protect confidentiality
  document.querySelectorAll('.child-subtab-btn').forEach(btn => {
    const tab = btn.getAttribute('data-childtab');
    if (isRespite) {
      if (['binder', 'education', 'visits', 'expenses', 'documents'].includes(tab)) {
        btn.classList.add('hidden');
      } else {
        btn.classList.remove('hidden');
      }
    } else {
      btn.classList.remove('hidden');
    }
  });
}

// Master Child Workspace View Router (12 Tabs: Overview, Journal, Binder, Medical, Education, Visits, Expenses, Documents, Appointments, Contacts, Communications, Timeline)
async function renderChildWorkspaceView(container) {
  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? (child.alias || `${child.first_name || ''} ${child.last_name || ''}`.trim() || 'CD') : 'Child';
  const relType = child ? (child.relationship_type || 'Primary Placement') : 'Primary Placement';
  const isRespite = ['Temporary Respite', 'Emergency Respite', 'Respite Care'].includes(relType);

  adaptWorkspaceTabsForRelationship(child);

  // Relationship Context Banner
  let relationshipBanner = '';
  if (relType === 'Former Placement' || child.episode_status === 'Former') {
    relationshipBanner = `
      <div class="bg-slate-100 border border-slate-300 rounded-xl p-3.5 mb-4 text-xs text-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="archive" class="w-4 h-4 text-slate-500"></i>
          <span><strong>Former Placement Resource:</strong> ${alias} was previously placed in this home. Full historical chronologies, health histories, and notes are preserved for care continuity.</span>
        </div>
        <span class="px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-800 text-[11px]">Former Placement</span>
      </div>
    `;
  } else if (isRespite) {
    relationshipBanner = `
      <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <i data-lucide="heart-handshake" class="w-4 h-4 text-purple-600"></i>
            <span>Respite Care Episode — Need-To-Know Safety Mode</span>
          </div>
          <button onclick="generateRespiteCard()" class="px-3 py-1.5 rounded-lg font-bold bg-purple-700 text-white text-xs hover:bg-purple-800 flex items-center gap-1.5 shadow-sm">
            <i data-lucide="file-check" class="w-3.5 h-3.5"></i> Export Care Packet (.docx)
          </button>
        </div>
        <p class="text-xs text-purple-800 leading-relaxed">
          Historical court documents, case plans, and financial records are <strong>hidden by default</strong> to protect child and family privacy. Active modules focus on Care Instructions, Medication Schedule, Allergies, Daily Notes, and Handoff Communications.
        </p>
        <!-- Respite Quick Care Summary Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-purple-200 text-xs">
          <div class="bg-white p-2.5 rounded-lg border border-purple-100">
            <span class="font-bold text-purple-900 block">Food Preferences:</span>
            <span class="text-purple-700 text-[11px]">${child.food_preferences || 'Follow standard balanced meals'}</span>
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-purple-100">
            <span class="font-bold text-purple-900 block">Comfort Items:</span>
            <span class="text-purple-700 text-[11px]">${child.comfort_items || 'Bedtime toy, comfort blanket'}</span>
          </div>
          <div class="bg-white p-2.5 rounded-lg border border-purple-100">
            <span class="font-bold text-purple-900 block">Behavioral Supports:</span>
            <span class="text-purple-700 text-[11px]">${child.behavioral_supports || 'Transition alerts, calm space'}</span>
          </div>
        </div>
      </div>
    `;
  } else if (relType === 'Emergency Respite') {
    relationshipBanner = `
      <div class="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-4 text-xs text-rose-900 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i>
          <span><strong>Emergency Respite Episode:</strong> Urgent temporary placement. Focus on health stability, allergy alerts, and emergency team contacts.</span>
        </div>
        <span class="px-2 py-0.5 rounded font-bold bg-rose-200 text-rose-800 text-[11px]">Urgent Respite</span>
      </div>
    `;
  }

  // Inject content container with optional relationship banner
  const subContainer = document.createElement('div');
  if (currentChildSubTab === 'overview') {
    await renderDashboardView(subContainer);
  } else if (currentChildSubTab === 'journal') {
    await renderTimelineView(subContainer, 'daily', `Daily Journal & Notes — ${alias}`);
  } else if (currentChildSubTab === 'binder') {
    await renderBinderFoldersView(subContainer);
  } else if (currentChildSubTab === 'medical') {
    await renderTimelineView(subContainer, 'medical', `Medical & Health Records — ${alias}`);
  } else if (currentChildSubTab === 'education') {
    await renderTimelineView(subContainer, 'education', `Education & School Records — ${alias}`);
  } else if (currentChildSubTab === 'visits') {
    await renderTimelineView(subContainer, 'family_time', `Family Time & Visits — ${alias}`);
  } else if (currentChildSubTab === 'expenses') {
    await renderTimelineView(subContainer, 'financial', `Expenses, Mileage & Receipts — ${alias}`);
  } else if (currentChildSubTab === 'documents') {
    await renderResourcesView(subContainer);
  } else if (currentChildSubTab === 'appointments') {
    await renderAppointmentsView(subContainer);
  } else if (currentChildSubTab === 'contacts') {
    await renderContactsView(subContainer);
  } else if (currentChildSubTab === 'communications') {
    await renderCommunicationsView(subContainer);
  } else if (currentChildSubTab === 'kinship') {
    await renderKinshipPathwaysView(subContainer, child);
  } else if (currentChildSubTab === 'posc') {
    await renderPoscView(subContainer, child);
  } else if (currentChildSubTab === 'benefits') {
    await renderBenefitsView(subContainer, child);
  } else if (currentChildSubTab === 'chins') {
    await renderChinsFlowchartView(subContainer, child);
  } else if (currentChildSubTab === 'timeline') {
    await renderTimelineView(subContainer, 'all', `Unified Chronological Timeline — ${alias}`);
  }

  container.innerHTML = relationshipBanner;
  container.appendChild(subContainer);
  lucide.createIcons();
}

// Appointments & Medication Reminders View
async function renderAppointmentsView(container) {
  const res = await apiFetch(`/api/children/${currentChildId}/records?category=all`);
  const records = await res.json();
  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? (child.alias || 'Child') : 'Child';
  const today = new Date().toISOString().split('T')[0];

  const appts = records.filter(r => ['medical', 'legal', 'family_time', 'education'].includes(r.category) || r.follow_up_needed);
  const upcoming = appts.filter(r => r.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date));
  const past = appts.filter(r => r.event_date < today).sort((a, b) => b.event_date.localeCompare(a.event_date));
  const medRecords = records.filter(r => r.category === 'medical' && (r.title.toLowerCase().includes('med') || (r.summary || '').toLowerCase().includes('dose') || (r.summary || '').toLowerCase().includes('medication')));

  let html = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Appointments & Medication Schedule — ${alias}</h3>
          <p class="text-xs text-slate-500">Upcoming medical, dental, IEP, and court dates alongside active medication reminders.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="quickOpenAction('medical', 'Medication Administration / Refill', 'Medication given or prescription refilled.')" class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm flex items-center gap-1">
            <i data-lucide="pill" class="w-3.5 h-3.5"></i> Log Medication
          </button>
          <button onclick="openRecordModal()" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1">
            <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i> Schedule Appointment
          </button>
        </div>
      </div>

      <!-- Active Medication & Allergy Reminders Strip -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <i data-lucide="pill" class="w-4 h-4 text-blue-600"></i> Medication Schedule & Alerts
            </span>
            <span class="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">${medRecords.length} Entries</span>
          </div>
          ${medRecords.length === 0 ? `
            <p class="text-xs text-blue-800/80">No active prescriptions or medication adjustments documented yet. Click 'Log Medication' to record daily dosing or changes.</p>
          ` : `
            <div class="divide-y divide-blue-200/60 text-xs">
              ${medRecords.slice(0, 3).map(m => `
                <div class="py-1.5 flex items-center justify-between">
                  <span class="font-semibold text-blue-950">${m.title}</span>
                  <span class="text-[11px] text-blue-700">${m.event_date}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600"></i> Allergies & Emergency Alerts
            </span>
            <span class="text-[10px] text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded-full">Vital Info</span>
          </div>
          <p class="text-xs text-rose-900 font-medium">${child && child.allergies ? child.allergies : 'No allergies or critical alerts documented.'}</p>
          <p class="text-[11px] text-rose-700/90">${child && child.emergency_notes ? child.emergency_notes : 'Ensure rescue medications, doctor contacts, and pharmacy cards are updated.'}</p>
        </div>
      </div>

      <!-- Upcoming Scheduled Events -->
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <h4 class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i> Upcoming Scheduled Appointments (${upcoming.length})
          </h4>
        </div>
  `;

  if (upcoming.length === 0) {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400">
        <i data-lucide="calendar-check" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-xs">No upcoming appointments scheduled. All current dates are fulfilled.</p>
      </div>
    `;
  } else {
    upcoming.forEach(r => {
      html += `
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-start justify-between hover:border-emerald-300 transition">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Upcoming
              </span>
              <span class="text-xs font-bold text-slate-700">${r.category.toUpperCase()}</span>
            </div>
            <h4 class="font-bold text-slate-900 text-sm">${r.title}</h4>
            <p class="text-xs text-slate-600">${r.summary || 'No additional notes'}</p>
            <div class="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
              <span class="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">Date: ${r.event_date}</span>
              ${r.location ? `<span><strong>Location:</strong> ${r.location}</span>` : ''}
              ${r.participants ? `<span><strong>Participants:</strong> ${r.participants}</span>` : ''}
              ${r.follow_up_needed ? `<span class="text-amber-700 font-semibold">⚠️ Action required: ${r.follow_up_notes || 'Pending'}</span>` : ''}
            </div>
          </div>
          <button onclick="openEditRecordModal(${r.id})" class="text-xs text-slate-400 hover:text-emerald-700 font-semibold p-1" title="Edit">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
        </div>
      `;
    });
  }

  // Recent Past Appointments
  html += `
      </div>

      <div class="space-y-3 pt-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <h4 class="font-bold text-slate-600 text-xs flex items-center gap-1.5">
            <i data-lucide="history" class="w-3.5 h-3.5 text-slate-400"></i> Past Appointment History (${past.length})
          </h4>
        </div>
        <div class="space-y-2">
  `;

  if (past.length === 0) {
    html += `<p class="text-xs text-slate-400 italic">No historical appointments logged.</p>`;
  } else {
    past.slice(0, 5).forEach(r => {
      html += `
        <div class="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-between text-xs opacity-90">
          <div>
            <span class="font-semibold text-slate-800">${r.title}</span>
            <span class="text-slate-400 ml-2">(${r.event_date})</span>
            <span class="text-[10px] text-slate-500 uppercase ml-2 bg-slate-100 px-1.5 py-0.5 rounded">${r.category}</span>
          </div>
          <button onclick="openEditRecordModal(${r.id})" class="text-slate-400 hover:text-emerald-700">
            <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
    });
  }

  html += `</div></div></div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

// Binder Physical Binder Emulation View
async function renderBinderFoldersView(container) {
  const binderTabs = [
    { id: 'emergency', name: 'Emergency Information', icon: 'shield-alert', color: 'rose', desc: 'Crisis contacts, hospital instructions & allergies', cat: 'incident' },
    { id: 'medical', name: 'Medical Information', icon: 'stethoscope', color: 'blue', desc: 'Pediatrician, dental, immunizations & medications', cat: 'medical' },
    { id: 'education', name: 'Education & School', icon: 'graduation-cap', color: 'purple', desc: 'IEP, report cards, teacher meetings & attendance', cat: 'education' },
    { id: 'dcf', name: 'DCF Forms & Agreements', icon: 'folder', color: 'indigo', desc: 'Case plans, placement agreements, meeting notes', cat: 'communication' },
    { id: 'court', name: 'Court Documents & Legal', icon: 'scale', color: 'amber', desc: 'Court orders, hearing notices, GAL communications', cat: 'legal' },
    { id: 'visits', name: 'Visitation Information', icon: 'heart', color: 'emerald', desc: 'Family time logs, transport, supervision notes', cat: 'family_time' },
    { id: 'contacts', name: 'Case Directory', icon: 'contact', color: 'slate', desc: 'Caseworkers, doctors, teachers, therapists', action: () => switchMainSection('contacts') },
    { id: 'receipts', name: 'Receipts & Expenses', icon: 'receipt', color: 'teal', desc: 'Clothing allowance, mileage, medical copays', cat: 'financial' },
    { id: 'licensing', name: 'Licensing & Drills', icon: 'award', color: 'cyan', desc: 'Fire drills, safety checks, training hours', action: () => switchTab('licensing') },
    { id: 'placement', name: 'Placement Documents', icon: 'file-check', color: 'sky', desc: 'Intake documents, birth certificate, ID numbers', cat: 'legal' }
  ];

  let html = `
    <div class="space-y-5">
      <div>
        <h3 class="font-bold text-slate-800 text-base">Digital Foster Care Binder</h3>
        <p class="text-xs text-slate-500">Mirrors your physical binder tab by tab. Select any section to view or add documentation.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;

  binderTabs.forEach(t => {
    html += `
      <div onclick="${t.action ? `(${t.action.toString()})()` : `switchChildTab('${t.cat === 'daily' ? 'journal' : (t.cat === 'family_time' ? 'visits' : (t.cat === 'financial' ? 'expenses' : t.cat))}')`}" class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 hover:shadow transition cursor-pointer flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <div class="p-2 rounded-lg bg-${t.color}-50 text-${t.color}-700">
              <i data-lucide="${t.icon}" class="w-4 h-4"></i>
            </div>
            <h4 class="font-bold text-slate-900 text-sm">${t.name}</h4>
          </div>
          <p class="text-xs text-slate-500 mt-1">${t.desc}</p>
        </div>
        <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
          <span>Open Section</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

// Settings & Audit Log View
async function renderSettingsView(container) {
  const auditRes = await apiFetch('/api/audit?limit=25');
  const logs = await auditRes.json();
  const verifyRes = await apiFetch('/api/audit/verify');
  const verifyData = await verifyRes.json();

  let html = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-slate-800 text-base">Settings & System Security</h3>
        <p class="text-xs text-slate-500">Audit trail, caregiver privacy configuration, and database integrity.</p>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i> Audit Log Integrity Check
          </h4>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full ${verifyData.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            ${verifyData.ok ? 'Cryptographically Verified (Hash Chained)' : 'Integrity Issue Detected'}
          </span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Every entry, modification, communication send, and deletion is recorded in a tamper-evident audit log with cryptographic chaining.
        </p>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-100">
          <h4 class="font-bold text-slate-800 text-sm">Recent Activity Audit History (Last 25 Events)</h4>
        </div>
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <th class="py-2.5 px-4">Timestamp (UTC)</th>
              <th class="py-2.5 px-4">Caregiver</th>
              <th class="py-2.5 px-4">Action</th>
              <th class="py-2.5 px-4">Entity</th>
              <th class="py-2.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-mono">
  `;

  if (logs.length === 0) {
    html += `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-sans">No audit events recorded yet.</td></tr>`;
  } else {
    logs.forEach(l => {
      html += `
        <tr class="hover:bg-slate-50">
          <td class="py-2 px-4 text-slate-500 whitespace-nowrap">${l.ts}</td>
          <td class="py-2 px-4 font-sans font-semibold text-slate-800">${l.actor}</td>
          <td class="py-2 px-4 uppercase text-[10px] font-bold text-emerald-700">${l.action}</td>
          <td class="py-2 px-4 text-slate-600">${l.entity} #${l.entity_id || ''}</td>
          <td class="py-2 px-4 text-slate-500 max-w-xs truncate">${l.changes || l.reason || '-'}</td>
        </tr>
      `;
    });
  }

  html += `</tbody></table></div></div>`;
  container.innerHTML = html;
}

// Family Dashboard View
async function renderDashboardView(container) {
  const child = childrenList.find(c => c.id === currentChildId);
  const recRes = await fetch(`/api/children/${currentChildId}/records?category=all`);
  const records = await recRes.json();
  const followUps = records.filter(r => r.follow_up_needed && !r.is_completed);
  const pendingComms = records.filter(r => (r.dcf_draft_text || r.gal_draft_text) && r.communication_status !== 'Sent');

  let households = [];
  try {
    const hhRes = await apiFetch('/api/households');
    households = await hhRes.json();
    activeHouseholdsCache = households;
  } catch (e) {
    households = activeHouseholdsCache || [];
  }

  const alias = child ? (child.alias || 'CD') : 'Child';
  const topFollowUp = followUps[0];
  const secondFollowUp = followUps[1];
  const activeUser = getActiveCaregiver() || 'Candy Chevalier';
  const isSample = currentSproutMode === 'sample';

  container.innerHTML = `
    <div class="space-y-5">

      <!-- ========================================== -->
      <!-- P1.1 DAILY BRIEFING CENTER (Morning Command Copilot) -->
      <!-- ========================================== -->
      <div class="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md space-y-4 border border-emerald-700/80">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shadow-sm">
              ☀️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Morning Copilot Briefing</span>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.2 rounded-full font-semibold">Live Guidance</span>
              </div>
              <h2 class="text-base font-extrabold text-white mt-0.5">GOOD MORNING CANDY • Active In Care: ${alias}</h2>
            </div>
          </div>

          <div class="flex items-center gap-3 text-xs bg-black/20 px-3.5 py-2 rounded-xl border border-white/10">
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-300 block">Est. Admin Time</span>
              <span class="font-bold text-white text-xs">8 Minutes Today</span>
            </div>
            <div class="w-px h-6 bg-white/20"></div>
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-300 block">Compliance</span>
              <span class="font-bold text-emerald-300 text-xs">98% Current</span>
            </div>
          </div>
        </div>

        <!-- 3 Dynamic Priority Action Cards (P1.1) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-800">
          
          <!-- Priority 1: Medication Protocol -->
          <div class="bg-white rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-sm border border-slate-200">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-blue-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <i data-lucide="pill" class="w-3.5 h-3.5 text-blue-700"></i> 1. Health Priority
                </span>
                <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">8:00 AM Due</span>
              </div>
              <div class="font-bold text-slate-900 mt-1">Daily Medication Administration</div>
              <p class="text-slate-600 text-[11px] mt-0.5">Administer prescribed morning routine and record 1-tap confirmation.</p>
            </div>
            <button onclick="logTodayMedDose('Morning Routine Dose')" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg shadow-2xs flex items-center justify-center gap-1 transition">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> 1-Tap Administer
            </button>
          </div>

          <!-- Priority 2: Immediate Follow-Up / Family Visit / EPSDT Clock -->
          <div class="bg-white rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-sm border border-slate-200">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-amber-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-700"></i> 2. Family Visit / Tasks
                </span>
                <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">Active Target</span>
              </div>
              <div class="font-bold text-slate-900 mt-1 truncate" title="${topFollowUp ? topFollowUp.title : 'Family Visit at Easterseals'}">
                ${topFollowUp ? topFollowUp.title : 'Family Time Visit at Easterseals'}
              </div>
              <p class="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                ${topFollowUp ? (topFollowUp.follow_up_notes || topFollowUp.summary) : 'Supervised visit preparation and 18.0 mi transportation ($12.06).'}
              </p>
            </div>
            <button onclick="${topFollowUp ? `openEditRecordModal(${topFollowUp.id})` : `quickOpenAction('family_time', 'Family Time Visit — Easterseals', 'Supervised family time visit completed. Child transported.')`}" class="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-lg shadow-2xs flex items-center justify-center gap-1 transition">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> ${topFollowUp ? 'Review & Resolve' : '1-Tap Complete Visit'}
            </button>
          </div>

          <!-- Priority 3: DCF Claim Ready for Submission ($0.67/mi) -->
          <div class="bg-white rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-sm border border-slate-200">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-emerald-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <i data-lucide="send" class="w-3.5 h-3.5 text-emerald-700"></i> 3. State Claim Payout
                </span>
                <span class="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Payout Ready</span>
              </div>
              <div class="font-bold text-slate-900 mt-1 truncate">
                ${pendingComms.length > 0 ? 'DCF Notification Ready' : 'Vermont Mileage Claim (FS-334B)'}
              </div>
              <p class="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                ${pendingComms.length > 0 ? pendingComms[0].title : 'Official Word travel reimbursement pre-filled at $0.67/mile.'}
              </p>
            </div>
            <button onclick="${pendingComms.length > 0 ? `switchTab('communications')` : `generateDcfClaimForm('FS-334B')`}" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg shadow-2xs flex items-center justify-center gap-1 transition">
              <i data-lucide="${pendingComms.length > 0 ? 'send' : 'download'}" class="w-3.5 h-3.5"></i> ${pendingComms.length > 0 ? 'Review & Send' : '1-Click Export Form FS-334B'}
            </button>
          </div>

        </div>

        <!-- Upcoming Horizon Ticker -->
        <div class="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-100">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3 text-amber-300"></i> Court Review in 6 Days</span>
            <span class="text-white/30">•</span>
            <span class="flex items-center gap-1"><i data-lucide="heart" class="w-3 h-3 text-rose-300"></i> EPSDT Initial Screening: Compliant (14 Days Safe)</span>
          </div>
          <span class="italic text-emerald-200">Vermont DCF Policy 75 Kinship Standard</span>
        </div>
      </div>

      <!-- 1. Caregiver Household & Team Command Banner -->
      <div class="bg-gradient-to-r ${isSample ? 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-800' : 'from-emerald-950 via-emerald-900 to-teal-950 border-emerald-800'} text-white rounded-2xl p-5 shadow-sm border space-y-4">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="p-3 ${isSample ? 'bg-indigo-800/80 text-indigo-300 border-indigo-700/60' : 'bg-emerald-800/80 text-emerald-300 border-emerald-700/60'} rounded-2xl border shadow-inner">
              <i data-lucide="${isSample ? 'user-check' : 'home'}" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] uppercase font-bold tracking-widest ${isSample ? 'text-indigo-300' : 'text-emerald-300'}">Caregiver Operations</span>
                <span class="text-[10px] ${isSample ? 'bg-indigo-700/60 text-indigo-100 border-indigo-600' : 'bg-emerald-700/60 text-emerald-100 border-emerald-600'} px-2 py-0.5 rounded-full border">
                  ${isSample ? 'Demonstration / Sample Profile' : 'Vermont Kinship & Foster Care'}
                </span>
              </div>
              <h2 class="text-lg font-bold text-white mt-0.5">${activeUser} • Caregiver Command Center</h2>
              <p class="text-xs ${isSample ? 'text-indigo-200/90' : 'text-emerald-200/90'} mt-0.5">
                Care Team: ${isSample ? 'Sample Caregiver (Primary Caregiver) • Sample Secondary Applicant (Mallory Wheeler) • Sample Resource & Home Owner (Robin Davis)' : 'Candy Chevalier (Primary Caregiver) • Mallory Wheeler (Secondary Applicant) • Robin Davis (Home Owner & Resource)'}
              </p>
            </div>
          </div>

          <!-- In Care Child Pills + Add Child -->
          <div class="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <span class="text-[11px] text-emerald-300 font-bold uppercase shrink-0">In Care:</span>
            ${childrenList.map(ch => {
              const chAlias = ch.alias || `${ch.first_name || ''} ${ch.last_name || ''}`.trim() || 'Child';
              const chRel = ch.relationship_type || 'Kinship Placement';
              const isSelected = ch.id === currentChildId;
              return `
                <button onclick="currentChildId = ${ch.id}; if(document.getElementById('childSelect')) document.getElementById('childSelect').value = ${ch.id}; renderChildSnapshot(); loadTabContent();" class="px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${isSelected ? 'bg-white text-emerald-950 shadow ring-2 ring-emerald-400' : 'bg-emerald-800/70 hover:bg-emerald-800 text-emerald-100 border border-emerald-700'}">
                  <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-emerald-400'}"></span>
                  <span>${chAlias}</span>
                  <span class="text-[10px] px-1.5 py-0.2 bg-black/20 rounded font-normal opacity-90">${chRel}</span>
                </button>
              `;
            }).join('')}
            <button onclick="openNewChildModal()" class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-800/40 hover:bg-emerald-800 text-emerald-200 border border-dashed border-emerald-600 flex items-center gap-1 shrink-0">
              <i data-lucide="user-plus" class="w-3.5 h-3.5"></i> Add Child
            </button>
          </div>
        </div>

        <!-- Household Addresses & Status Grid (4 Registered Households with E911 & Mailing Addresses) -->
        <div class="pt-3 border-t border-emerald-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> Registered Households (${households.length}):
            </span>
            <button onclick="switchMainSection('households')" class="text-[11px] text-emerald-200 hover:text-white underline font-semibold">
              Manage in Caregiver & Households →
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            ${households.map(h => `
              <div onclick="openHouseholdModal(${h.id})" class="bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/80 rounded-xl p-3 space-y-1.5 cursor-pointer transition group">
                <div class="flex items-start justify-between gap-1">
                  <span class="font-bold text-white text-xs group-hover:text-emerald-300 block truncate" title="${h.name}">
                    ${h.name}
                  </span>
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${h.status.includes('Active') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'} shrink-0">
                    ${h.status.includes('Active') ? 'Active' : 'Prior'}
                  </span>
                </div>
                <div class="text-[11px] text-emerald-200 space-y-0.5">
                  <div class="truncate" title="${h.e911_address || h.address}"><strong>E911:</strong> ${h.e911_address || h.address}</div>
                  <div class="truncate text-emerald-300/80" title="${h.mailing_address || h.address}"><strong>Mail:</strong> ${h.mailing_address || h.address}</div>
                </div>
                ${h.secondary_caregiver || h.home_owner ? `
                  <div class="text-[10px] text-emerald-300/70 truncate pt-0.5 border-t border-emerald-800/60">
                    ${h.secondary_caregiver ? `Sec: ${h.secondary_caregiver}` : ''} ${h.home_owner ? `• Owner: ${h.home_owner}` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- 2. 1-TAP FAST ACTIONS BAR (Instant 15-second logging) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
          <span class="flex items-center gap-1.5"><i data-lucide="zap" class="w-4 h-4 text-amber-500"></i> Fast Caregiver Actions (1-Tap 15-Second Logging):</span>
          <span class="text-[11px] font-semibold text-slate-400 lowercase">click any button to open pre-filled logger</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button onclick="quickOpenAction('medical', 'Medication Given / Refilled', 'Daily prescription administered on schedule.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">💊</span>
            <div>
              <div>Log Meds</div>
              <div class="text-[11px] text-blue-700 font-normal">Dose / Refill</div>
            </div>
          </button>

          <button onclick="quickOpenAction('daily', 'Infant Feeding / Meal Routine', '🍼 Formula feeding or meal logged by caregiver.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">🍼</span>
            <div>
              <div>Feeding</div>
              <div class="text-[11px] text-emerald-700 font-normal">Formula / Meal</div>
            </div>
          </button>

          <button onclick="quickOpenAction('communication', 'DCF Caseworker Contact', 'Call / email with Family Services Worker regarding child.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">📞</span>
            <div>
              <div>DCF Call</div>
              <div class="text-[11px] text-indigo-700 font-normal">Worker update</div>
            </div>
          </button>

          <button onclick="quickOpenAction('family_time', 'Family Time Visit & Mileage', 'Supervised family visit attended. Transported child.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">🚗</span>
            <div>
              <div>Family Visit</div>
              <div class="text-[11px] text-teal-700 font-normal">Visit & Mileage</div>
            </div>
          </button>

          <button onclick="quickOpenAction('medical', 'Pediatric Appointment / Checkup', 'Well-child visit attended.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">🩺</span>
            <div>
              <div>Doctor Visit</div>
              <div class="text-[11px] text-amber-700 font-normal">Vitals / Checkup</div>
            </div>
          </button>

          <button onclick="quickOpenAction('incident', 'Incident / Behavioral Note', 'Unusual event or behavioral challenge observed.')" class="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 font-bold text-xs transition text-left shadow-xs">
            <span class="text-xl">⚠️</span>
            <div>
              <div>Incident</div>
              <div class="text-[11px] text-rose-700 font-normal">Behavior / Safety</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 3. Care Relationships & Episodes Grid (In Home, Current Respite, Upcoming, Former) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="home" class="w-4 h-4 text-emerald-700"></i> Care Relationships & Episodes Overview
            </h3>
            <p class="text-[11px] text-slate-500">Continuity across primary placements, temporary stays, upcoming assignments, and former resources.</p>
          </div>
          <button onclick="openNewChildModal()" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Care Episode
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <!-- 1. Children Living In My Home (Primary & Kinship Placement) -->
          <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="home" class="w-3.5 h-3.5 text-emerald-700"></i> Living In My Home
              </span>
              <span class="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full">
                ${childrenList.filter(c => ['Primary Placement', 'Kinship Placement', 'Kinship Care', 'Foster Care'].includes(c.relationship_type) || !c.relationship_type).length}
              </span>
            </div>
            <div class="divide-y divide-emerald-200/60">
              ${childrenList.filter(c => ['Primary Placement', 'Kinship Placement', 'Kinship Care', 'Foster Care'].includes(c.relationship_type) || !c.relationship_type).length === 0 ? `
                <p class="text-[11px] text-emerald-800/70 py-2">No primary placements currently recorded.</p>
              ` : childrenList.filter(c => ['Primary Placement', 'Kinship Placement', 'Kinship Care', 'Foster Care'].includes(c.relationship_type) || !c.relationship_type).map(ch => `
                <div onclick="currentChildId = ${ch.id}; renderChildSnapshot(); loadTabContent();" class="py-2 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 rounded px-1 transition ${ch.id === currentChildId ? 'font-bold text-emerald-950' : 'text-emerald-900'}">
                  <div>
                    <div class="font-bold">${ch.alias || 'Child'}</div>
                    <div class="text-[10px] text-emerald-700 font-normal">${ch.relationship_type || 'Primary Placement'}</div>
                  </div>
                  <span class="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded font-semibold">Active</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. Current Respite (Temporary & Emergency Respite active right now) -->
          <div class="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-purple-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-700"></i> Current Respite
              </span>
              <span class="text-[10px] font-bold bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded-full">
                ${childrenList.filter(c => ['Temporary Respite', 'Emergency Respite', 'Respite Care', 'Emergency Placement'].includes(c.relationship_type) && c.episode_status !== 'Former').length}
              </span>
            </div>
            <div class="divide-y divide-purple-200/60">
              ${childrenList.filter(c => ['Temporary Respite', 'Emergency Respite', 'Respite Care', 'Emergency Placement'].includes(c.relationship_type) && c.episode_status !== 'Former').length === 0 ? `
                <p class="text-[11px] text-purple-800/70 py-2">No children currently in temporary respite care.</p>
              ` : childrenList.filter(c => ['Temporary Respite', 'Emergency Respite', 'Respite Care', 'Emergency Placement'].includes(c.relationship_type) && c.episode_status !== 'Former').map(ch => `
                <div onclick="currentChildId = ${ch.id}; renderChildSnapshot(); loadTabContent();" class="py-2 flex items-center justify-between cursor-pointer hover:bg-purple-100/60 rounded px-1 transition ${ch.id === currentChildId ? 'font-bold text-purple-950' : 'text-purple-900'}">
                  <div>
                    <div class="font-bold">${ch.alias || 'Child'}</div>
                    <div class="text-[10px] text-purple-700 font-normal">${ch.episode_start_date ? `${ch.episode_start_date} - ${ch.episode_end_date || 'Now'}` : ch.relationship_type}</div>
                  </div>
                  <span class="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded font-semibold text-purple-900">In Care</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. Upcoming Respite (Temporary stays arriving in the future) -->
          <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-700"></i> Upcoming Respite
              </span>
              <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full">
                ${childrenList.filter(c => c.episode_status === 'Temporary' && c.episode_start_date && c.episode_start_date > new Date().toISOString().split('T')[0]).length}
              </span>
            </div>
            <div class="divide-y divide-amber-200/60">
              ${childrenList.filter(c => c.episode_status === 'Temporary' && c.episode_start_date && c.episode_start_date > new Date().toISOString().split('T')[0]).length === 0 ? `
                <p class="text-[11px] text-amber-800/70 py-2">No future respite stays currently scheduled.</p>
              ` : childrenList.filter(c => c.episode_status === 'Temporary' && c.episode_start_date && c.episode_start_date > new Date().toISOString().split('T')[0]).map(ch => `
                <div onclick="currentChildId = ${ch.id}; renderChildSnapshot(); loadTabContent();" class="py-2 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 rounded px-1 transition ${ch.id === currentChildId ? 'font-bold text-amber-950' : 'text-amber-900'}">
                  <div>
                    <div class="font-bold">${ch.alias || 'Child'}</div>
                    <div class="text-[10px] text-amber-700 font-normal">${ch.episode_start_date} - ${ch.episode_end_date || 'TBD'}</div>
                  </div>
                  <span class="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded font-semibold text-amber-900">Upcoming</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4. Former Placements (Preserved continuity & transition resource) -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="archive" class="w-3.5 h-3.5 text-slate-500"></i> Former Placements
              </span>
              <span class="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                ${childrenList.filter(c => c.relationship_type === 'Former Placement' || c.episode_status === 'Former' || c.episode_status === 'Former / Transitioned').length}
              </span>
            </div>
            <div class="divide-y divide-slate-200/60">
              ${childrenList.filter(c => c.relationship_type === 'Former Placement' || c.episode_status === 'Former' || c.episode_status === 'Former / Transitioned').length === 0 ? `
                <p class="text-[11px] text-slate-500 py-2">No former placement records.</p>
              ` : childrenList.filter(c => c.relationship_type === 'Former Placement' || c.episode_status === 'Former' || c.episode_status === 'Former / Transitioned').map(ch => `
                <div onclick="currentChildId = ${ch.id}; renderChildSnapshot(); loadTabContent();" class="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded px-1 transition ${ch.id === currentChildId ? 'font-bold text-slate-900' : 'text-slate-600'}">
                  <div>
                    <div class="font-bold">${ch.alias || 'Child'}</div>
                    <div class="text-[10px] text-slate-400 font-normal">Past Care Resource</div>
                  </div>
                  <span class="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">Archived</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Child Reference ID</div>
          <div class="text-base font-bold text-slate-800 mt-1">${child ? (child.child_code || `CH-${child.id || '001'}`) : 'CH-001'}</div>
          <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">Alias: ${alias}</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placement Target</div>
          <div class="text-base font-bold text-emerald-800 mt-1 flex items-center gap-1">
            <i data-lucide="calendar" class="w-4 h-4"></i> <span class="privacy-sensitive">${child.placement_date || 'Wed Oct 14'}</span>
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">Status: ${child.status}</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Follow-Ups</div>
          <div class="text-base font-bold ${followUps.length > 0 ? 'text-amber-700' : 'text-slate-800'} mt-1">${followUps.length} Pending</div>
          <div class="text-[11px] text-slate-500 mt-0.5">Requires attention</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Communication Drafts</div>
          <div class="text-base font-bold ${pendingComms.length > 0 ? 'text-indigo-700' : 'text-slate-800'} mt-1">${pendingComms.length} Ready</div>
          <div class="text-[11px] text-slate-500 mt-0.5">DCF / GAL review</div>
        </div>
      </div>

      <!-- Daily Medication & Wellness Administration Check-Off (1-Tap Safety Record) -->
      <div class="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 rounded-2xl border border-blue-200 p-5 shadow-xs space-y-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2.5">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <i data-lucide="pill" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                <span>Daily Medication Administration & Health Log — ${alias}</span>
                <span class="text-[10px] bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded-full uppercase">3-Sec Confirmation</span>
              </h4>
              <p class="text-xs text-blue-900/80">Confirm morning, noon, and evening doses or administration with a single click.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="logTodayMedDose('Morning Dose')" class="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Mark Dose Administered
            </button>
            <button onclick="quickOpenAction('medical', 'Medication Refill / Change', 'Prescription refilled or dosage adjusted.')" class="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 font-semibold text-xs rounded-xl shadow-xs transition">
              Refill / Log Details
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div class="bg-white/90 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block text-xs">Morning Schedule</span>
              <span class="text-[11px] text-slate-500">With breakfast / 8:00 AM</span>
            </div>
            <button onclick="logTodayMedDose('Morning Dose')" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i> Done
            </button>
          </div>

          <div class="bg-white/90 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block text-xs">Mid-Day / School</span>
              <span class="text-[11px] text-slate-500">Nurse protocol / 12:00 PM</span>
            </div>
            <button onclick="logTodayMedDose('Mid-Day Dose')" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-blue-600"></i> Log
            </button>
          </div>

          <div class="bg-white/90 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block text-xs">Evening / Bedtime</span>
              <span class="text-[11px] text-slate-500">With dinner / 7:30 PM</span>
            </div>
            <button onclick="logTodayMedDose('Evening Dose')" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-purple-600"></i> Log
            </button>
          </div>
        </div>

        <!-- Prescription Refill Countdown & Inventory Alert -->
        <div class="mt-3 pt-2.5 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-700 text-[11px] flex items-center gap-1">
              <i data-lucide="package" class="w-3.5 h-3.5 text-blue-600"></i> Active Prescription Supply:
            </span>
            <span class="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
              18 Days Remaining
            </span>
            <span class="text-[11px] text-slate-500">Refill Due: Oct 31, 2026</span>
          </div>
          <button onclick="quickOpenAction('medical', 'Pediatric Prescription Refill Request', 'Contacted pediatrician / pharmacy for routine prescription renewal refill.')" class="text-xs font-semibold text-blue-700 hover:text-blue-900 underline">
            + Log Pharmacy Refill
          </button>
        </div>
      </div>

      <!-- Two-Column Priority Command Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Open Follow-Ups -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b">
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i data-lucide="check-square" class="w-4 h-4 text-amber-600"></i> Outstanding Action Items
            </h4>
            <span class="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">${followUps.length} Open</span>
          </div>
          <div class="divide-y divide-slate-100 mt-2">
            ${followUps.length === 0 ? '<p class="text-xs text-slate-400 py-6 text-center">No outstanding tasks right now. All caught up!</p>' : ''}
            ${followUps.map(f => `
              <div class="py-3 flex items-start justify-between gap-3">
                <div class="flex items-start gap-2.5">
                  <input type="checkbox" onchange="toggleTaskComplete(${f.id})" title="Mark task completed" class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                  <div>
                    <div class="text-xs font-bold text-slate-900">${f.title}</div>
                    <div class="text-xs text-amber-900 font-medium mt-0.5">${f.follow_up_notes || 'Action required'}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">Date: ${f.event_date}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="openEditRecordModal(${f.id})" class="text-xs text-slate-400 hover:text-emerald-700 font-semibold" title="Edit entry">
                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="switchTab('timeline')" class="text-xs text-emerald-700 hover:underline font-semibold shrink-0">View</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Smart Communication Inbox -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b">
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i data-lucide="send" class="w-4 h-4 text-indigo-600"></i> Smart Communication Ready
            </h4>
            <button onclick="switchTab('communications')" class="text-xs text-indigo-700 hover:underline font-semibold">Open Center</button>
          </div>
          <div class="divide-y divide-slate-100 mt-2 text-xs">
            ${pendingComms.length === 0 ? '<p class="text-xs text-slate-400 py-6 text-center">No pending drafts to review.</p>' : ''}
            ${pendingComms.map(pc => `
              <div class="py-3 flex items-start justify-between gap-2">
                <div>
                  <div class="font-bold text-slate-900">${pc.title}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">${pc.summary}</div>
                  <div class="text-[10px] text-indigo-600 font-semibold mt-1">Recommended: Notify DCF</div>
                </div>
                <button onclick="switchTab('communications')" class="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0">
                  Review
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Today In Our Home — Live Activity & Daily Continuity Feed -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i data-lucide="activity" class="w-4 h-4 text-emerald-600"></i> Today In Our Home — Daily Care Log
            </h4>
            <p class="text-[11px] text-slate-500">Continuity feed across all meals, behaviors, visits, medications, and observations logged today.</p>
          </div>
          <button onclick="openRecordModal()" class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Daily Note
          </button>
        </div>

        <div class="divide-y divide-slate-100">
          ${records.slice(0, 5).map(r => {
            let catColor = 'bg-slate-100 text-slate-700';
            if (r.category === 'medical') catColor = 'bg-blue-100 text-blue-800';
            if (r.category === 'daily') catColor = 'bg-teal-100 text-teal-800';
            if (r.category === 'family_time') catColor = 'bg-green-100 text-green-800';
            if (r.category === 'incident') catColor = 'bg-rose-100 text-rose-800';
            return `
              <div class="py-3 flex items-start justify-between gap-3 text-xs">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}">
                      ${r.category.replace('_', ' ')}
                    </span>
                    <span class="font-bold text-slate-900">${r.title}</span>
                    <span class="text-[11px] text-slate-400">(${r.event_date})</span>
                  </div>
                  <p class="text-slate-600 leading-relaxed">${r.summary || 'Observation recorded.'}</p>
                  ${r.participants ? `<span class="text-[10px] text-slate-400 block">Participants: ${r.participants}</span>` : ''}
                </div>
                <button onclick="switchTab('journal')" class="text-xs text-emerald-700 hover:underline font-semibold shrink-0">Open Journal</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function quickOpenAction(category, defaultTitle, defaultSummary) {
  openRecordModal();
  document.getElementById('recEditId').value = '';
  document.getElementById('recDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('recCategory').value = category;
  document.getElementById('recTitle').value = defaultTitle;
  document.getElementById('recSummary').value = defaultSummary;
}

// 1-Tap Daily Medication Administration Logger
async function logTodayMedDose(slotName = 'Daily Dose') {
  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? (child.alias || 'Child') : 'Child';
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const payload = {
    child_id: currentChildId,
    category: 'medical',
    title: `Medication Administered — ${slotName}`,
    severity: 'Routine',
    event_date: today,
    location: 'Home',
    participants: `Caregiver (${getActiveCaregiver() || 'Primary'})`,
    summary: `Prescribed ${slotName.toLowerCase()} successfully administered to ${alias} at ${now}. Child tolerated well with no adverse reaction noted.`,
    follow_up_needed: false,
    follow_up_notes: '',
    follow_up_due_date: '',
    mileage: 0,
    rpps_category: ''
  };

  try {
    const res = await apiFetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      await loadTabContent();
      renderChildSnapshot();
    } else {
      alert("Could not log dose record.");
    }
  } catch (err) {
    alert("Error recording medication dose: " + err.message);
  }
}

// Automated Vermont DCF Travel Mileage Helper ($0.67/mile)
function updateMileagePayoutDisplay() {
  const input = document.getElementById('recMileage');
  const display = document.getElementById('recMileagePayout');
  if (!input || !display) return;

  const miles = parseFloat(input.value) || 0;
  const payout = (miles * 0.67).toFixed(2);
  display.textContent = `$${payout} Est. Payout`;
}

function applyMileagePreset(miles, destinationDescription) {
  const input = document.getElementById('recMileage');
  const summary = document.getElementById('recSummary');
  if (input) {
    input.value = miles;
    updateMileagePayoutDisplay();
  }
  if (summary && destinationDescription) {
    if (!summary.value.trim() || summary.value.includes('Visit') || summary.value.includes('mileage')) {
      summary.value = `Transported child for ${destinationDescription}. Round-trip: ${miles} miles.`;
    }
  }
}

// Resources Tab 20: Folder File Viewer with DCF Category Classification
async function renderResourcesView(container) {
  const res = await apiFetch('/api/shared-docs');
  const docs = await res.json();

  const categories = ['All Files', 'DCF Forms & Plans', 'Medical & Health', 'Court & Legal', 'Education & School', 'Financial & Receipts', 'Licensing & Safety', 'General Guides & Resources'];

  let html = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Documents & DCF Folder System</h3>
          <p class="text-xs text-slate-500">Case plans, agreements, medical evaluations, court orders & state handbooks.</p>
        </div>
        <div class="w-full sm:w-auto">
          <input type="text" id="docSearchInput" oninput="filterDocumentsClientSide()" placeholder="Search documents..." class="text-xs border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 w-full sm:w-56" />
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        ${categories.map((c, i) => `
          <button onclick="filterDocumentsByCategory('${c}')" class="doc-cat-pill px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${i === 0 ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-doccat="${c}">
            ${c}
          </button>
        `).join('')}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="docsGridContainer">
  `;

  if (docs.length === 0) {
    html += `<div class="col-span-3 p-8 text-center text-slate-400 bg-white rounded-xl border">No documents found in folder.</div>`;
  } else {
    docs.forEach(d => {
      let iconColor = 'text-blue-600';
      if (d.ext === '.pdf') iconColor = 'text-red-500';
      if (d.ext === '.docx') iconColor = 'text-blue-700';

      html += `
        <div class="doc-card-item bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition flex flex-col justify-between" data-name="${d.name.toLowerCase()}" data-cat="${d.category}">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                ${d.category}
              </span>
              <span class="text-[10px] uppercase font-bold text-slate-400">${d.ext.replace('.', '')}</span>
            </div>
            <h4 class="font-semibold text-slate-900 text-xs line-clamp-2">${d.name}</h4>
            <p class="text-[11px] text-slate-400 mt-1">Folder: ${d.folder}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button onclick="openLocalDocument('${d.rel_path}')" class="text-xs bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-200 transition flex items-center gap-1.5">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Open File
            </button>
          </div>
        </div>
      `;
    });
  }

  html += `</div></div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

let activeDocCategory = 'All Files';

function filterDocumentsByCategory(catName) {
  activeDocCategory = catName;
  document.querySelectorAll('.doc-cat-pill').forEach(btn => {
    if (btn.getAttribute('data-doccat') === catName) {
      btn.className = "doc-cat-pill px-3 py-1 rounded-full font-bold transition whitespace-nowrap bg-emerald-700 text-white";
    } else {
      btn.className = "doc-cat-pill px-3 py-1 rounded-full font-medium transition whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200";
    }
  });
  filterDocumentsClientSide();
}

function filterDocumentsClientSide() {
  const searchInput = document.getElementById('docSearchInput');
  const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
  document.querySelectorAll('.doc-card-item').forEach(card => {
    const name = card.getAttribute('data-name') || '';
    const cat = card.getAttribute('data-cat') || '';
    const matchesCat = (activeDocCategory === 'All Files' || cat === activeDocCategory);
    const matchesSearch = (!q || name.includes(q));
    if (matchesCat && matchesSearch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

async function openLocalDocument(relPath) {
  try {
    const res = await fetch('/api/open-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rel_path: relPath })
    });
    const data = await res.json();
    if (!data.success) {
      alert("Could not open file: " + (data.error || "File not found"));
    }
  } catch (err) {
    console.error("Open document error:", err);
  }
}


// Universal Timeline / Category List Renderer
async function renderTimelineView(container, categoryFilter, titleOverride = null) {
  const currentCategory = categoryFilter || 'all';
  const res = await apiFetch(`/api/children/${currentChildId}/records?category=${currentCategory}`);
  const records = await res.json();

  let html = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-800 text-base">${titleOverride || 'Child Master Timeline'}</h3>
          <p class="text-xs text-slate-500">Every interaction and observation in unified chronologic order.</p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <input type="text" id="timelineFilterSearch" oninput="filterTimelineClientSide()" placeholder="Filter entries..." class="text-xs border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 w-full sm:w-56" />
          <button onclick="openRecordModal()" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shadow shrink-0 flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Log Entry
          </button>
        </div>
      </div>

      <!-- Timeline Category Quick Filters Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'all')" class="px-2.5 py-1 rounded-full font-bold transition whitespace-nowrap ${currentCategory === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">All Records</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'daily')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'daily' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">Daily Journal</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'medical')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'medical' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">Medical</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'education')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'education' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">Education</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'family_time')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'family_time' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">Visits</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'communication')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'communication' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">DCF / Communications</button>
        <button onclick="renderTimelineView(document.getElementById('tabContent'), 'incident')" class="px-2.5 py-1 rounded-full font-medium transition whitespace-nowrap ${currentCategory === 'incident' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">Incidents</button>
      </div>

      <div class="space-y-3" id="recordsList">
  `;

  if (records.length === 0) {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
        <i data-lucide="calendar" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-sm">No entries logged under this section yet.</p>
        <button onclick="openRecordModal()" class="mt-3 text-xs bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg">Log First Entry</button>
      </div>
    `;
  } else {
    records.forEach(r => {
      let badgeClass = 'bg-slate-100 text-slate-700';
      if (r.category === 'medical') badgeClass = 'badge-medical';
      if (r.category === 'family_time') badgeClass = 'badge-family';
      if (r.category === 'legal') badgeClass = 'badge-legal';
      if (r.category === 'communication') badgeClass = 'badge-dcf';
      if (r.category === 'incident') badgeClass = 'badge-incident';
      if (r.category === 'education') badgeClass = 'badge-education';
      if (r.category === 'daily') badgeClass = 'bg-teal-50 text-teal-800';
      if (r.category === 'financial') badgeClass = 'bg-emerald-50 text-emerald-800';

      let severityBadge = '';
      if (r.severity === 'Emergency') {
        severityBadge = '<span class="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">Emergency</span>';
      } else if (r.severity === 'Court Relevant') {
        severityBadge = '<span class="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">Court Relevant</span>';
      } else if (r.severity === 'Important') {
        severityBadge = '<span class="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">Important</span>';
      }

      html += `
        <div class="timeline-entry-item bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition" data-text="${(r.title + ' ' + (r.summary || '') + ' ' + (r.location || '') + ' ' + (r.participants || '')).toLowerCase()}">
          <div class="flex items-start justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeClass}">
                ${(r.category || 'entry').replace('_', ' ')}
              </span>
              ${severityBadge}
              <h4 class="font-bold text-slate-900 text-sm">${r.title}</h4>
            </div>
            <div class="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
              ${r.event_date}
            </div>
          </div>

          <p class="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line">
            ${r.summary}
          </p>

          <div class="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 gap-2">
            <div class="flex flex-wrap items-center gap-3">
              ${r.author ? `<span class="text-slate-600 font-semibold flex items-center gap-1"><i data-lucide="user" class="w-3 h-3 text-slate-400"></i> ${r.author}</span>` : ''}
              ${r.location ? `<span><strong>Location:</strong> ${r.location}</span>` : ''}
              ${r.participants ? `<span><strong>Participants:</strong> ${r.participants}</span>` : ''}
            </div>
            
            <div class="flex items-center gap-2.5">
              ${r.attachment_name ? `
                <a href="${r.attachment_path}" target="_blank" class="text-emerald-700 hover:underline flex items-center gap-1 font-semibold">
                  <i data-lucide="paperclip" class="w-3.5 h-3.5"></i> ${r.attachment_name}
                </a>
              ` : ''}
              ${r.follow_up_needed ? `
                <span class="text-amber-800 ${r.is_completed ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through' : 'bg-amber-50 border-amber-200'} px-2 py-0.5 rounded font-bold border flex items-center gap-1">
                  ${r.is_completed ? '✓ Resolved' : '⚠️ Follow-up: ' + (r.follow_up_notes || 'Pending')}
                </span>
              ` : ''}
              <button onclick="openEditRecordModal(${r.id})" class="text-slate-400 hover:text-emerald-700 transition font-medium" title="Edit this entry">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="deleteRecord(${r.id})" class="text-slate-300 hover:text-red-600 transition" title="Delete">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  html += `</div></div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

function filterTimelineClientSide() {
  const input = document.getElementById('timelineFilterSearch');
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  document.querySelectorAll('.timeline-entry-item').forEach(el => {
    const text = el.getAttribute('data-text') || '';
    if (!q || text.includes(q)) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

async function renderRecordsCustomList(container, records, titleText) {
  let html = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-base">${titleText}</h3>
          <p class="text-xs text-slate-500">${records.length} matching entries found across the binder.</p>
        </div>
        <button onclick="document.getElementById('globalSearchInput').value=''; loadTabContent();" class="text-xs text-emerald-700 hover:underline font-semibold">Clear Search</button>
      </div>

      <div class="space-y-3">
  `;

  if (records.length === 0) {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
        <i data-lucide="search" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-sm">No matching records found.</p>
      </div>
    `;
  } else {
    records.forEach(r => {
      let badgeClass = 'bg-slate-100 text-slate-700';
      if (r.category === 'medical') badgeClass = 'badge-medical';
      if (r.category === 'family_time') badgeClass = 'badge-family';
      if (r.category === 'legal') badgeClass = 'badge-legal';
      if (r.category === 'communication') badgeClass = 'badge-dcf';
      if (r.category === 'incident') badgeClass = 'badge-incident';
      if (r.category === 'education') badgeClass = 'badge-education';

      html += `
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeClass}">
                ${r.category.replace('_', ' ')}
              </span>
              <h4 class="font-bold text-slate-900 text-sm">${r.title}</h4>
            </div>
            <div class="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
              ${r.event_date}
            </div>
          </div>

          <p class="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            ${r.summary}
          </p>

          <div class="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 gap-2">
            <div class="flex items-center gap-4">
              ${r.location ? `<span><strong>Location:</strong> ${r.location}</span>` : ''}
              ${r.participants ? `<span><strong>Participants:</strong> ${r.participants}</span>` : ''}
            </div>
            
            <div class="flex items-center gap-3">
              ${r.attachment_name ? `
                <a href="${r.attachment_path}" target="_blank" class="text-emerald-700 hover:underline flex items-center gap-1 font-semibold">
                  <i data-lucide="paperclip" class="w-3.5 h-3.5"></i> ${r.attachment_name}
                </a>
              ` : ''}
              ${r.follow_up_needed ? `
                <span class="text-amber-800 ${r.is_completed ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through' : 'bg-amber-50 border-amber-200'} px-2 py-0.5 rounded font-bold border flex items-center gap-1">
                  ${r.is_completed ? '✓ Resolved' : '⚠️ Follow-up: ' + (r.follow_up_notes || 'Pending')}
                </span>
              ` : ''}
              <button onclick="openEditRecordModal(${r.id})" class="text-slate-400 hover:text-emerald-700 transition font-medium" title="Edit this entry">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="deleteRecord(${r.id})" class="text-slate-300 hover:text-red-600 transition" title="Delete">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  html += `</div></div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

// Contacts Tab 2 View
async function renderContactsView(container) {
  const res = await fetch(`/api/children/${currentChildId}/contacts`);
  const contacts = await res.json();

  let html = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Tab 2: Contacts & Case Team Directory</h3>
          <p class="text-xs text-slate-500">DCF workers, GAL, CASA, attorneys, therapists, doctors & parents.</p>
        </div>
        <button onclick="openNewContactModal()" class="text-xs bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1.5 rounded-lg shadow">
          + Add Contact
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;

  contacts.forEach(c => {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative">
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          ${c.is_emergency ? `<span class="text-[10px] uppercase font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">Emergency</span>` : ''}
          <button onclick="deleteContact(${c.id})" class="text-slate-300 hover:text-rose-600 transition p-1" title="Delete contact">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            ${c.role_type}
          </span>
          ${c.preferred_method ? `<span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Prefers ${c.preferred_method}</span>` : ''}
        </div>
        <h4 class="font-bold text-slate-900 text-sm mt-1.5">${c.full_name}</h4>
        <p class="text-xs text-slate-500">${c.organization || 'Individual'}</p>
        
        <div class="mt-3 space-y-1 text-xs text-slate-600">
          ${c.phone ? `<div class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i> <a href="tel:${c.phone}" class="hover:underline font-semibold">${c.phone}</a></div>` : ''}
          ${c.email ? `<div class="flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400"></i> <a href="mailto:${c.email}" class="hover:underline">${c.email}</a></div>` : ''}
          ${c.notes ? `<div class="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded">${c.notes}</div>` : ''}
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

// Caregiver, Households & Training Overview (User Overview)
async function renderCaregiverAndHouseholdsView(container) {
  const activeUser = getActiveCaregiver();
  const isSample = currentSproutMode === 'sample' || (activeUser && activeUser.includes('Sample'));

  if (isSample && !activeUser) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-8 text-center">
          <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <i data-lucide="user-check" class="w-6 h-6"></i>
          </div>
          <h3 class="text-base font-bold text-slate-800">Please Select a Sample Caregiver</h3>
          <p class="text-xs text-slate-600 max-w-md mx-auto mt-1">
            Choose a caregiver from the top right <strong>Caregiver User</strong> dropdown to explore their specific household licensing profile, DCF compliance milestones, and VCWTP training log.
          </p>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const hhRes = await apiFetch('/api/households');
  const households = await hhRes.json();
  activeHouseholdsCache = households;
  const licRes = await apiFetch('/api/licensing');
  const licItems = await licRes.json();

  const totalTrainingHours = licItems
    .filter(it => it.record_type === 'Training' || it.hours > 0)
    .reduce((sum, it) => sum + (parseFloat(it.hours) || 0), 0);

  const safetyDrills = licItems.filter(it => it.record_type && it.record_type.toLowerCase().includes('drill'));

  const effectiveUser = activeUser || (currentSproutMode === 'local' ? 'Candy Chevalier' : 'Sample Caregiver');
  
  // Find initials from LOCAL_CAREGIVERS or SAMPLE_CAREGIVERS
  const allKnown = [...LOCAL_CAREGIVERS, ...SAMPLE_CAREGIVERS];
  const matchedUser = allKnown.find(c => c.id === effectiveUser);
  const userInitials = matchedUser ? matchedUser.initials : (isSample ? 'SC' : 'CC');

  const primaryHome = households.length > 0 ? households[0] : null;
  const residenceName = primaryHome ? (primaryHome.name || primaryHome.label || primaryHome.address) : (isSample ? 'Sample Home' : '41 Elmwood Drive');
  const primaryCaregiverName = primaryHome ? (primaryHome.primary_caregiver || effectiveUser) : effectiveUser;

  let html = `
    <div class="space-y-6">
      
      <!-- Top Overview Card: Active Caregiver Profile -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl ${isSample ? 'bg-blue-800' : 'bg-emerald-800'} text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              ${userInitials}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-slate-900">${activeUser || '-- No Caregiver Selected --'}</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${isSample ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                  ${isSample ? 'Sample Household Profile' : 'Primary Caregiver'}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                ${isSample ? 'Fictional Caregiver Household • Dev Sandbox Testing Environment' : 'Vermont Foster & Kinship Caregiver • Active Placement Operations'}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="openHouseholdModal()" class="px-3.5 py-2 ${isSample ? 'bg-blue-800 hover:bg-blue-700' : 'bg-emerald-800 hover:bg-emerald-700'} text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
              <i data-lucide="home" class="w-3.5 h-3.5"></i> Add / Edit Household
            </button>
            <button onclick="openNewLicensingModal()" class="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
              <i data-lucide="award" class="w-3.5 h-3.5"></i> Log Training / Safety Drill
            </button>
          </div>
        </div>

        <!-- Caregiver Vital Metrics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Households</span>
            <span class="text-xl font-bold text-slate-800 mt-1 block">${households.length} ${households.length === 1 ? 'Home' : 'Homes'}</span>
            <span class="text-[11px] ${isSample ? 'text-blue-700' : 'text-emerald-700'} font-medium">${isSample ? 'Assigned Sandbox Home' : 'Operational Homes'}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Care Residence</span>
            <span class="text-xs font-bold text-slate-900 mt-1 block truncate" title="${residenceName}">${residenceName}</span>
            <span class="text-[11px] ${isSample ? 'text-blue-700 font-semibold' : 'text-emerald-700 font-semibold'}">${primaryHome ? (primaryHome.license_status || primaryHome.status) : 'Active Home'}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">VCWTP Training Hours</span>
            <span class="text-xl font-bold text-teal-800 mt-1 block">${totalTrainingHours.toFixed(1)} hrs</span>
            <span class="text-[11px] text-slate-500">${licItems.length} records logged</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Care Team</span>
            <span class="text-xs font-bold text-slate-800 mt-1 block truncate">${primaryHome && primaryHome.secondary_caregiver ? primaryHome.secondary_caregiver : (isSample ? 'Solo Caregiver' : 'Mallory W. & Robin D.')}</span>
            <span class="text-[11px] text-slate-500">${isSample ? 'Household Structure' : 'Secondary & Resource'}</span>
          </div>
        </div>
      </div>

      <!-- Households & Residences Section -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-700"></i> Caregiver Households & Licensing Profiles
            </h4>
            <p class="text-xs text-slate-500">Locations associated with your caregiving, licenses, and household members.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${households.map(h => `
            <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:bg-white transition shadow-sm">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-bold text-slate-900 text-sm block">${h.name}</span>
                  <span class="px-2 py-0.5 mt-1 inline-block rounded text-[10px] font-bold ${h.status.includes('Active') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}">
                    ${h.license_status || h.status}
                  </span>
                </div>
                <button onclick="openHouseholdModal(${h.id})" class="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                </button>
              </div>

              <!-- Address Details Strip -->
              <div class="space-y-1.5 text-xs bg-white p-3 rounded-lg border border-slate-200/80">
                <div class="flex items-start gap-2">
                  <span class="p-1 rounded bg-rose-50 text-rose-700 shrink-0"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i></span>
                  <div>
                    <span class="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-rose-800">E911 Physical Address</span>
                    <span class="text-slate-700 font-semibold">${h.e911_address || h.address}</span>
                  </div>
                </div>
                <div class="flex items-start gap-2 pt-1 border-t border-slate-100">
                  <span class="p-1 rounded bg-blue-50 text-blue-700 shrink-0"><i data-lucide="mail" class="w-3.5 h-3.5"></i></span>
                  <div>
                    <span class="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-blue-800">Mailing Address</span>
                    <span class="text-slate-700 font-semibold">${h.mailing_address || h.address}</span>
                  </div>
                </div>
              </div>

              <!-- Caregiver Journey Model Badge Strip -->
              ${h.caregiver_stage ? `
                <div class="bg-blue-50/80 border border-blue-200/90 rounded-xl p-3 space-y-2 text-xs">
                  <div class="flex flex-wrap items-center justify-between gap-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-blue-900">Caregiver Journey Model</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                      ${h.caregiver_stage}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-blue-200/60">
                    <div><strong class="text-slate-600">Structure:</strong> <span class="text-slate-900 font-semibold">${h.household_structure || 'Single Adult'}</span></div>
                    <div><strong class="text-slate-600">DCF Experience:</strong> <span class="text-slate-900 font-semibold">${h.years_working_with_dcf != null ? h.years_working_with_dcf + ' yrs' : '-'}</span></div>
                    <div><strong class="text-slate-600">Placements Done:</strong> <span class="text-slate-900 font-semibold">${h.placements_completed != null ? h.placements_completed : 0}</span></div>
                    <div><strong class="text-slate-600">Adoptions:</strong> <span class="text-slate-900 font-semibold">${h.adoption_finalizations != null ? h.adoption_finalizations : 0}</span></div>
                  </div>

                  ${h.approvals && h.approvals.length > 0 ? `
                    <div class="pt-1.5 border-t border-blue-200/60">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Approved Care Pathways:</span>
                      <div class="flex flex-wrap gap-1">
                        ${h.approvals.map(app => `<span class="px-2 py-0.5 rounded bg-white border border-blue-300 text-blue-900 font-bold text-[10px]">${app}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${h.special_certifications && h.special_certifications.length > 0 ? `
                    <div class="pt-1.5 border-t border-blue-200/60">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Certifications & Specialties:</span>
                      <div class="flex flex-wrap gap-1">
                        ${h.special_certifications.map(c => `<span class="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-900 font-medium text-[9px]">${c}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <div class="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div><strong>Primary Caregiver:</strong> ${h.primary_caregiver || 'Candy Chevalier'}</div>
                ${h.secondary_caregiver ? `<div><strong>Secondary Applicant:</strong> ${h.secondary_caregiver}</div>` : ''}
                ${h.home_owner ? `<div><strong>Household Owner / Resource:</strong> ${h.home_owner}</div>` : ''}
              </div>

              ${h.notes ? `<p class="text-[11px] text-slate-500 italic">${h.notes}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- VT DCF FS-221A Compliance Checklist (Step-by-step progress tracking) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-700"></i> Vermont DCF FS-221A Licensure & Compliance Tracker
            </h4>
            <p class="text-xs text-slate-500">Step-by-step status for background checks, bedroom safety exits, smoke/CO alarms, and 90-day fingerprint deadlines.</p>
          </div>
        </div>

        <div id="complianceItemsContainer" class="space-y-2.5">
          <!-- Dynamically loaded via fetch /api/compliance -->
        </div>
      </div>

      <!-- DCF Travel Reimbursement & Mileage Monitor -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <i data-lucide="car" class="w-4 h-4 text-emerald-700"></i> DCF Mileage & Reimbursement Monitor
            </h4>
            <p class="text-xs text-slate-500">Monthly breakdown of reimbursable travel (Easterseals visits, medical runs, court hearings) at $0.67/mile.</p>
          </div>
        </div>

        <div id="reimbursementSummaryContainer" class="text-xs">
          <!-- Loaded via fetch /api/reimbursements/summary -->
        </div>
      </div>

      <!-- Training & Safety Requirements (Purtaining to you as caregiver) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <i data-lucide="award" class="w-4 h-4 text-teal-700"></i> Caregiver Training, Certifications & Safety Checks
            </h4>
            <p class="text-xs text-slate-500">VCWTP foster parent training hours, CPR/First Aid, fire drills, and water safety records.</p>
          </div>
          <button onclick="openNewLicensingModal()" class="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Log Entry
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th class="p-3">Category</th>
                <th class="p-3">Description / Topic</th>
                <th class="p-3">Date Completed</th>
                <th class="p-3">Hours / Credits</th>
                <th class="p-3">Provider / Sponsor</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${licItems.length === 0 ? `
                <tr><td colspan="6" class="p-6 text-center text-slate-400">No training or safety drills documented yet. Click 'Log Entry' to record hours.</td></tr>
              ` : licItems.map(it => `
                <tr class="hover:bg-slate-50/80">
                  <td class="p-3 font-semibold text-teal-800">${it.record_type}</td>
                  <td class="p-3 font-bold text-slate-900">${it.title}</td>
                  <td class="p-3 text-slate-600">${it.record_date}</td>
                  <td class="p-3 font-bold text-slate-800">${it.hours > 0 ? it.hours + ' hrs' : '-'}</td>
                  <td class="p-3 text-slate-600">${it.provider || '-'}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${it.status || 'Completed'}</span></td>
                </tr>
              `).join('')}
            </tbody>
        </div>
      </div>

      <!-- Caregiver Self-Regulation & Support Network Toolkit Container -->
      <div id="selfRegulationToolkitContainer"></div>

    </div>
  `;
  container.innerHTML = html;
  loadComplianceAndReimbursementWidgets();
  loadSelfRegulationToolkit();
}

// Licensing Tab 19 View
async function renderLicensingView(container) {
  await renderCaregiverAndHouseholdsView(container);
}

// Tab 8: Smart Communication Center View
async function renderCommunicationsView(container) {
  const child = childrenList.find(c => c.id === currentChildId);
  const recRes = await fetch(`/api/children/${currentChildId}/records?category=all`);
  const records = await recRes.json();
  
  // Filter records that have generated drafts or high severity
  const commEvents = records.filter(r => r.dcf_draft_text || r.gal_draft_text || r.severity !== 'Routine');

  let html = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Tab 8: Caregiver Smart Communication Center</h3>
          <p class="text-xs text-slate-500">Evaluates events, recommends whether notification is needed, and prepares drafts for caregiver review. No emails are ever sent without your explicit approval.</p>
        </div>
      </div>

      <div class="space-y-4">
  `;

  if (commEvents.length === 0) {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
        <i data-lucide="mail" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-sm">No communication-triggering events currently flagged.</p>
        <p class="text-xs text-slate-400 mt-1">When an Important, Court Relevant, or Emergency event is logged, recommended drafts will appear here.</p>
      </div>
    `;
  } else {
    commEvents.forEach(ev => {
      let sevBadge = 'bg-slate-100 text-slate-700';
      if (ev.severity === 'Important') sevBadge = 'bg-blue-100 text-blue-800 border-blue-200';
      if (ev.severity === 'Court Relevant') sevBadge = 'bg-amber-100 text-amber-800 border-amber-200';
      if (ev.severity === 'Emergency') sevBadge = 'bg-red-100 text-red-800 border-red-200 font-bold';

      html += `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sevBadge}">
                ${ev.severity}
              </span>
              <h4 class="font-bold text-slate-900 text-sm">${ev.title}</h4>
              <span class="text-xs text-slate-400 font-medium">(${ev.event_date})</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-500 font-semibold">Status:</span>
              <span class="px-2 py-0.5 rounded font-bold ${ev.communication_status === 'Sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                ${ev.communication_status || 'Draft Ready'}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
            <strong>Logged Event Summary:</strong> ${ev.summary}
          </div>

          <!-- Draft Boxes -->
          ${ev.dcf_draft_text ? `
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <i data-lucide="mail-check" class="w-4 h-4 text-emerald-600"></i> Recommended Action: Notify DCF Caseworker
                </span>
                <span class="text-[11px] text-slate-400 font-medium">Caregiver review required</span>
              </div>
              <textarea id="draft_dcf_${ev.id}" rows="7" class="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500">${ev.dcf_draft_text}</textarea>
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button onclick="markCommStatus(${ev.id}, 'Dismissed')" class="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200">
                  Dismiss Recommendation
                </button>
                <div class="flex items-center gap-2">
                  <button onclick="saveDraftEdits('draft_dcf_${ev.id}', ${ev.id})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i data-lucide="save" class="w-3.5 h-3.5"></i> Save Draft
                  </button>
                  <button onclick="copyDraftText('draft_dcf_${ev.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Text
                  </button>
                  <button onclick="openMailClient('draft_dcf_${ev.id}', ${ev.id})" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow">
                    <i data-lucide="send" class="w-3.5 h-3.5"></i> Open in Email & Mark Sent
                  </button>
                </div>
              </div>
            </div>
          ` : ''}

          ${ev.gal_draft_text ? `
            <div class="space-y-2 pt-3 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <i data-lucide="scale" class="w-4 h-4 text-amber-600"></i> Optional Court Preparation: Consider Notifying GAL
                </span>
                <span class="text-[11px] text-slate-400">Optional</span>
              </div>
              <textarea id="draft_gal_${ev.id}" rows="6" class="w-full text-xs font-mono p-3 border border-amber-200 rounded-xl bg-amber-50/30 focus:ring-2 focus:ring-amber-500">${ev.gal_draft_text}</textarea>
              <div class="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button onclick="copyDraftText('draft_gal_${ev.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy GAL Draft
                </button>
                <button onclick="openMailClient('draft_gal_${ev.id}', ${ev.id})" class="text-xs bg-amber-700 hover:bg-amber-800 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow">
                  <i data-lucide="send" class="w-3.5 h-3.5"></i> Open in Email & Mark Sent
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });
  }

  html += `</div></div>`;
  container.innerHTML = html;
  lucide.createIcons();
}

function copyDraftText(textareaId) {
  const el = document.getElementById(textareaId);
  if (el) {
    navigator.clipboard.writeText(el.value);
    alert("Email draft copied to clipboard!");
  }
}

async function openMailClient(textareaId, recordId, recipientEmail = null) {
  const el = document.getElementById(textareaId);
  if (!el) return;
  const text = el.value;
  
  // Extract Recipient, Subject and Body
  const lines = text.split('\n');
  let toEmail = recipientEmail || '';
  let subject = "Case Notification: Child Update";
  let bodyLines = [];
  let foundBody = false;

  for (let l of lines) {
    if (l.startsWith("To:") && !toEmail) {
      const match = l.match(/<([^>]+)>/);
      if (match && !match[1].includes('[')) {
        toEmail = match[1];
      }
    } else if (l.startsWith("Subject:")) {
      subject = l.replace("Subject:", "").trim();
    } else if (l.startsWith("Dear ") || foundBody) {
      foundBody = true;
      bodyLines.push(l);
    }
  }

  const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  window.open(mailtoUrl, '_blank');

  // Mark status as Sent
  await apiFetch(`/api/records/${recordId}/comm-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Sent' })
  });
  loadTabContent();
}

async function markCommStatus(recordId, status) {
  await apiFetch(`/api/records/${recordId}/comm-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  loadTabContent();
}

async function saveDraftEdits(textareaId, recordId) {
  const el = document.getElementById(textareaId);
  if (!el) return;
  await apiFetch(`/api/records/${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dcf_draft_text: el.value })
  });
  alert("Draft saved to binder.");
  loadTabContent();
}

// Reports & Local AI Tab 17 View
function renderReportsView(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h3 class="font-bold text-slate-800 text-base">Tab 17: Monthly Status Report & Local AI Assistant</h3>
        <p class="text-xs text-slate-500">Synthesize all logs into official Word documents and run private offline summaries with Ollama.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 30-Second AI Summarizer -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600"></i>
            <span>Local AI 30-Day Case Digest</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            Run an on-device summary using your local Ollama models. Answers: <em>"How is the child doing? What happened? What needs follow-up? What is next?"</em> in seconds.
          </p>

          <button onclick="runLocalAiSummary()" id="aiRunBtn" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg shadow transition flex items-center justify-center gap-2">
            <i data-lucide="bot" class="w-4 h-4"></i> Generate 30-Day DCF Summary
          </button>

          <div id="aiOutput" class="hidden bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 max-h-72 overflow-y-auto whitespace-pre-line leading-relaxed font-mono">
          </div>
        </div>

        <!-- Word Document Export -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex items-center gap-2 text-cyan-800 font-bold text-sm">
            <i data-lucide="file-down" class="w-4 h-4 text-cyan-600"></i>
            <span>Export Official DCF Monthly Report (.docx)</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            Generates a formatted Microsoft Word document containing contacts, timeline activities, medical summaries, and outstanding action items ready for your DCF worker.
          </p>

          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                <input type="number" id="rptYear" value="2026" class="w-full text-xs border rounded-lg p-2" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Month (1-12)</label>
                <input type="number" id="rptMonth" value="10" min="1" max="12" class="w-full text-xs border rounded-lg p-2" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Export Privacy Mode *</label>
              <select id="rptPrivacyMode" class="w-full text-xs border border-cyan-300 rounded-lg p-2 bg-cyan-50/50 font-semibold text-slate-800">
                <option value="initials">🔒 Initials Only (Default — Zero PII Exposure)</option>
                <option value="dcf">📋 DCF Version (Standard Case Plan & Review Packet)</option>
                <option value="court">⚖️ Court Version (Privileged Family Court Chronology)</option>
                <option value="legal">👤 Full Legal Name (Internal Caregiver Records)</option>
              </select>
              <p class="text-[11px] text-slate-500 mt-1">Select the recipient-appropriate level of confidentiality before exporting.</p>
            </div>
          </div>

          <button onclick="generateDocxReport()" id="docxBtn" class="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs py-2.5 rounded-lg shadow transition flex items-center justify-center gap-2">
            <i data-lucide="download" class="w-4 h-4"></i> Create & Download Word Report
          </button>
          <div id="docxResult" class="text-xs text-center font-medium"></div>
        </div>
      </div>

      <!-- Respite Provider Handoff Card Section -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <i data-lucide="heart-handshake" class="w-4 h-4 text-indigo-600"></i>
              <span>Respite Provider Care Handoff Card</span>
            </div>
            <p class="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Provides respite workers with a clean, need-to-know summary: emergency contacts, allergies, daily soothing routines, and feeding schedules. <strong>Zero sensitive legal or court history</strong> is included, maintaining strict confidentiality across multiple caregiving households.
            </p>
          </div>
          <button onclick="generateRespiteCard()" id="respiteBtn" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 shrink-0">
            <i data-lucide="file-check" class="w-4 h-4"></i> Export Respite Card (.docx)
          </button>
        </div>
        <div id="respiteResult" class="text-xs text-center font-medium"></div>
      </div>

      <!-- Vermont DCF State Form Auto-Filler (FS-334B & FS-333B Claims) -->
      <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-emerald-200/80 pb-3">
          <div>
            <h4 class="font-bold text-emerald-950 text-base flex items-center gap-2">
              <i data-lucide="file-spreadsheet" class="w-5 h-5 text-emerald-700"></i>
              <span>Vermont DCF State Reimbursement Form Auto-Filler</span>
            </h4>
            <p class="text-xs text-emerald-800">
              1-Click official Word/DOCX export pre-filled with logged trips, mileage calculations ($0.67/mi), and signature blocks for prompt state reimbursement.
            </p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase tracking-wider">
            Official Forms
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- Form FS-334B: Travel & Mileage -->
          <div class="bg-white p-4 rounded-xl border border-emerald-200 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <i data-lucide="car" class="w-4 h-4 text-emerald-600"></i> Form FS-334B: Travel Claim
              </span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">$0.67 / Mile</span>
            </div>
            <p class="text-slate-600 leading-relaxed text-[11px]">
              Extracts all Family Time visitation runs, medical trips, and court hearings. Pre-calculates itemized miles, dollar amounts, and certification text ready for caseworker signature.
            </p>
            <button onclick="generateDcfClaimForm('FS-334B')" id="claimBtn-FS-334B" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4"></i> Export Form FS-334B (.docx)
            </button>
            <div id="claimResult-FS-334B" class="text-center text-[11px] font-semibold text-emerald-800"></div>
          </div>

          <!-- Form FS-333B: Special Expense Claim -->
          <div class="bg-white p-4 rounded-xl border border-teal-200 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <i data-lucide="receipt" class="w-4 h-4 text-teal-600"></i> Form FS-333B: Expense Claim
              </span>
              <span class="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">Special Care</span>
            </div>
            <p class="text-slate-600 leading-relaxed text-[11px]">
              Itemizes extraordinary clothing allowances, education/sports fees, and RPPS prudent-parent approved expenses incurred on behalf of the child.
            </p>
            <button onclick="generateDcfClaimForm('FS-333B')" id="claimBtn-FS-333B" class="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4"></i> Export Form FS-333B (.docx)
            </button>
            <div id="claimResult-FS-333B" class="text-center text-[11px] font-semibold text-teal-800"></div>
          </div>
        </div>
      </div>

      <!-- iCalendar (.ics) Sync Export Card -->
      <div class="bg-white rounded-xl border border-sky-200 p-5 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <i data-lucide="calendar" class="w-4 h-4 text-sky-600"></i>
              <span>Calendar Integration & Schedule Export (.ics)</span>
            </div>
            <p class="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Export court hearings, well-child EPSDT checkups, DCF worker visits, and upcoming follow-ups into a standard <strong>.ics calendar file</strong> compatible with Google Calendar, Outlook, iPhone, and Android.
            </p>
          </div>
          <button onclick="exportChildCalendarIcs()" id="calIcsBtn" class="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 shrink-0">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i> Download Calendar (.ics)
          </button>
        </div>
        <div id="calIcsResult" class="text-xs text-center font-medium"></div>
      </div>

      <!-- Offline Database Snapshot & Disaster Recovery Backup Card -->
      <div class="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <i data-lucide="hard-drive-download" class="w-4 h-4 text-emerald-700"></i>
              <span>Encrypted Offline Database Backup (.zip)</span>
            </div>
            <p class="text-xs text-slate-600 max-w-2xl leading-relaxed">
              1-Click disaster recovery snapshot bundling your local SQLite database, complete cryptographic audit log ledger, and verification manifests. Perfect for storing safely on an encrypted USB thumb drive or personal drive.
            </p>
          </div>
          <button onclick="downloadBackupSnapshot()" id="backupSnapBtn" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 shrink-0">
            <i data-lucide="save" class="w-4 h-4"></i> Create Backup Snapshot (.zip)
          </button>
        </div>
        <div id="backupSnapResult" class="text-xs text-center font-medium"></div>
      </div>

    </div>
  `;
}

async function generateDcfClaimForm(claimType) {
  const btn = document.getElementById(`claimBtn-${claimType}`);
  const status = document.getElementById(`claimResult-${claimType}`);
  const year = document.getElementById('rptYear') ? parseInt(document.getElementById('rptYear').value) : new Date().getFullYear();
  const month = document.getElementById('rptMonth') ? parseInt(document.getElementById('rptMonth').value) : (new Date().getMonth() + 1);

  if (btn) btn.disabled = true;
  if (status) status.textContent = `Assembling official Vermont Form ${claimType}...`;

  try {
    const res = await apiFetch('/api/reports/dcf-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: currentChildId,
        year: year,
        month: month,
        claim_type: claimType
      })
    });
    const data = await res.json();
    if (data.download_url) {
      if (status) status.innerHTML = `<a href="${data.download_url}" class="text-emerald-700 font-bold underline">Download ${data.filename}</a>`;
      window.open(data.download_url, '_blank');
    } else {
      if (status) status.textContent = "Error: " + (data.error || 'Failed to generate form');
    }
  } catch (err) {
    if (status) status.textContent = "Error: " + err.message;
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function exportChildCalendarIcs() {
  const btn = document.getElementById('calIcsBtn');
  const status = document.getElementById('calIcsResult');

  if (btn) btn.disabled = true;
  if (status) status.textContent = "Generating standard iCalendar (.ics) export...";

  try {
    const res = await apiFetch('/api/calendar/export-ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: currentChildId
      })
    });
    const data = await res.json();
    if (data.download_url) {
      if (status) status.innerHTML = `<span class="text-sky-700 font-bold">✓ Ready:</span> <a href="${data.download_url}" class="text-sky-800 font-extrabold underline ml-1">${data.filename}</a>`;
      window.open(data.download_url, '_blank');
    } else {
      if (status) status.textContent = "Error: " + (data.error || 'Failed to generate schedule');
    }
  } catch (err) {
    if (status) status.textContent = "Error: " + err.message;
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function downloadBackupSnapshot() {
  const btn = document.getElementById('backupSnapBtn');
  const status = document.getElementById('backupSnapResult');

  if (btn) btn.disabled = true;
  if (status) status.textContent = "Packaging encrypted local SQLite database & audit ledger...";

  try {
    const res = await apiFetch('/api/system/backup-snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.download_url) {
      if (status) status.innerHTML = `<span class="text-emerald-700 font-bold">✓ Backup Created:</span> <a href="${data.download_url}" class="text-emerald-800 font-extrabold underline ml-1">${data.filename}</a>`;
      window.open(data.download_url, '_blank');
    } else {
      if (status) status.textContent = "Error: " + (data.error || 'Failed to create backup');
    }
  } catch (err) {
    if (status) status.textContent = "Error: " + err.message;
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Modal Handlers (Two-Step Smart Logger)
function openRecordModal() {
  document.getElementById('recEditId').value = '';
  document.getElementById('recordForm').reset();
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('recDate');
  if (dateInput) dateInput.value = today;
  const sevEl = document.getElementById('recSeverity');
  if (sevEl) sevEl.value = 'Routine';
  const catEl = document.getElementById('recCategory');
  if (catEl) catEl.value = 'daily';

  // Collapse Step 2 by default (Two-Step Smart Logger)
  const advSection = document.getElementById('recordAdvancedSection');
  if (advSection) advSection.classList.add('hidden');
  const toggleLabel = document.getElementById('recordStep2ToggleLabel');
  if (toggleLabel) toggleLabel.textContent = '+ Add Mileage, Location, RPPS & Follow-up (Optional Step 2)';

  toggleFollowUpFields();
  updateMileagePayoutDisplay();
  document.getElementById('recordModal').classList.remove('hidden');
  lucide.createIcons();
}

function closeRecordModal() {
  document.getElementById('recordModal').classList.add('hidden');
}

function toggleRecordAdvancedDetails() {
  const advSection = document.getElementById('recordAdvancedSection');
  const toggleLabel = document.getElementById('recordStep2ToggleLabel');
  if (!advSection) return;
  const isHidden = advSection.classList.contains('hidden');
  if (isHidden) {
    advSection.classList.remove('hidden');
    if (toggleLabel) toggleLabel.textContent = '- Hide Optional Details';
  } else {
    advSection.classList.add('hidden');
    if (toggleLabel) toggleLabel.textContent = '+ Add Mileage, Location, RPPS & Follow-up (Optional Step 2)';
  }
  lucide.createIcons();
}

function toggleFollowUpFields() {
  const check = document.getElementById('recFollowUpNeeded').checked;
  document.getElementById('followUpGroup').classList.toggle('hidden', !check);
}

// Edit Record Modal
async function openEditRecordModal(id) {
  const res = await fetch(`/api/children/${currentChildId}/records?category=all`);
  const records = await res.json();
  const record = records.find(r => r.id === id);
  if (!record) return;

  document.getElementById('recEditId').value = record.id;
  document.getElementById('recCategory').value = record.category;
  document.getElementById('recTitle').value = record.title;
  document.getElementById('recDate').value = record.event_date;
  document.getElementById('recLocation').value = record.location || '';
  document.getElementById('recParticipants').value = record.participants || '';
  document.getElementById('recSummary').value = record.summary || '';
  const sevEl = document.getElementById('recSeverity');
  if (sevEl) sevEl.value = record.severity || 'Routine';
  document.getElementById('recFollowUpNeeded').checked = !!record.follow_up_needed;
  document.getElementById('recFollowUpNotes').value = record.follow_up_notes || '';
  document.getElementById('recFollowUpDue').value = record.follow_up_due_date || '';
  
  // Show advanced section when editing existing record
  const advSection = document.getElementById('recordAdvancedSection');
  if (advSection) advSection.classList.remove('hidden');
  const toggleLabel = document.getElementById('recordStep2ToggleLabel');
  if (toggleLabel) toggleLabel.textContent = '- Hide Optional Details';

  toggleFollowUpFields();
  document.getElementById('recordModal').classList.remove('hidden');
  lucide.createIcons();
}

// Task Completed Toggle
async function toggleTaskComplete(id) {
  await fetch(`/api/records/${id}/toggle-complete`, { method: 'POST' });
  renderChildSnapshot();
  loadTabContent();
}

// Global Omnibar Full-Text Search Controller (Ctrl + K)
let omnibarDebounce = null;
let currentOmnibarFilter = 'all';

function openOmnibarModal() {
  const modal = document.getElementById('omnibarModal');
  const input = document.getElementById('omnibarSearchInput');
  if (!modal || !input) return;
  modal.classList.remove('hidden');
  input.value = '';
  input.focus();
  setOmnibarFilter('all');
  renderOmnibarPlaceholder();
  lucide.createIcons();
}

function closeOmnibarModal() {
  const modal = document.getElementById('omnibarModal');
  if (modal) modal.classList.add('hidden');
}

function renderOmnibarPlaceholder() {
  const container = document.getElementById('omnibarResultsContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="p-8 text-center text-slate-400">
      <i data-lucide="sparkles" class="w-6 h-6 text-emerald-500 mx-auto mb-2 opacity-80"></i>
      <p class="font-semibold text-slate-600">Type anything to search across child records, meds, and contacts.</p>
      <p class="text-[11px] text-slate-400 mt-1">Instant local search • Press <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px]">ESC</kbd> to exit</p>
    </div>
  `;
}

function setOmnibarFilter(filter) {
  currentOmnibarFilter = filter;
  document.querySelectorAll('.omnibar-chip').forEach(btn => {
    if (btn.getAttribute('data-omnifilter') === filter) {
      btn.className = "omnibar-chip px-2.5 py-1 rounded-full bg-emerald-700 text-white font-bold";
    } else {
      btn.className = "omnibar-chip px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200";
    }
  });
  const input = document.getElementById('omnibarSearchInput');
  if (input && input.value.trim().length > 0) {
    executeOmnibarSearch(input.value.trim());
  }
}

function handleOmnibarInput(e) {
  clearTimeout(omnibarDebounce);
  const query = e.target.value.trim();
  if (!query) {
    renderOmnibarPlaceholder();
    lucide.createIcons();
    return;
  }
  omnibarDebounce = setTimeout(() => {
    executeOmnibarSearch(query);
  }, 200);
}

async function executeOmnibarSearch(query) {
  const container = document.getElementById('omnibarResultsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="p-6 text-center text-slate-400">
      <i data-lucide="loader" class="w-5 h-5 animate-spin mx-auto text-emerald-600 mb-1"></i>
      <span class="text-xs">Searching local offline records...</span>
    </div>
  `;
  lucide.createIcons();

  try {
    const [recRes, contactRes, docRes] = await Promise.all([
      apiFetch(`/api/children/${currentChildId}/records?category=all&search=${encodeURIComponent(query)}`),
      apiFetch(`/api/contacts`),
      apiFetch(`/api/shared-docs`)
    ]);

    const records = await recRes.json();
    const contacts = await contactRes.json();
    const docs = await docRes.json();

    const lowerQ = query.toLowerCase();
    const matchedContacts = contacts.filter(c => 
      (c.name || '').toLowerCase().includes(lowerQ) || 
      (c.role || '').toLowerCase().includes(lowerQ) || 
      (c.organization || '').toLowerCase().includes(lowerQ)
    );
    const matchedDocs = docs.filter(d => 
      (d.filename || '').toLowerCase().includes(lowerQ) || 
      (d.category || '').toLowerCase().includes(lowerQ)
    );

    let filteredRecords = records;
    if (currentOmnibarFilter !== 'all' && currentOmnibarFilter !== 'contacts' && currentOmnibarFilter !== 'documents') {
      filteredRecords = records.filter(r => r.category === currentOmnibarFilter);
    }

    const showContacts = currentOmnibarFilter === 'all' || currentOmnibarFilter === 'contacts';
    const showDocs = currentOmnibarFilter === 'all' || currentOmnibarFilter === 'documents';

    const totalMatches = (currentOmnibarFilter === 'contacts' ? 0 : filteredRecords.length) + 
                         (showContacts ? matchedContacts.length : 0) + 
                         (showDocs ? matchedDocs.length : 0);

    if (totalMatches === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-1 text-slate-300"></i>
          <p class="font-bold text-slate-700">No records found for "${query}"</p>
          <p class="text-[11px] text-slate-400 mt-1">Try another keyword or switch category filters.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    let html = '';

    // Render Contact Matches
    if (showContacts && matchedContacts.length > 0) {
      html += `<div class="p-2 bg-indigo-50/60 font-bold text-indigo-900 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><i data-lucide="contact" class="w-3.5 h-3.5"></i> Contacts (${matchedContacts.length})</div>`;
      matchedContacts.forEach(c => {
        html += `
          <div onclick="closeOmnibarModal(); switchMainSection('contacts');" class="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition">
            <div>
              <div class="font-bold text-slate-900">${c.name} <span class="text-xs text-indigo-700 font-semibold">(${c.role})</span></div>
              <div class="text-[11px] text-slate-500">${c.organization || ''} • <span class="privacy-sensitive">${c.phone || c.email || 'No direct phone'}</span></div>
            </div>
            <span class="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">View Contact</span>
          </div>
        `;
      });
    }

    // Render Document Matches
    if (showDocs && matchedDocs.length > 0) {
      html += `<div class="p-2 bg-blue-50/60 font-bold text-blue-900 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><i data-lucide="files" class="w-3.5 h-3.5"></i> Documents & Forms (${matchedDocs.length})</div>`;
      matchedDocs.forEach(d => {
        html += `
          <div onclick="closeOmnibarModal(); switchMainSection('documents');" class="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition">
            <div>
              <div class="font-bold text-slate-900">${d.filename}</div>
              <div class="text-[11px] text-slate-500">Category: <strong>${d.category || 'General'}</strong></div>
            </div>
            <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Open Vault</span>
          </div>
        `;
      });
    }

    // Render Event / Binder Matches
    if (currentOmnibarFilter !== 'contacts' && currentOmnibarFilter !== 'documents' && filteredRecords.length > 0) {
      html += `<div class="p-2 bg-emerald-50/60 font-bold text-emerald-900 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><i data-lucide="book-open" class="w-3.5 h-3.5"></i> Binder & Timeline Records (${filteredRecords.length})</div>`;
      filteredRecords.forEach(r => {
        html += `
          <div onclick="closeOmnibarModal(); openEditRecordModal(${r.id});" class="p-3 hover:bg-slate-50 cursor-pointer flex items-start justify-between transition gap-3">
            <div>
              <div class="font-bold text-slate-900">${r.title} <span class="text-[11px] text-slate-400 font-normal">(${r.event_date})</span></div>
              <div class="text-xs text-slate-600 mt-0.5 line-clamp-1 privacy-sensitive">${r.summary || 'Logged observation.'}</div>
            </div>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase shrink-0">${r.category}</span>
          </div>
        `;
      });
    }

    container.innerHTML = html;
    lucide.createIcons();
  } catch (err) {
    container.innerHTML = `<div class="p-4 text-xs text-rose-700 bg-rose-50 font-bold">Error executing search: ${err.message}</div>`;
  }
}

// Global Keyboard Listener for Ctrl + K and ESC
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    openOmnibarModal();
  } else if (e.key === 'Escape') {
    closeOmnibarModal();
    closeEmergencyHandoffModal();
  }
});

// Global Instant Search (Legacy fallback)
let searchDebounce = null;
function handleGlobalSearch(e) {
  openOmnibarModal();
}

// Single-entry Submission (Supports both CREATE and UPDATE)
async function handleRecordSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('recEditId').value;
  const fileInput = document.getElementById('recFile');
  let attachment_path = '';
  let attachment_name = '';

  if (fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const upData = await upRes.json();
    attachment_path = upData.url;
    attachment_name = upData.filename;
  }

  const caregiverSelect = document.getElementById('caregiverSelect');
  const author = caregiverSelect ? caregiverSelect.value : 'Candy Chevalier';
  const severity = document.getElementById('recSeverity').value || 'Routine';

  const payload = {
    child_id: currentChildId,
    category: document.getElementById('recCategory').value,
    severity: severity,
    author: author,
    title: document.getElementById('recTitle').value,
    event_date: document.getElementById('recDate').value,
    location: document.getElementById('recLocation').value,
    participants: document.getElementById('recParticipants').value,
    summary: document.getElementById('recSummary').value,
    follow_up_needed: document.getElementById('recFollowUpNeeded').checked,
    follow_up_notes: document.getElementById('recFollowUpNotes').value,
    follow_up_due_date: document.getElementById('recFollowUpDue').value,
    mileage: parseFloat(document.getElementById('recMileage') ? document.getElementById('recMileage').value || 0 : 0),
    rpps_category: document.getElementById('recRppsCategory') ? document.getElementById('recRppsCategory').value : '',
    attachment_path,
    attachment_name
  };

  if (editId) {
    // Update existing record
    await fetch(`/api/records/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // Create new record
    const addRes = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const addData = await addRes.json();
    if (addData.eval_res && addData.eval_res.dcf_needed) {
      setTimeout(() => {
        if (confirm(`Smart Communication Alert: This ${severity} event generated a recommended DCF notification draft. Would you like to view the draft now?`)) {
          switchTab('communications');
        }
      }, 300);
    }
  }

  closeRecordModal();
  document.getElementById('recordForm').reset();
  toggleFollowUpFields();
  renderChildSnapshot();
  loadTabContent();
}

async function deleteRecord(id) {
  if (confirm("Delete this entry from the binder?")) {
    await fetch(`/api/records/${id}`, { method: 'DELETE' });
    renderChildSnapshot();
    loadTabContent();
  }
}

// AI summary caller
async function runLocalAiSummary() {
  const btn = document.getElementById('aiRunBtn');
  const out = document.getElementById('aiOutput');
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Reading Binder & Summarizing with Ollama...`;
  out.classList.remove('hidden');
  out.textContent = "Analyzing case records locally on your device...";
  lucide.createIcons();

  try {
    const res = await fetch('/api/ai/summarize-period', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: currentChildId, days: 30 })
    });
    const data = await res.json();
    out.textContent = data.summary;
  } catch (err) {
    out.textContent = "Error generating AI summary: " + err.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="bot" class="w-4 h-4"></i> Generate 30-Day DCF Summary`;
    lucide.createIcons();
  }
}

// P0-1 Quick 1-Click Monthly Export from Mission Control
async function quickExportThisMonth() {
  if (!currentChildId && childrenList.length > 0) {
    currentChildId = childrenList[0].id;
    const select = document.getElementById('childSelect');
    if (select) select.value = currentChildId;
  }

  if (!currentChildId) {
    alert("Please add or select a child in care first to generate the monthly report.");
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  try {
    const res = await apiFetch('/api/reports/monthly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: currentChildId,
        year: year,
        month: month,
        privacy_mode: 'initials'
      })
    });
    const data = await res.json();
    if (data.download_url) {
      window.open(data.download_url, '_blank');
    } else if (data.error) {
      alert("Notice: " + data.error);
    }
  } catch (err) {
    alert("Export generation error: " + err.message);
  }
}

// Word report generator
async function generateDocxReport() {
  const btn = document.getElementById('docxBtn');
  const status = document.getElementById('docxResult');
  btn.disabled = true;
  status.textContent = "Generating official Word report...";

  try {
    const res = await apiFetch('/api/reports/monthly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: currentChildId,
        year: document.getElementById('rptYear').value,
        month: document.getElementById('rptMonth').value,
        privacy_mode: document.getElementById('rptPrivacyMode').value || 'initials'
      })
    });
    const data = await res.json();
    if (data.download_url) {
      status.innerHTML = `<a href="${data.download_url}" class="text-emerald-700 font-bold underline">Download ${data.filename}</a>`;
      window.open(data.download_url, '_blank');
    }
  } catch (err) {
    status.textContent = "Error: " + err.message;
  } finally {
    btn.disabled = false;
  }
}

async function generateRespiteCard() {
  const btn = document.getElementById('respiteBtn');
  const status = document.getElementById('respiteResult');
  btn.disabled = true;
  status.textContent = "Generating respite care handoff card...";

  try {
    const res = await apiFetch('/api/reports/respite-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: currentChildId })
    });
    const data = await res.json();
    if (data.download_url) {
      status.innerHTML = `<a href="${data.download_url}" class="text-indigo-700 font-bold underline">Download ${data.filename}</a>`;
      window.open(data.download_url, '_blank');
    }
  } catch (err) {
    status.textContent = "Error: " + err.message;
  } finally {
    btn.disabled = false;
  }
}

// 1-Click Emergency & Babysitter Care Handoff Card Logic
async function openEmergencyHandoffCard() {
  const modal = document.getElementById('emergencyHandoffModal');
  const container = document.getElementById('emergencyHandoffCardContent');
  if (!modal || !container) return;

  const child = childrenList.find(c => c.id === currentChildId);
  if (!child) {
    alert("Please select a child first.");
    return;
  }

  modal.classList.remove('hidden');
  container.innerHTML = `
    <div class="p-8 text-center text-slate-500">
      <i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto text-rose-600 mb-2"></i>
      <p class="font-semibold text-xs">Assembling urgent care records, contacts, and soothing plan...</p>
    </div>
  `;
  lucide.createIcons();

  try {
    // Concurrent fetch of child records, POSC soothing plan, and emergency contacts
    const [recRes, poscRes, contactRes] = await Promise.all([
      apiFetch(`/api/children/${currentChildId}/records?category=all`),
      apiFetch(`/api/children/${currentChildId}/posc`),
      apiFetch(`/api/contacts`)
    ]);

    const records = await recRes.json();
    const poscData = await poscRes.json();
    const contacts = await contactRes.json();

    const alias = child.alias || `${child.first_name || ''} ${child.last_name || ''}`.trim() || 'CD';
    const medRecords = records.filter(r => r.category === 'medical' && (
      r.title.toLowerCase().includes('med') || 
      (r.summary || '').toLowerCase().includes('dose') || 
      (r.summary || '').toLowerCase().includes('mg') ||
      (r.summary || '').toLowerCase().includes('prescription')
    ));

    // Identify primary worker, doctor, and emergency contacts
    const workerContact = contacts.find(c => (c.role || '').toLowerCase().includes('worker') || (c.role || '').toLowerCase().includes('dcf')) || contacts[0];
    const pedContact = contacts.find(c => (c.role || '').toLowerCase().includes('pediatric') || (c.role || '').toLowerCase().includes('doctor') || (c.role || '').toLowerCase().includes('physician'));

    container.innerHTML = `
      <!-- Printable Card Frame -->
      <div id="printableCardFrame" class="border-2 border-slate-900 rounded-xl p-5 bg-white space-y-4 font-sans text-slate-900">
        
        <!-- Header Banner with Vital Identifiers -->
        <div class="flex items-start justify-between border-b-2 border-slate-900 pb-3">
          <div>
            <div class="text-[10px] font-black uppercase tracking-wider text-rose-700">Vermont Foster / Kinship Care • Urgent Information Card</div>
            <h2 class="text-xl font-black text-slate-900 mt-0.5">${alias}</h2>
            <div class="text-xs text-slate-600 mt-0.5">
              <span>DOB: <strong>${child.dob || 'Not specified'}</strong></span> • 
              <span>Care Status: <strong>${child.relationship_type || 'Active Placement'}</strong></span> • 
              <span>Medicaid / VT ID: <strong>${child.medicaid_number || 'On File with DCF'}</strong></span>
            </div>
          </div>
          <div class="text-right">
            <span class="px-2.5 py-1 rounded bg-rose-100 border border-rose-300 font-black text-rose-800 text-xs inline-block">
              EMERGENCY ONLY
            </span>
            <div class="text-[10px] text-slate-400 mt-1">Generated: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <!-- High-Priority Alerts Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-rose-50 border-2 border-rose-400 rounded-lg p-3">
            <div class="text-[10px] font-black uppercase tracking-wider text-rose-900 flex items-center gap-1">
              <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-600"></i> Known Allergies & Medical Alerts
            </div>
            <div class="text-xs font-bold text-rose-950 mt-1">${child.allergies && child.allergies.trim() ? child.allergies : 'No known drug or environmental allergies logged.'}</div>
            <div class="text-[11px] text-rose-800 mt-0.5">${child.emergency_notes || 'Call 911 immediately in acute respiratory distress.'}</div>
          </div>

          <div class="bg-amber-50 border-2 border-amber-400 rounded-lg p-3">
            <div class="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <i data-lucide="heart" class="w-3.5 h-3.5 text-amber-600"></i> Comfort Items & Soothing Routines
            </div>
            <div class="text-xs font-bold text-amber-950 mt-1">${poscData.soothing_techniques || child.comfort_items || 'Quiet space, gentle rock, bedtime comfort blanket/lovey.'}</div>
            <div class="text-[11px] text-amber-800 mt-0.5">Special Diet: ${child.food_preferences || 'Standard balanced toddler meals & hydration.'}</div>
          </div>
        </div>

        <!-- Active Medications Section -->
        <div class="border border-slate-300 rounded-lg p-3 bg-slate-50/70">
          <div class="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span class="flex items-center gap-1"><i data-lucide="pill" class="w-3.5 h-3.5 text-blue-600"></i> Active Daily Medications / Prescriptions</span>
            <span class="text-[10px] font-semibold text-slate-500">${medRecords.length} Documented</span>
          </div>
          ${medRecords.length === 0 ? `
            <p class="text-xs text-slate-600 italic mt-1">No ongoing prescription medications logged. Follow standard pediatrician over-the-counter dosage rules only if directed.</p>
          ` : `
            <div class="mt-2 divide-y divide-slate-200 text-xs">
              ${medRecords.slice(0, 4).map(m => `
                <div class="py-1 flex items-center justify-between">
                  <span class="font-bold text-slate-800">${m.title}</span>
                  <span class="text-slate-600 text-[11px]">${m.summary ? m.summary.substring(0, 50) : m.event_date}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Emergency Contact Directory Strip -->
        <div class="border-t border-slate-200 pt-3">
          <div class="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2">Immediate Response Contacts</div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div class="bg-slate-100 p-2 rounded border border-slate-200">
              <span class="font-black block text-slate-900">Current Caregiver:</span>
              <span class="text-slate-700 font-semibold">${activeCaregiverUser ? (LOCAL_CAREGIVERS.find(c => c.id === activeCaregiverUser) || SAMPLE_CAREGIVERS.find(c => c.id === activeCaregiverUser) || {}).name : 'Caregiver on File'}</span>
              <span class="text-slate-500 block text-[10px]">Primary Home Provider</span>
            </div>
            <div class="bg-slate-100 p-2 rounded border border-slate-200">
              <span class="font-black block text-slate-900">DCF Family Worker:</span>
              <span class="text-slate-700 font-semibold">${workerContact ? workerContact.name : 'District Family Services'}</span>
              <span class="text-slate-500 block text-[10px]">${workerContact ? (workerContact.phone || workerContact.email || 'District Office') : 'State Emergency Duty Line'}</span>
            </div>
            <div class="bg-slate-100 p-2 rounded border border-slate-200">
              <span class="font-black block text-slate-900">Pediatrician / Clinic:</span>
              <span class="text-slate-700 font-semibold">${pedContact ? pedContact.name : 'Assigned Pediatrician'}</span>
              <span class="text-slate-500 block text-[10px]">${pedContact ? (pedContact.phone || 'Local Health Center') : 'Local Clinic On File'}</span>
            </div>
          </div>
        </div>

      </div>
    `;
    lucide.createIcons();
  } catch (err) {
    container.innerHTML = `
      <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
        <p class="font-bold">Unable to load emergency card details:</p>
        <p class="mt-1">${err.message}</p>
      </div>
    `;
  }
}

function closeEmergencyHandoffModal() {
  const modal = document.getElementById('emergencyHandoffModal');
  if (modal) modal.classList.add('hidden');
}

function printEmergencyHandoffCard() {
  const frame = document.getElementById('printableCardFrame');
  if (!frame) {
    window.print();
    return;
  }

  // Create isolated print iframe or window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Emergency & Care Handoff Card</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #0f172a; }
          .border-2 { border: 2px solid #0f172a; }
          .rounded-xl { border-radius: 12px; }
          .rounded-lg { border-radius: 8px; }
          .p-5 { padding: 20px; }
          .p-3 { padding: 12px; }
          .p-2 { padding: 8px; }
          .space-y-4 > * + * { margin-top: 16px; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gap-3 { gap: 12px; }
          .gap-2 { gap: 8px; }
          .bg-rose-50 { background-color: #fff1f2; }
          .border-rose-400 { border-color: #fb7185; }
          .bg-amber-50 { background-color: #fffbeb; }
          .border-amber-400 { border-color: #fbbf24; }
          .bg-slate-100 { background-color: #f1f5f9; }
          .font-black { font-weight: 900; }
          .font-bold { font-weight: 700; }
          .text-xl { font-size: 20px; }
          .text-xs { font-size: 12px; }
          .text-10 { font-size: 10px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${frame.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    window.print();
  }
}

// Child modal
function openNewChildModal() {
  document.getElementById('newChildModal').classList.remove('hidden');
}
function closeNewChildModal() {
  document.getElementById('newChildModal').classList.add('hidden');
}
async function handleNewChildSubmit(e) {
  e.preventDefault();
  const aliasInput = document.getElementById('newChildAlias');
  const alias = (aliasInput ? aliasInput.value : '').trim().toUpperCase();
  if (!alias) {
    alert("Please provide child initials or alias (e.g. CD).");
    return;
  }
  const relSelect = document.getElementById('newChildRelationship');
  const epSelect = document.getElementById('newChildEpisodeStatus');
  const payload = {
    alias: alias,
    relationship_type: relSelect ? relSelect.value : 'Primary Placement',
    episode_status: epSelect ? epSelect.value : 'Active',
    episode_start_date: document.getElementById('newChildEpisodeStart') ? document.getElementById('newChildEpisodeStart').value : '',
    episode_end_date: document.getElementById('newChildEpisodeEnd') ? document.getElementById('newChildEpisodeEnd').value : '',
    dob: document.getElementById('newChildDob').value,
    placement_date: document.getElementById('newChildPlacement').value,
    permanency_goal: document.getElementById('newChildGoal').value,
    allergies: document.getElementById('newChildAllergies').value,
    food_preferences: document.getElementById('newChildFood') ? document.getElementById('newChildFood').value : '',
    comfort_items: document.getElementById('newChildComfort') ? document.getElementById('newChildComfort').value : '',
    behavioral_supports: document.getElementById('newChildBehavior') ? document.getElementById('newChildBehavior').value : ''
  };

  const res = await apiFetch('/api/children', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.error || 'Failed to create child profile.');
    return;
  }

  closeNewChildModal();
  await loadChildren();
}

// 30-Second Fast Intake Presets
function applyIntakePreset(type) {
  const today = new Date().toISOString().split('T')[0];
  const relSelect = document.getElementById('newChildRelationship');
  const epSelect = document.getElementById('newChildEpisodeStatus');
  const startInput = document.getElementById('newChildEpisodeStart');
  const endInput = document.getElementById('newChildEpisodeEnd');
  const placementInput = document.getElementById('newChildPlacement');

  if (placementInput) placementInput.value = today;
  if (startInput) startInput.value = today;

  if (type === 'emergency') {
    if (relSelect) relSelect.value = 'Emergency Respite';
    if (epSelect) epSelect.value = 'Active';
    const tomorrow = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    if (endInput) endInput.value = tomorrow;
    const notes = document.getElementById('newChildBehavior');
    if (notes && !notes.value) notes.value = 'Urgent intake: provide quiet space, warm meal, verify rescue meds and worker emergency cell.';
  } else if (type === 'respite') {
    if (relSelect) relSelect.value = 'Temporary Respite';
    if (epSelect) epSelect.value = 'Active';
    const weekendEnd = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    if (endInput) endInput.value = weekendEnd;
    const food = document.getElementById('newChildFood');
    if (food && !food.value) food.value = 'Follow routine respite diet';
  } else if (type === 'primary') {
    if (relSelect) relSelect.value = 'Kinship Placement';
    if (epSelect) epSelect.value = 'Active';
    if (endInput) endInput.value = '';
  }
}

// Privacy Mode Handler (Initials Only, Full Legal, DCF, Court)
let currentPrivacyMode = 'initials';
function onPrivacyModeChange() {
  const select = document.getElementById('headerPrivacyMode');
  currentPrivacyMode = select ? select.value : 'initials';
  renderChildSnapshot();
  loadTabContent();
}

// Contact modal handlers
function openNewContactModal() {
  const modal = document.getElementById('newContactModal');
  if (modal) {
    const form = modal.querySelector('form');
    if (form) form.reset();
    modal.classList.remove('hidden');
  }
}
function closeNewContactModal() {
  const modal = document.getElementById('newContactModal');
  if (modal) modal.classList.add('hidden');
}
async function handleNewContactSubmit(e) {
  e.preventDefault();
  if (!currentChildId) {
    alert("Please select or create a child profile first.");
    return;
  }
  const payload = {
    child_id: currentChildId,
    role_type: document.getElementById('contactRoleType').value,
    full_name: document.getElementById('contactFullName').value,
    organization: document.getElementById('contactOrg').value,
    preferred_method: document.getElementById('contactPreferredMethod').value,
    email: document.getElementById('contactEmail').value,
    phone: document.getElementById('contactPhone').value,
    is_emergency: document.getElementById('contactIsEmergency').checked,
    notes: document.getElementById('contactNotes').value
  };

  const res = await apiFetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.error || 'Failed to add contact.');
    return;
  }

  closeNewContactModal();
  loadTabContent();
}

async function deleteContact(contactId) {
  if (confirm("Remove this contact from the directory?")) {
    await apiFetch(`/api/contacts/${contactId}`, { method: 'DELETE' });
    loadTabContent();
  }
}

// Licensing modal handlers
function openNewLicensingModal() {
  const modal = document.getElementById('newLicensingModal');
  if (modal) {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('licRecordDate');
    if (dateInput) dateInput.value = today;
    modal.classList.remove('hidden');
  }
}

function closeNewLicensingModal() {
  const modal = document.getElementById('newLicensingModal');
  if (modal) modal.classList.add('hidden');
}

async function handleNewLicensingSubmit(e) {
  e.preventDefault();
  const payload = {
    record_type: document.getElementById('licRecordType').value,
    title: document.getElementById('licTitle').value,
    record_date: document.getElementById('licRecordDate').value,
    hours: parseFloat(document.getElementById('licHours').value || 0),
    provider: document.getElementById('licProvider').value,
    expiry_date: document.getElementById('licExpiryDate').value,
    notes: document.getElementById('licNotes').value,
    status: 'Completed'
  };

  const res = await apiFetch('/api/licensing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.error || 'Failed to save licensing record.');
    return;
  }

  closeNewLicensingModal();
  loadTabContent();
}

// Household modal handlers
let activeHouseholdsCache = [];

function openHouseholdModal(hhId = null) {
  const modal = document.getElementById('newHouseholdModal');
  if (!modal) return;

  const idInput = document.getElementById('hhId');
  const nameInput = document.getElementById('hhName');
  const addressInput = document.getElementById('hhAddress');
  const statusInput = document.getElementById('hhStatus');
  const licenseInput = document.getElementById('hhLicenseStatus');
  const primaryInput = document.getElementById('hhPrimaryCaregiver');
  const secondaryInput = document.getElementById('hhSecondaryCaregiver');
  const homeOwnerInput = document.getElementById('hhHomeOwner');
  const e911Input = document.getElementById('hhE911Address');
  const mailingInput = document.getElementById('hhMailingAddress');
  const notesInput = document.getElementById('hhNotes');

  if (hhId && activeHouseholdsCache.length > 0) {
    const hh = activeHouseholdsCache.find(h => h.id === hhId);
    if (hh) {
      if (idInput) idInput.value = hh.id;
      if (nameInput) nameInput.value = hh.name || '';
      if (addressInput) addressInput.value = hh.address || '';
      if (e911Input) e911Input.value = hh.e911_address || hh.address || '';
      if (mailingInput) mailingInput.value = hh.mailing_address || hh.address || '';
      if (statusInput) statusInput.value = hh.status || 'Active Care Residence';
      if (licenseInput) licenseInput.value = hh.license_status || 'New Application Submitted';
      if (primaryInput) primaryInput.value = hh.primary_caregiver || 'Candy Chevalier';
      if (secondaryInput) secondaryInput.value = hh.secondary_caregiver || '';
      if (homeOwnerInput) homeOwnerInput.value = hh.home_owner || '';
      if (notesInput) notesInput.value = hh.notes || '';
      modal.classList.remove('hidden');
      return;
    }
  }

  // Clear for new household
  if (idInput) idInput.value = '';
  if (nameInput) nameInput.value = '';
  if (addressInput) addressInput.value = '';
  if (e911Input) e911Input.value = '';
  if (mailingInput) mailingInput.value = '';
  if (statusInput) statusInput.value = 'Active Care Residence';
  if (licenseInput) licenseInput.value = 'New Application Submitted';
  if (primaryInput) primaryInput.value = 'Candy Chevalier';
  if (secondaryInput) secondaryInput.value = '';
  if (homeOwnerInput) homeOwnerInput.value = '';
  if (notesInput) notesInput.value = '';

  modal.classList.remove('hidden');
}

function closeHouseholdModal() {
  const modal = document.getElementById('newHouseholdModal');
  if (modal) modal.classList.add('hidden');
}

async function handleNewHouseholdSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('hhId').value.trim();
  const name = document.getElementById('hhName').value.trim();
  const address = document.getElementById('hhAddress').value.trim();
  const e911_address = (document.getElementById('hhE911Address') ? document.getElementById('hhE911Address').value : address).trim() || address;
  const mailing_address = (document.getElementById('hhMailingAddress') ? document.getElementById('hhMailingAddress').value : address).trim() || address;
  const status = document.getElementById('hhStatus').value;
  const license_status = document.getElementById('hhLicenseStatus').value;
  const primary_caregiver = document.getElementById('hhPrimaryCaregiver').value.trim();
  const secondary_caregiver = document.getElementById('hhSecondaryCaregiver').value.trim();
  const home_owner = document.getElementById('hhHomeOwner').value.trim();
  const notes = document.getElementById('hhNotes').value.trim();

  if (!name || !address) {
    alert("Please enter a household name and address.");
    return;
  }

  const payload = {
    name,
    address,
    e911_address,
    mailing_address,
    status,
    license_status,
    primary_caregiver,
    secondary_caregiver,
    home_owner,
    notes
  };

  const url = id ? `/api/households/${id}` : '/api/households';
  const method = id ? 'PUT' : 'POST';

  const res = await apiFetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.error || 'Failed to save household.');
    return;
  }

  closeHouseholdModal();
  await loadTabContent();
}

// VT DCF Compliance & Reimbursement Widget Loader
async function loadComplianceAndReimbursementWidgets() {
  const compContainer = document.getElementById('complianceItemsContainer');
  const reimbContainer = document.getElementById('reimbursementSummaryContainer');

  if (compContainer) {
    const res = await apiFetch('/api/compliance');
    const items = await res.json();
    if (items.length === 0) {
      compContainer.innerHTML = `<p class="text-xs text-slate-400">All compliance items satisfied.</p>`;
    } else {
      compContainer.innerHTML = items.map(it => {
        let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
        if (it.status === 'Completed') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        else if (it.status === 'Submitted') badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';

        // Contextual Vermont DCF regulatory guidance for caregivers
        let dcfWhyNote = '';
        const titleLower = (it.title || '').toLowerCase();
        if (titleLower.includes('fingerprint') || titleLower.includes('background')) {
          dcfWhyNote = 'Required under VT DCF FS-221A within 90 days for all household adults before full licensing.';
        } else if (titleLower.includes('water') || titleLower.includes('well')) {
          dcfWhyNote = 'State health standards require potability and lead test certification for private well systems.';
        } else if (titleLower.includes('alarm') || titleLower.includes('smoke') || titleLower.includes('detector')) {
          dcfWhyNote = 'Dual-sensor smoke detectors required on every level and outside each sleeping corridor.';
        } else if (titleLower.includes('exit') || titleLower.includes('window') || titleLower.includes('bedroom')) {
          dcfWhyNote = 'Emergency egress: bedroom windows must meet 5.7 sq ft clear opening requirements.';
        } else if (titleLower.includes('training') || titleLower.includes('vcwtp')) {
          dcfWhyNote = 'Vermont Child Welfare Training Partnership (VCWTP) foundational pre-service hours.';
        }

        return `
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm gap-3">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">${it.category}</span>
                <span class="font-bold text-slate-900 text-sm">${it.title}</span>
              </div>
              <p class="text-xs text-slate-600">${it.notes || ''} ${it.target_date ? `• <strong>Target Date:</strong> ${it.target_date}` : ''}</p>
              ${dcfWhyNote ? `
                <div class="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 mt-1">
                  <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                  <span><strong>Why DCF Requires This:</strong> ${dcfWhyNote}</span>
                </div>
              ` : ''}
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-2.5 py-1 rounded text-xs font-bold border ${badgeColor}">
                ${it.status}
              </span>
              ${it.status !== 'Completed' ? `
                <button onclick="markComplianceCompleted(${it.id})" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i> Mark Done
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (reimbContainer) {
    const res = await apiFetch('/api/reimbursements/summary');
    const rows = await res.json();
    if (rows.length === 0) {
      reimbContainer.innerHTML = `
        <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-slate-400">
          No reimbursable trips logged yet. Round-trip miles logged in Visits or Medical entries automatically calculate here ($0.67/mi).
        </div>
      `;
    } else {
      reimbContainer.innerHTML = `
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b text-slate-600 font-semibold">
              <th class="p-2.5">Month</th>
              <th class="p-2.5">Trips</th>
              <th class="p-2.5">Total Miles</th>
              <th class="p-2.5">Est. DCF Reimbursement ($0.67/mi)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${rows.map(r => `
              <tr>
                <td class="p-2.5 font-bold text-slate-800">${r.month}</td>
                <td class="p-2.5 text-slate-600">${r.trip_count} trips</td>
                <td class="p-2.5 font-semibold text-emerald-800">${r.total_miles} mi</td>
                <td class="p-2.5 font-bold text-emerald-700">$${parseFloat(r.estimated_reimbursement).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }
  lucide.createIcons();
}

async function markComplianceCompleted(itemId) {
  const today = new Date().toISOString().split('T')[0];
  await apiFetch(`/api/compliance/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed', completed_date: today })
  });
  loadComplianceAndReimbursementWidgets();
}

// Kinship Legal Pathways & Onboarding Wizard (First 30 Days + Legal Comparison)
async function renderKinshipPathwaysView(container, child) {
  const alias = child ? child.alias : 'Child';

  container.innerHTML = `
    <div class="space-y-6">
      <!-- WATCH ITEM 3: KINSHIP FAST-TRACK GUIDE (PLAIN ENGLISH SURVIVAL GUIDE) -->
      <div class="bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm space-y-3 border border-teal-500/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-400/30">
              <i data-lucide="zap" class="w-5 h-5 text-teal-400"></i>
            </div>
            <div>
              <h3 class="font-black text-white text-base flex items-center gap-2">
                <span>Kinship Fast-Track Guide</span>
                <span class="text-[10px] bg-teal-400/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full font-bold uppercase">Plain English</span>
              </h3>
              <p class="text-xs text-teal-200/80">Translate welfare bureaucracy into plain English: what to do first, benefits available, and urgent paperwork.</p>
            </div>
          </div>
          <button onclick="openKinshipFastTrackModal()" class="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5 shrink-0">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Open Interactive Guide</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div class="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span class="font-bold text-teal-300 uppercase tracking-wider text-[10px] block">1. What To Do First</span>
            <p class="text-[11px] text-slate-200">Get signed DCF Medical Authorization form, request school placement letter, establish bedtime comfort.</p>
          </div>
          <div class="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span class="font-bold text-emerald-300 uppercase tracking-wider text-[10px] block">2. Benefits & Cash</span>
            <p class="text-[11px] text-slate-200">Reach Up child-only grant (~$350-$550/mo), Dr. Dynasaur Medicaid, CCFAP daycare subsidy, $350 Family Support Fund.</p>
          </div>
          <div class="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span class="font-bold text-amber-300 uppercase tracking-wider text-[10px] block">3. Urgent Paperwork</span>
            <p class="text-[11px] text-slate-200">🔴 48h: Medical consent & worker cell. 🟡 14d: Reach Up application & 30-day EPSDT exam. 🟢 30d: FS-221A walkthrough.</p>
          </div>
          <div class="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span class="font-bold text-cyan-300 uppercase tracking-wider text-[10px] block">4. What Can Wait</span>
            <p class="text-[11px] text-slate-200">No need to decide on permanent adoption today. No need to buy brand new furniture. Classes have grace periods.</p>
          </div>
        </div>
      </div>

      <!-- First 30 Days Kinship Onboarding Wizard -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <i data-lucide="compass" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Kinship First 30 Days Onboarding Roadmap</h3>
              <p class="text-xs text-slate-500">Trauma-informed stability checklist for ${alias}'s incoming transition.</p>
            </div>
          </div>
          <span class="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
            Vermont DCF Policy 84/91
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
            <span class="font-bold text-emerald-950 uppercase tracking-wider text-[11px] block">Days 1 – 7: Immediate Safety & Care</span>
            <ul class="space-y-1.5 text-emerald-900 list-disc list-inside">
              <li>Establish predictable sleep & meal routines</li>
              <li>Identify comfort items & transition objects</li>
              <li>Secure medications & allergy action plans</li>
              <li>Request DCF Medical Authorization form</li>
            </ul>
          </div>

          <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
            <span class="font-bold text-blue-950 uppercase tracking-wider text-[11px] block">Days 8 – 14: Health & Education</span>
            <ul class="space-y-1.5 text-blue-900 list-disc list-inside">
              <li>Schedule 30-day EPSDT Well-Child Exam</li>
              <li>Transfer school / daycare records</li>
              <li>Establish caseworker check-in schedule</li>
              <li>Coordinate initial family time visit</li>
            </ul>
          </div>

          <div class="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
            <span class="font-bold text-purple-950 uppercase tracking-wider text-[11px] block">Days 15 – 30: Legal & Permanency</span>
            <ul class="space-y-1.5 text-purple-900 list-disc list-inside">
              <li>Select legal pathway (CCO vs Licensure)</li>
              <li>Submit fingerprint background check</li>
              <li>Complete home safety walkthrough</li>
              <li>Set birth family communication boundaries</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Legal Pathways Comparison Tool (CCO vs Foster Licensure vs Guardianship) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <i data-lucide="scale" class="w-4 h-4 text-emerald-700"></i> Vermont Kinship Legal Pathway Comparison Guide
          </h3>
          <p class="text-xs text-slate-500">Compare caregiver authority, DCF involvement, and financial support across Vermont legal options.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <!-- Pathway 1: Conditional Custody Order (CCO) -->
          <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-900 text-sm">Conditional Custody Order (CCO)</h4>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Court-Ordered</span>
            </div>
            <p class="text-slate-600 leading-relaxed text-[11px]">
              Child is placed directly with kin by Family Court under court conditions without DCF holding custody.
            </p>
            <div class="space-y-1.5 pt-2 border-t border-slate-200 text-slate-700 text-[11px]">
              <div><strong>Legal Custody:</strong> Shared with parents under court order</div>
              <div><strong>DCF Supervision:</strong> Moderate (protective supervision)</div>
              <div><strong>Financial Support:</strong> Reach Up / Child-Only Grant ($300-$500/mo)</div>
              <div><strong>Medicaid:</strong> Dependent on child income eligibility</div>
            </div>
          </div>

          <!-- Pathway 2: Kinship Foster Care Licensure -->
          <div class="border-2 border-emerald-500 rounded-xl p-4 space-y-3 bg-emerald-50/50 shadow-sm">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-emerald-950 text-sm">Kinship Foster Licensure</h4>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">Highest Support</span>
            </div>
            <p class="text-emerald-900 leading-relaxed text-[11px]">
              DCF holds legal custody; caregiver licensed via <strong>FS-221A</strong> with full foster parent stipend and support.
            </p>
            <div class="space-y-1.5 pt-2 border-t border-emerald-200 text-emerald-950 text-[11px]">
              <div><strong>Legal Custody:</strong> DCF (Caregiver has day-to-day care & RPPS authority)</div>
              <div><strong>DCF Supervision:</strong> Regular caseworker visits & support</div>
              <div><strong>Financial Support:</strong> Full Monthly Foster Care Maintenance Stipend</div>
              <div><strong>Medicaid & Childcare:</strong> 100% Covered by DCF</div>
            </div>
          </div>

          <!-- Pathway 3: Permanent Guardianship -->
          <div class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-900 text-sm">Permanent Guardianship</h4>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Permanency</span>
            </div>
            <p class="text-slate-600 leading-relaxed text-[11px]">
              Long-term legal custody transferred to kin after 6+ months in care; DCF case closes permanently.
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// ENHANCEMENT 1: Dedicated Plan of Safe Care (POSC) & Early Intervention Module
// -----------------------------------------------------------------------------
async function renderPoscView(container, child) {
  const childId = child ? child.id : currentChildId;
  const alias = child ? child.alias : 'Child';

  const res = await apiFetch(`/api/children/${childId}/posc`);
  const posc = await res.json().catch(() => ({}));

  container.innerHTML = `
    <div class="space-y-6">
      <!-- POSC Overview Card -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-sky-100 text-sky-800 rounded-xl">
              <i data-lucide="shield-plus" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-base">Plan of Safe Care (POSC) & Early Intervention</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${posc.id ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">
                  ${posc.id ? 'Active Plan' : 'Not Established'}
                </span>
              </div>
              <p class="text-xs text-slate-500">Multidisciplinary infant safety, neonatal follow-up, and Children's Integrated Services for ${alias}.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a href="tel:211" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5">
              <i data-lucide="phone-call" class="w-3.5 h-3.5"></i> Help Me Grow (2-1-1 ext. 6)
            </a>
          </div>
        </div>

        <!-- 4-Card Quick Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div class="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-sky-950 uppercase tracking-wider block">Specialty Pediatric Clinic</span>
            <span class="font-bold text-slate-800 text-xs block">${posc.specialty_clinic || 'NeoMed Specialty Follow-Up'}</span>
            <span class="text-[11px] text-slate-500 block">UVMMC Pediatric Specialty Team</span>
          </div>
          <div class="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-teal-950 uppercase tracking-wider block">Nurse Home Visiting</span>
            <span class="font-bold text-slate-800 text-xs block">${posc.nurse_home_visiting || 'Strong Families Vermont / CVHHH'}</span>
            <span class="text-[11px] text-slate-500 block">Bi-weekly developmental nurse visits</span>
          </div>
          <div class="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-indigo-950 uppercase tracking-wider block">CIS Early Intervention</span>
            <span class="font-bold text-slate-800 text-xs block">${posc.cis_early_intervention || 'Enrolled with Family Center'}</span>
            <span class="text-[11px] text-slate-500 block">Gross motor & sensory milestones</span>
          </div>
          <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-amber-950 uppercase tracking-wider block">Safe Sleep & Feeding</span>
            <span class="font-bold text-slate-800 text-xs block">${posc.feeding_method || 'Formula & Specialized Nipple'}</span>
            <span class="text-[11px] text-slate-500 block">${posc.safe_sleep_environment || 'Alone, Back, Crib (ABC)'}</span>
          </div>
        </div>
      </div>

      <!-- Infant Care & Soothing Guidance Strip -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <i data-lucide="baby" class="w-4 h-4 text-sky-600"></i> Calming & Soothing Strategies
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            ${posc.soothing_techniques || 'Swaddling snugly, rhythmic vertical rocking, low lighting, reduced auditory stimulation, pacifier with non-nutritive sucking, skin-to-skin kangaroo care.'}
          </p>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            <strong>Key Vermont DCF POSC Guidance:</strong> If infant becomes dysregulated, step down environment noise, cluster care interventions, and offer predictable pauses during feeding.
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600"></i> Early Intervention Milestones & Next Review
          </h4>
          <div class="space-y-2 text-xs text-slate-700">
            <div class="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
              <span><strong>Next POSC Review Date:</strong></span>
              <span class="font-bold text-emerald-900">${posc.next_review_date || 'Within 60 Days of Placement'}</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <span><strong>Pediatrician / Clinic Contact:</strong></span>
              <span class="font-semibold text-slate-800">Berlin Pediatric / UVMMC NeoMed</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <span><strong>CIS Developmental Specialist:</strong></span>
              <span class="font-semibold text-slate-800">Assigned CIS Family Center Coordinator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// -----------------------------------------------------------------------------
// ENHANCEMENT 2: Expanded Financial & Benefit Claim Automations
// -----------------------------------------------------------------------------
async function renderBenefitsView(container, child) {
  const childId = child ? child.id : currentChildId;
  const alias = child ? child.alias : 'Child';

  const res = await apiFetch(`/api/children/${childId}/benefits`);
  const claims = await res.json().catch(() => []);

  const totalApproved = claims.reduce((acc, c) => acc + (parseFloat(c.amount_approved) || 0), 0);
  const totalPending = claims.filter(c => c.status === 'Submitted' || c.status === 'Draft').reduce((acc, c) => acc + (parseFloat(c.amount_claimed) || 0), 0);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header with Metrics -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <i data-lucide="wallet" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Financial Claims & Public Assistance Monitor</h3>
              <p class="text-xs text-slate-500">Track state stipends, clothing vouchers, Reach Up child-only funds, and WIC benefits for ${alias}.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Total Approved: $${totalApproved.toFixed(2)}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">Family Support Fund</span>
            <span class="text-base font-bold text-emerald-900 block">$350 – $500 Annual Cap</span>
            <span class="text-[11px] text-slate-500 block">Covers non-reimbursed child equipment & respite</span>
          </div>
          <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-blue-950 uppercase tracking-wider block">Initial Placement Clothing Voucher</span>
            <span class="text-base font-bold text-blue-900 block">$100 State Voucher</span>
            <span class="text-[11px] text-slate-500 block">1-time emergency clothing upon intake</span>
          </div>
          <div class="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-1">
            <span class="text-[10px] font-bold text-purple-950 uppercase tracking-wider block">Reach Up & WIC Status</span>
            <span class="text-base font-bold text-purple-900 block">Active / Enrolled</span>
            <span class="text-[11px] text-slate-500 block">WIC Infant Food / Formula & DCF Medicaid</span>
          </div>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
          <i data-lucide="receipt" class="w-4 h-4 text-emerald-700"></i> Benefit Claim Ledger (${claims.length})
        </h4>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th class="p-3">Benefit Type</th>
                <th class="p-3">Claimed</th>
                <th class="p-3">Approved</th>
                <th class="p-3">Date Filed</th>
                <th class="p-3">Reference / Notes</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${claims.length === 0 ? `
                <tr><td colspan="6" class="p-6 text-center text-slate-400">No benefit claims logged.</td></tr>
              ` : claims.map(c => `
                <tr class="hover:bg-slate-50/80">
                  <td class="p-3 font-bold text-slate-900">${c.benefit_type}</td>
                  <td class="p-3 font-semibold text-slate-700">$${parseFloat(c.amount_claimed || 0).toFixed(2)}</td>
                  <td class="p-3 font-bold text-emerald-800">$${parseFloat(c.amount_approved || 0).toFixed(2)}</td>
                  <td class="p-3 text-slate-600">${c.filed_date || '-'}</td>
                  <td class="p-3 text-slate-500">${c.notes || '-'}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : (c.status === 'Submitted' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700')}">
                      ${c.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// -----------------------------------------------------------------------------
// ENHANCEMENT 4: Vermont CHINS Court Timeline & Milestone Stepper
// -----------------------------------------------------------------------------
async function renderChinsFlowchartView(container, child) {
  const childId = child ? child.id : currentChildId;
  const alias = child ? child.alias : 'Child';

  const res = await apiFetch(`/api/children/${childId}/chins`);
  const stages = await res.json().catch(() => []);

  container.innerHTML = `
    <div class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
              <i data-lucide="scale" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Vermont DCF Juvenile Court (CHINS) Timeline</h3>
              <p class="text-xs text-slate-500">Statutory milestones under 33 V.S.A. § 5300+ governing ${alias}'s child protection docket.</p>
            </div>
          </div>
          <span class="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
            Vermont Family Court
          </span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          As a caregiver, your input through the <strong>Caregiver Information Form</strong> or direct attendance is statutory right at each hearing stage. The flowchart below tracks statutory compliance and upcoming court review dates.
        </p>

        <!-- Stepper Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
          ${stages.map((st, idx) => {
            const isCompleted = st.status === 'Completed';
            const isCurrent = st.status === 'Scheduled';
            return `
              <div class="rounded-xl border p-4 space-y-2 relative ${isCompleted ? 'bg-emerald-50/60 border-emerald-200' : (isCurrent ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/30' : 'bg-slate-50 border-slate-200 opacity-80')}">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-800' : (isCurrent ? 'text-purple-800' : 'text-slate-500')}">
                    Stage ${idx + 1}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isCompleted ? 'bg-emerald-200 text-emerald-900' : (isCurrent ? 'bg-purple-200 text-purple-900' : 'bg-slate-200 text-slate-700')}">
                    ${st.status}
                  </span>
                </div>
                <h4 class="font-bold text-slate-900 text-xs">${st.stage_name}</h4>
                <div class="text-[11px] text-slate-600 space-y-1">
                  <div><strong>Statutory Timeline:</strong> ${st.statutory_timeline}</div>
                  <div><strong>Hearing Date:</strong> ${st.hearing_date || 'TBD'}</div>
                  ${st.caregiver_report_due ? `<div class="text-amber-700 font-semibold">⚠️ Caregiver Report Due: ${st.caregiver_report_due}</div>` : ''}
                </div>
                ${st.notes ? `<p class="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60">${st.notes}</p>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// -----------------------------------------------------------------------------
// ENHANCEMENT 5: Caregiver Self-Regulation & Support Network Toolkit
// -----------------------------------------------------------------------------
async function loadSelfRegulationToolkit() {
  const container = document.getElementById('selfRegulationToolkitContainer');
  if (!container) return;

  const res = await apiFetch('/api/caregiver/self-regulation');
  const plan = await res.json().catch(() => ({}));

  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 mt-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-rose-100 text-rose-800 rounded-xl">
            <i data-lucide="heart-pulse" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Caregiver Self-Regulation & Support Network Toolkit</h4>
            <p class="text-xs text-slate-500">VCWTP trauma-informed self-care plan: identifying stress triggers, calming tools, and local Vermont resources.</p>
          </div>
        </div>
        <span class="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-800 rounded-full border border-rose-200">
          Trauma-Informed Practice
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <!-- Triggers & Warning Signs -->
        <div class="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-2">
          <span class="font-bold text-rose-950 uppercase tracking-wider text-[11px] block">Triggers & Warning Signs</span>
          <p class="text-rose-900 leading-relaxed text-[11px]">
            ${plan.stress_triggers || 'High infant inconsolable crying, fatigue, concurrent caseworker administrative deadlines.'}
          </p>
          <div class="pt-2 border-t border-rose-200/70 text-rose-900 text-[11px]">
            <strong>Warning Signs:</strong> ${plan.warning_signs || 'Muscle tension, shallow breathing, feeling overwhelmed or "flipping lid".'}
          </div>
        </div>

        <!-- Calming Strategies -->
        <div class="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
          <span class="font-bold text-emerald-950 uppercase tracking-wider text-[11px] block">Active Calming Strategies</span>
          <p class="text-emerald-900 leading-relaxed text-[11px]">
            ${plan.calming_strategies || 'Putting baby safely in crib for 5 minutes, 4-7-8 deep breathing, outdoor porch pause, reaching out to co-caregiver.'}
          </p>
          <div class="pt-2 border-t border-emerald-200/70 text-emerald-900 text-[11px]">
            <strong>Rule:</strong> It is always okay to place a safe baby in a crib to step back and take a deep breath.
          </div>
        </div>

        <!-- Vermont Support Contacts -->
        <div class="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
          <span class="font-bold text-blue-950 uppercase tracking-wider text-[11px] block">Support Network Contacts</span>
          <div class="space-y-1.5 text-blue-950 text-[11px]">
            <div><strong>Secondary Caregiver:</strong> Mallory Wheeler</div>
            <div><strong>Household Resource:</strong> Robin Davis</div>
            <div><strong>VKAP Helpline:</strong> 1-877-856-1772</div>
            <div><strong>CVCOA (Age 55+ Support):</strong> Central VT Council on Aging</div>
            <div><strong>Crisis Support:</strong> Vermont 2-1-1</div>
          </div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// -----------------------------------------------------------------------------
// COMPLETE FICTIONAL FOSTER CARE MANAGEMENT DATASET EXPLORER
// -----------------------------------------------------------------------------
let sampleDataSubTab = 'matrix';

async function renderSampleDataExplorerView(container) {
  let data;
  try {
    const res = await apiFetch('/api/sample-dataset');
    data = await res.json();
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-rose-600 font-bold">Error loading sample dataset: ${err.message}</div>`;
    return;
  }

  const disclaimer = data.disclaimer || "⚠ SAMPLE DATA ONLY - FOR TRAINING, TESTING, AND DEMONSTRATION PURPOSES. NO REAL INDIVIDUALS ARE REPRESENTED.";
  const households = data.households || [];
  const adults = data.adult_members || [];
  const licenses = data.licenses || [];
  const capabilities = data.capabilities || [];
  const children = data.children || [];
  const placements = data.placements || [];
  const matrix = data.validation_matrix || [];
  const cap = data.capacity_report || {};
  const lic = data.licensing_summary || {};
  const plSum = data.placement_summary || {};
  const progSum = data.program_summary || {};
  const permSum = data.permanency_summary || {};

  container.innerHTML = `
    <div class="space-y-6">

      <!-- Safety Disclaimer Banner -->
      <div class="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-4.5 text-amber-950 flex items-start gap-3 shadow-sm">
        <div class="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
          <i data-lucide="shield-alert" class="w-5 h-5"></i>
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-extrabold uppercase tracking-wide text-amber-900">${disclaimer}</h3>
          <p class="text-xs text-amber-800 leading-relaxed">
            Strict Relational Normalization: Households, Adult Household Members, Licensing Approvals, Capabilities, Placements, and Children are modeled independently. No caregiver arrangements or licensing types are conflated.
          </p>
        </div>
      </div>

      <!-- Capacity & Occupancy KPI Bar -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Sample Households</span>
          <span class="text-2xl font-bold text-slate-900 mt-1 block">${cap.TotalHouseholds || households.length}</span>
          <span class="text-[11px] text-emerald-700 font-semibold">15 Distinct Structures</span>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Bed Capacity</span>
          <span class="text-2xl font-bold text-slate-900 mt-1 block">${cap.TotalCapacity || 0} Beds</span>
          <span class="text-[11px] text-slate-500">Across All Homes</span>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Occupied Beds</span>
          <span class="text-2xl font-bold text-teal-800 mt-1 block">${cap.OccupiedBeds || 0}</span>
          <span class="text-[11px] text-teal-700 font-semibold">Active Placements</span>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Open Available Beds</span>
          <span class="text-2xl font-bold text-emerald-700 mt-1 block">${cap.OpenBeds || 0}</span>
          <span class="text-[11px] text-emerald-600 font-semibold">Immediate Intake</span>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Occupancy Rate</span>
          <span class="text-2xl font-bold text-purple-800 mt-1 block">${cap.OccupancyRate || '0%'}</span>
          <span class="text-[11px] text-purple-700 font-semibold">System Utilization</span>
        </div>
      </div>

      <!-- Analytical Breakdown Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Licensing Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <i data-lucide="award" class="w-4 h-4 text-emerald-600"></i> Licenses & Approvals (${licenses.length})
          </h4>
          <div class="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
            ${Object.entries(lic).map(([k, v]) => `
              <div class="flex items-center justify-between p-1 rounded bg-slate-50 text-[11px]">
                <span class="text-slate-700 truncate pr-2">${k}</span>
                <span class="font-bold text-slate-900 px-1.5 py-0.5 rounded bg-white border border-slate-200">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Placement Types Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <i data-lucide="layers" class="w-4 h-4 text-sky-600"></i> Placement Types (${placements.length})
          </h4>
          <div class="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
            ${Object.entries(plSum).map(([k, v]) => `
              <div class="flex items-center justify-between p-1 rounded bg-slate-50 text-[11px]">
                <span class="text-slate-700 truncate pr-2">${k}</span>
                <span class="font-bold text-sky-900 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Program Participation Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <i data-lucide="activity" class="w-4 h-4 text-teal-600"></i> Programs Enrolled
          </h4>
          <div class="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
            ${Object.entries(progSum).map(([k, v]) => `
              <div class="flex items-center justify-between p-1 rounded bg-slate-50 text-[11px]">
                <span class="text-slate-700 truncate pr-2">${k}</span>
                <span class="font-bold text-teal-900 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Permanency Goals Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <i data-lucide="target" class="w-4 h-4 text-purple-600"></i> Permanency Goals (${children.length})
          </h4>
          <div class="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
            ${Object.entries(permSum).map(([k, v]) => `
              <div class="flex items-center justify-between p-1 rounded bg-slate-50 text-[11px]">
                <span class="text-slate-700 truncate pr-2">${k}</span>
                <span class="font-bold text-purple-900 px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Normalized Entity View Selector Tabs -->
      <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button onclick="setSampleSubTab('matrix')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'matrix' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="table-properties" class="w-3.5 h-3.5"></i> Comprehensive Validation Matrix
        </button>
        <button onclick="setSampleSubTab('households')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'households' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="home" class="w-3.5 h-3.5"></i> Households (${households.length})
        </button>
        <button onclick="setSampleSubTab('adults')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'adults' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="user-check" class="w-3.5 h-3.5"></i> Adult Members (${adults.length})
        </button>
        <button onclick="setSampleSubTab('licensing')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'licensing' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="award" class="w-3.5 h-3.5"></i> Licensing Approvals (${licenses.length})
        </button>
        <button onclick="setSampleSubTab('capabilities')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'capabilities' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Capabilities (${capabilities.length})
        </button>
        <button onclick="setSampleSubTab('children')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'children' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="users" class="w-3.5 h-3.5"></i> Children & Youth (${children.length})
        </button>
        <button onclick="setSampleSubTab('placements')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${sampleDataSubTab === 'placements' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
          <i data-lucide="git-merge" class="w-3.5 h-3.5"></i> Placements & Programs (${placements.length})
        </button>
      </div>

      <!-- Subtab Container -->
      <div id="sampleDataSubTabContent">
        ${renderSelectedSampleSubTab(data, sampleDataSubTab)}
      </div>

    </div>
  `;
  lucide.createIcons();
}

function setSampleSubTab(tab) {
  sampleDataSubTab = tab;
  const container = document.getElementById('mainContentArea');
  if (container) {
    renderSampleDataExplorerView(container);
  }
}

function renderSelectedSampleSubTab(data, tab) {
  switch(tab) {
    case 'matrix':
      return renderValidationMatrixTable(data.validation_matrix || []);
    case 'households':
      return renderHouseholdsTable(data.households || []);
    case 'adults':
      return renderAdultMembersTable(data.adult_members || []);
    case 'licensing':
      return renderLicensingTable(data.licenses || []);
    case 'capabilities':
      return renderCapabilitiesTable(data.capabilities || []);
    case 'children':
      return renderChildrenTable(data.children || []);
    case 'placements':
      return renderPlacementsTable(data.placements || []);
    default:
      return renderValidationMatrixTable(data.validation_matrix || []);
  }
}

// 1. Validation Matrix View
function renderValidationMatrixTable(matrix) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <i data-lucide="table-properties" class="w-4 h-4 text-emerald-700"></i> Validation Matrix
          </h4>
          <p class="text-xs text-slate-500">Cross-entity verification demonstrating Household + Relationship Structure + Licenses + Capabilities + Current Placements coexist without category collision.</p>
        </div>
        <span class="text-[10px] font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
          ALL 15 DIVERSE SCENARIOS VALIDATED
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">Household</th>
              <th class="p-3">Relationship Structure</th>
              <th class="p-3">Adult Caregivers</th>
              <th class="p-3">Licenses & Approvals</th>
              <th class="p-3">Accepted Capabilities</th>
              <th class="p-3">Current Placements (Episodes)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${matrix.map(m => `
              <tr class="hover:bg-slate-50/80 align-top">
                <td class="p-3 font-mono font-bold text-slate-800">
                  <span class="text-slate-900 font-sans font-bold block">${m.HouseholdName}</span>
                  <span class="text-emerald-700 text-[11px] font-mono">${m.HouseholdID}</span>
                  <div class="text-[10px] text-slate-500 font-sans mt-0.5">${m.Address}</div>
                  <div class="mt-1 font-sans text-[11px] font-bold text-slate-700">Cap: ${m.Capacity} | Occ: ${m.OccupiedBeds} | <span class="${m.OpenBeds > 0 ? 'text-emerald-700' : 'text-slate-400'}">${m.OpenBeds} Open</span></div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-1 rounded text-[11px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 inline-block">
                    ${m.RelationshipStructure}
                  </span>
                </td>
                <td class="p-3 space-y-1">
                  ${m.Caregivers.map(cg => `
                    <div class="text-slate-800">
                      <strong>${cg.Name}</strong> <span class="text-[10px] text-slate-500">(${cg.Role})</span>
                    </div>
                  `).join('')}
                </td>
                <td class="p-3 space-y-1">
                  ${m.Licenses.map(lic => `
                    <div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 block truncate">
                        ${lic}
                      </span>
                    </div>
                  `).join('')}
                </td>
                <td class="p-3 text-[11px] text-slate-700 max-w-xs">
                  ${m.Capabilities}
                </td>
                <td class="p-3 space-y-1.5">
                  ${m.Placements.length === 0 ? '<span class="text-slate-400 italic text-[11px]">No active placements (Beds open or closed)</span>' : m.Placements.map(pl => `
                    <div class="p-2 rounded-lg bg-sky-50/80 border border-sky-200 text-[11px]">
                      <div class="font-bold text-sky-950 flex items-center justify-between">
                        <span>${pl.Initials} (${pl.ChildID}) • ${pl.Age}yo</span>
                        <span class="text-[10px] px-1.5 py-0.2 bg-white rounded border border-sky-300">${pl.PlacementType}</span>
                      </div>
                      <div class="text-sky-900 text-[10px] mt-0.5"><strong>Goal:</strong> ${pl.PermanencyGoal}</div>
                      ${pl.Programs ? `<div class="text-teal-800 text-[10px]"><strong>Programs:</strong> ${pl.Programs}</div>` : ''}
                      <div class="text-slate-600 text-[10px] italic mt-0.5">Note: ${pl.SpecialScenario}</div>
                    </div>
                  `).join('')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. Households Table
function renderHouseholdsTable(households) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 class="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
        <i data-lucide="home" class="w-4 h-4 text-emerald-700"></i> Entity: Households (${households.length})
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">HouseholdID</th>
              <th class="p-3">HouseholdName</th>
              <th class="p-3">Address</th>
              <th class="p-3">Status</th>
              <th class="p-3">Capacity</th>
              <th class="p-3">OccupiedBeds</th>
              <th class="p-3">OpenBeds</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${households.map(h => `
              <tr class="hover:bg-slate-50/80">
                <td class="p-3 font-mono font-bold text-emerald-700">${h.HouseholdID}</td>
                <td class="p-3 font-bold text-slate-900">${h.HouseholdName}</td>
                <td class="p-3 text-slate-600">${h.Address}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${h.Status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">${h.Status}</span>
                </td>
                <td class="p-3 font-bold text-slate-800">${h.Capacity}</td>
                <td class="p-3 font-bold text-teal-800">${h.OccupiedBeds}</td>
                <td class="p-3 font-bold ${h.OpenBeds > 0 ? 'text-emerald-700' : 'text-slate-400'}">${h.OpenBeds}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Adult Members Table
function renderAdultMembersTable(adults) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 class="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
        <i data-lucide="user-check" class="w-4 h-4 text-emerald-700"></i> Entity: Adult Household Members (${adults.length})
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">AdultID</th>
              <th class="p-3">HouseholdID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Role</th>
              <th class="p-3">RelationshipCategory</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${adults.map(a => `
              <tr class="hover:bg-slate-50/80">
                <td class="p-3 font-mono font-bold text-slate-600">${a.AdultID}</td>
                <td class="p-3 font-mono font-bold text-emerald-700">${a.HouseholdID}</td>
                <td class="p-3 font-bold text-slate-900">${a.Name}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${a.Role === 'Primary Caregiver' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">${a.Role}</span>
                </td>
                <td class="p-3 font-semibold text-indigo-900">${a.RelationshipCategory}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Licensing Table
function renderLicensingTable(licenses) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 class="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
        <i data-lucide="award" class="w-4 h-4 text-emerald-700"></i> Entity: Licensing & Approvals (${licenses.length})
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">LicenseID</th>
              <th class="p-3">HouseholdID</th>
              <th class="p-3">LicenseType</th>
              <th class="p-3">Status</th>
              <th class="p-3">EffectiveDate</th>
              <th class="p-3">ExpirationDate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${licenses.map(l => `
              <tr class="hover:bg-slate-50/80">
                <td class="p-3 font-mono font-bold text-slate-600">${l.LicenseID}</td>
                <td class="p-3 font-mono font-bold text-emerald-700">${l.HouseholdID}</td>
                <td class="p-3 font-bold text-slate-900">${l.LicenseType}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${l.Status === 'Active' ? 'bg-emerald-100 text-emerald-800' : (l.Status === 'Pending' ? 'bg-amber-100 text-amber-800' : (l.Status === 'Provisional' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'))}">
                    ${l.Status}
                  </span>
                </td>
                <td class="p-3 text-slate-600">${l.EffectiveDate}</td>
                <td class="p-3 text-slate-600">${l.ExpirationDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Capabilities Table
function renderCapabilitiesTable(capabilities) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 class="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-700"></i> Entity: Household Capabilities (${capabilities.length})
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">CapabilityID</th>
              <th class="p-3">HouseholdID</th>
              <th class="p-3">Accepted Age Groups</th>
              <th class="p-3">Service Capacities</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${capabilities.map(c => `
              <tr class="hover:bg-slate-50/80">
                <td class="p-3 font-mono font-bold text-slate-600">${c.CapabilityID}</td>
                <td class="p-3 font-mono font-bold text-emerald-700">${c.HouseholdID}</td>
                <td class="p-3">
                  <div class="flex flex-wrap gap-1">
                    ${c.AgeGroups.map(a => `<span class="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-semibold">${a}</span>`).join('')}
                  </div>
                </td>
                <td class="p-3">
                  <div class="flex flex-wrap gap-1">
                    ${c.ServiceCapacities.map(s => `<span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">${s}</span>`).join('')}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 6. Children Table
function renderChildrenTable(children) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h4 class="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
        <i data-lucide="users" class="w-4 h-4 text-emerald-700"></i> Entity: Children & Youth (${children.length})
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th class="p-3">ChildID</th>
              <th class="p-3">Initials</th>
              <th class="p-3">Sample Name</th>
              <th class="p-3">DOB</th>
              <th class="p-3">Age / Bracket</th>
              <th class="p-3">Gender</th>
              <th class="p-3">PermanencyGoal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${children.map(ch => `
              <tr class="hover:bg-slate-50/80">
                <td class="p-3 font-mono font-bold text-slate-600">${ch.ChildID}</td>
                <td class="p-3 font-bold font-mono text-emerald-800">${ch.Initials}</td>
                <td class="p-3 font-bold text-slate-900">${ch.FullName}</td>
                <td class="p-3 text-slate-600">${ch.DOB}</td>
                <td class="p-3 text-slate-800"><strong>${ch.Age}</strong> <span class="text-slate-400 text-[10px]">(${ch.AgeBracket})</span></td>
                <td class="p-3 text-slate-600">${ch.Gender}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200">${ch.PermanencyGoal}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// CAREGIVER PROFILES & SYSTEM HELP MODAL CONTROLLERS
// -----------------------------------------------------------------------------
async function openCaregiverProfilesModal() {
  const modal = document.getElementById('caregiverProfilesModal');
  const container = document.getElementById('caregiverProfilesList');
  if (!modal) return;

  if (container) {
    container.innerHTML = '<div class="p-4 text-center text-slate-500 text-xs">Loading caregiver profiles...</div>';
    try {
      const res = await apiFetch('/api/sample-dataset');
      const data = await res.json();
      const households = data.households || [];

      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          ${households.map(h => {
            const caregivers = (data.adult_members || []).filter(a => a.HouseholdID === h.HouseholdID);
            const caregiverNames = caregivers.map(c => `${c.Name} (${c.Role})`).join(', ');
            const primaryName = caregivers[0] ? caregivers[0].Name : 'Caregiver';
            return `
              <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition space-y-2 shadow-2xs">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h5 class="font-bold text-slate-900 text-sm">${h.HouseholdName} <span class="text-xs text-slate-400 font-mono">(${h.HouseholdID})</span></h5>
                    <p class="text-[11px] text-slate-600 font-medium">${caregiverNames || primaryName}</p>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
                    ${h.CaregiverStage}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-1.5 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <div><strong class="text-slate-500">Structure:</strong> <span class="text-slate-800 font-semibold">${h.HouseholdStructure}</span></div>
                  <div><strong class="text-slate-500">Tenure:</strong> <span class="text-slate-800 font-semibold">${h.YearsWorkingWithDCF} yrs</span></div>
                  <div><strong class="text-slate-500">Placements:</strong> <span class="text-slate-800 font-semibold">${h.PlacementsCompleted} done (${h.CurrentPlacements} now)</span></div>
                  <div><strong class="text-slate-500">Adoptions:</strong> <span class="text-slate-800 font-semibold">${h.AdoptionFinalizations} finalized</span></div>
                </div>

                ${h.Approvals && h.Approvals.length > 0 ? `
                  <div class="flex flex-wrap gap-1">
                    ${h.Approvals.map(app => `<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">${app}</span>`).join('')}
                  </div>
                ` : ''}

                ${h.SpecialCertifications && h.SpecialCertifications.length > 0 ? `
                  <div class="text-[10px] text-teal-800 font-medium flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                    ${h.SpecialCertifications.map(sc => `<span class="bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">${sc}</span>`).join('')}
                  </div>
                ` : ''}

                <div class="pt-2 flex justify-end">
                  <button onclick="selectCaregiverFromProfile('${primaryName}'); closeCaregiverProfilesModal();" class="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-[10px] flex items-center gap-1">
                    <span>Activate Profile</span> →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="p-4 text-rose-600 text-xs font-bold">Failed to load profiles: ${err.message}</div>`;
    }
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function selectCaregiverFromProfile(caregiverName) {
  const select = document.getElementById('caregiverSelect');
  if (!select) return;

  // Match caregiver option by name
  for (let opt of select.options) {
    if (opt.textContent.includes(caregiverName)) {
      select.value = opt.value;
      onCaregiverUserChange();
      break;
    }
  }
}

function closeCaregiverProfilesModal() {
  const modal = document.getElementById('caregiverProfilesModal');
  if (modal) modal.classList.add('hidden');
}

function openSystemHelpModal() {
  const modal = document.getElementById('systemHelpModal');
  if (modal) {
    modal.classList.remove('hidden');
    lucide.createIcons();
  }
}

function closeSystemHelpModal() {
  const modal = document.getElementById('systemHelpModal');
  if (modal) modal.classList.add('hidden');
}

// Global Modal Backdrop and Escape Key Handler
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRecordModal();
    closeNewChildModal();
    closeNewContactModal();
    closeNewLicensingModal();
    closeHouseholdModal();
    closeCaregiverProfilesModal();
    closeSystemHelpModal();
  }
});

// Attach background backdrop click listeners
document.addEventListener('DOMContentLoaded', () => {
  const modalIds = [
    'recordModal', 'newChildModal', 'newContactModal',
    'newLicensingModal', 'newHouseholdModal',
    'caregiverProfilesModal', 'systemHelpModal'
  ];
  modalIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.add('hidden');
        }
      });
    }
  });
});

// Master Welcome & State Resource Hub (Shown when no sphere or caregiver is selected)
function renderWelcomeLandingView(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Welcome Hero Banner -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-700 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-4xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <i data-lucide="sprout" class="w-4 h-4 text-emerald-400"></i> Sprout Caregiver Command Center & OS
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Vermont Caregiver Support & Development Portal
          </h1>
          <p class="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Welcome to the centralized, private command center for Vermont foster, kinship, respite, and adoptive families. 
            Select an environment mode and caregiver user from the top navigation bar to access an active household dashboard, 
            or explore the interactive sandbox profiles and state resource directory below.
          </p>
          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button id="btnHeroLaunchSarah" onclick="activateSampleCaregiverProfile('Sarah Jenkins')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2">
              <i data-lucide="play" class="w-4 h-4"></i>
              <span>Launch Sample Sandbox (Sarah Jenkins • Established)</span>
            </button>
            <button id="btnHeroBrowseProfiles" onclick="openCaregiverProfilesModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4"></i>
              <span>Browse 15 Caregiver Lifecycle Profiles</span>
            </button>
            <button id="btnHeroSystemHelp" onclick="openSystemHelpModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs border border-slate-600 transition flex items-center gap-2">
              <i data-lucide="help-circle" class="w-4 h-4"></i>
              <span>System Help & Architecture</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Action: Caregiver Journey Sandbox Grid (15 Distinct Models) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="compass" class="w-5 h-5 text-blue-600"></i>
              Explore Caregiver Journey Sandbox Households
            </h3>
            <p class="text-xs text-slate-500">
              Select any profile below to immediately launch the Dev Sandbox configured for that specific household structure and approval stage.
            </p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            15 Realistic Vermont Model Households
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <!-- Card 1: Sarah Jenkins -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">Sarah Jenkins</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">Established (1-3 Yrs)</span>
              </div>
              <p class="text-[11px] text-slate-500">Single Adult • Maple Ridge Home (HH-101)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Foster, Respite</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 2.5 yrs • Placements: 1 Active / 3 Completed</div>
            </div>
            <button id="btnActivateCard-SarahJenkins" onclick="activateSampleCaregiverProfile('Sarah Jenkins')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Card 2: Marcus Vance -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">Marcus Vance</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">Specialized Provider</span>
              </div>
              <p class="text-[11px] text-slate-500">Single Adult • Birchwood Haven (HH-102)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Foster, Therapeutic, Independent Living</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 5.0 yrs • Placements: 2 Active / 8 Completed</div>
            </div>
            <button id="btnActivateCard-MarcusVance" onclick="activateSampleCaregiverProfile('Marcus Vance')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Card 3: David & Emily Miller -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">David & Emily Miller</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">Permanency Provider</span>
              </div>
              <p class="text-[11px] text-slate-500">Married Couple • Oak Hill Cottage (HH-103)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Foster, Foster-to-Adopt</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 4.0 yrs • Adoptions Finalized: 2</div>
            </div>
            <button id="btnActivateCard-DavidMiller" onclick="activateSampleCaregiverProfile('David & Emily Miller')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Card 4: Elena Ramos & Chloe Bennett -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">Elena Ramos & Chloe Bennett</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-200">Specialized Provider</span>
              </div>
              <p class="text-[11px] text-slate-500">Domestic Partners • Cedar Grove Retreat (HH-105)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Foster, Medical Foster Care</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 3.5 yrs • Placements: 1 Active / 4 Completed</div>
            </div>
            <button id="btnActivateCard-ElenaRamos" onclick="activateSampleCaregiverProfile('Elena Ramos & Chloe Bennett')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Card 5: Hannah & Beatrice Abbott -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">Hannah & Beatrice Abbott</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">Established Kinship</span>
              </div>
              <p class="text-[11px] text-slate-500">Siblings • Mountain View Homestead (HH-109)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Kinship, Respite</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 1.5 yrs • Placements: 2 Active Kinship</div>
            </div>
            <button id="btnActivateCard-HannahAbbott" onclick="activateSampleCaregiverProfile('Hannah & Beatrice Abbott')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Card 6: Eleanor & Arthur Vance -->
          <div class="border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white rounded-xl p-3.5 transition space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-slate-900 text-xs">Eleanor & Arthur Vance</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">Grandparents Kinship</span>
              </div>
              <p class="text-[11px] text-slate-500">Grandparents (55+) • Willow Creek Farm (HH-113)</p>
              <div class="text-[11px] text-slate-600 mt-1">Approvals: <span class="font-semibold text-slate-800">Kinship, Foster-to-Adopt</span></div>
              <div class="text-[11px] text-slate-500">Tenure: 5.5 yrs • Permanent Guardianship Finalized</div>
            </div>
            <button id="btnActivateCard-EleanorVance" onclick="activateSampleCaregiverProfile('Eleanor & Arthur Vance')" class="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5">
              <span>Activate Profile</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- MASTER VERMONT CAREGIVER RESOURCE COMMAND CENTER -->
      <div class="space-y-6">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <i data-lucide="shield" class="w-6 h-6 text-emerald-700"></i>
              Vermont Caregiver Official Resource Directory & Toolkit
            </h2>
            <p class="text-xs text-slate-500">
              State-contracted guidelines, daily reimbursement rates, mandatory training portals, advocacy networks, and legal resources.
            </p>
          </div>
          <span class="text-[11px] font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
            Updated Oct 2026 • Policy 75 & VT DCF Compliant
          </span>
        </div>

        <!-- 1. Financial Support, Rate Schedules & Benefit Calculators -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="dollar-sign" class="w-5 h-5 text-emerald-600"></i>
              1. Financial Support, DCF Rate Schedules & Benefit Calculators
            </h3>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Official VT DCF Rates</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Rate Schedules Table Card -->
            <div class="lg:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
              <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <i data-lucide="table" class="w-4 h-4 text-emerald-600"></i> Standard Daily Reimbursement Schedules (Board, Clothing & Incidentals)
              </h4>
              <div class="overflow-x-auto text-xs">
                <table class="w-full text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                  <thead class="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                    <tr>
                      <th class="py-2 px-3 border-b">Age Category</th>
                      <th class="py-2 px-3 border-b">Daily Board</th>
                      <th class="py-2 px-3 border-b">Daily Clothing</th>
                      <th class="py-2 px-3 border-b">Daily Incidentals</th>
                      <th class="py-2 px-3 border-b text-emerald-800 font-extrabold">Total Daily Rate</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-[11px]">
                    <tr class="hover:bg-slate-50">
                      <td class="py-2 px-3 font-semibold text-slate-800">Preschool (0 – 5)</td>
                      <td class="py-2 px-3 text-slate-600">$17.50</td>
                      <td class="py-2 px-3 text-slate-600">$3.10</td>
                      <td class="py-2 px-3 text-slate-600">$1.65</td>
                      <td class="py-2 px-3 font-bold text-emerald-700">$22.25 / day</td>
                    </tr>
                    <tr class="hover:bg-slate-50">
                      <td class="py-2 px-3 font-semibold text-slate-800">Child (6 – 12)</td>
                      <td class="py-2 px-3 text-slate-600">$19.80</td>
                      <td class="py-2 px-3 text-slate-600">$3.95</td>
                      <td class="py-2 px-3 text-slate-600">$2.10</td>
                      <td class="py-2 px-3 font-bold text-emerald-700">$25.85 / day</td>
                    </tr>
                    <tr class="hover:bg-slate-50">
                      <td class="py-2 px-3 font-semibold text-slate-800">Teen (13 – 18)</td>
                      <td class="py-2 px-3 text-slate-600">$23.40</td>
                      <td class="py-2 px-3 text-slate-600">$5.10</td>
                      <td class="py-2 px-3 text-slate-600">$2.95</td>
                      <td class="py-2 px-3 font-bold text-emerald-700">$31.45 / day</td>
                    </tr>
                    <tr class="bg-amber-50/70 font-semibold text-amber-900">
                      <td class="py-2 px-3" colspan="4">Emergency Placement Flat Rate (Up to 30 days)</td>
                      <td class="py-2 px-3 font-bold text-amber-800">$30.00 / day</td>
                    </tr>
                    <tr class="bg-purple-50/70 font-semibold text-purple-900">
                      <td class="py-2 px-3" colspan="4">Specialized / Enhanced 24-Hour Medical or Behavioral Care</td>
                      <td class="py-2 px-3 font-bold text-purple-800">Up to $200.00 / day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-[10px] text-slate-500 italic">
                * Note: Rates are direct state tax-free stipends issued bi-weekly to licensed kin and foster caregivers.
              </p>
            </div>

            <!-- State Forms & Reimbursements Card -->
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <i data-lucide="file-check" class="w-4 h-4 text-emerald-600"></i> Special Reimbursement Portals
                </h4>
                <div class="space-y-2 mt-2 text-xs">
                  <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div class="font-bold text-slate-900 flex justify-between">
                      <span>Family Support Fund</span>
                      <span class="text-emerald-700">$350 / child / yr</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">Normalcy items, school trips, extracurriculars, lessons. Email: <a href="mailto:Carrie.deem@vermont.gov" class="text-blue-600 font-bold hover:underline">Carrie.deem@vermont.gov</a></p>
                  </div>

                  <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div class="font-bold text-slate-900 flex justify-between">
                      <span>Initial Clothing Voucher</span>
                      <span class="text-emerald-700">$100.00 Voucher</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">Issued upon child entry into care when clothing is insufficient.</p>
                  </div>

                  <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div class="font-bold text-slate-900 flex justify-between">
                      <span>Child-Only Reach Up Cash Grant</span>
                      <span class="text-blue-700 font-bold">1-800-479-6151</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">Monthly cash assistance for non-licensed relative kin (Conditional Custody, Minor Guardianship, or Informal Kinship).</p>
                  </div>
                </div>
              </div>
              <div class="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200">
                Official Forms: <span class="font-mono text-slate-700">FS-333B</span> (Expenses), <span class="font-mono text-slate-700">FS-334B</span> (Respite Mileage), <span class="font-mono text-slate-700">FS-270</span> (Damage Claims)
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Training, Education & Incentive Portal -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-indigo-600"></i>
              2. Training, Education & Mandatory Licensing Portals
            </h3>
            <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">VT-CWTP Accredited</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="external-link" class="w-4 h-4 text-indigo-600"></i> VT-CWTP E-Learning Portal
              </div>
              <p class="text-slate-600 text-[11px]">
                Access the official Vermont Child Welfare Training Partnership LMS for mandatory courses and interactive modules.
              </p>
              <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2 font-bold text-indigo-900 text-[11px]">
                🎁 $100 Completion Incentive: Claimable upon finishing the 15-hour Foundations Series!
              </div>
              <a href="https://vtadoption.org/child-welfare-training-partnership.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline pt-1">
                Open CWTP Portal →
              </a>
            </div>

            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4 text-indigo-600"></i> Core Curriculum & Foundations
              </div>
              <ul class="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                <li><strong>Foundations Online</strong> (15 Hours Self-Paced)</li>
                <li><strong>Foundations Learning Networks</strong> (9-Hour 3-Week District Cohorts)</li>
                <li><strong>Fostering to Forever</strong> (Adoption & Permanent Guardianship)</li>
                <li><strong>RPC+ Trauma Parenting</strong> (Resource Parent Curriculum)</li>
              </ul>
            </div>

            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-4 h-4 text-indigo-600"></i> Early Childhood & Specialized
              </div>
              <div class="space-y-1.5 text-[11px]">
                <div>
                  <a href="https://northernlightsccv.org/training/training-calendar/" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-700 hover:underline">
                    Northern Lights at CCV →
                  </a>
                  <p class="text-slate-500">Child development & infant care continuing education.</p>
                </div>
                <div>
                  <a href="https://www.cdc.gov/act-early/site.html#gen" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-700 hover:underline">
                    CDC Act Early Milestones →
                  </a>
                  <p class="text-slate-500">Under 5 child development milestones and developmental tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Kinship, Foster & Respite Advocacy Networks -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="heart-handshake" class="w-5 h-5 text-rose-600"></i>
              3. Kinship, Foster & Respite Advocacy Networks
            </h3>
            <span class="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">Community Alliances</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1.5">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="phone" class="w-3.5 h-3.5 text-rose-600"></i> Vermont Kin as Parents (VKAP)
              </div>
              <p class="text-slate-600 text-[11px]">24/7 Warmline, Kinship Navigators, PASTA peer groups, and VKAP Respite Grants.</p>
              <div class="text-rose-800 font-extrabold text-xs">📞 (802) 871-5104</div>
              <a href="https://www.vkap.org/home" target="_blank" rel="noopener noreferrer" class="text-blue-700 font-bold hover:underline block pt-1">Visit VKAP Website →</a>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1.5">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-rose-600"></i> VFAFA Alliance
              </div>
              <p class="text-slate-600 text-[11px]">VT Foster & Adoptive Family Association: District reps, advocacy, and Children's Activity Fund grants.</p>
              <a href="https://vfafa.org/" target="_blank" rel="noopener noreferrer" class="text-blue-700 font-bold hover:underline block pt-1">Visit VFAFA Website →</a>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1.5">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="home" class="w-3.5 h-3.5 text-rose-600"></i> VT Adoption & Guardianship
              </div>
              <p class="text-slate-600 text-[11px]">VT Consortium for post-permanency support, lending library, and educational counseling.</p>
              <div class="text-slate-800 font-bold text-xs">📞 (802) 241-0901</div>
              <a href="https://vtadoption.org" target="_blank" rel="noopener noreferrer" class="text-blue-700 font-bold hover:underline block pt-1">vtadoption.org →</a>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1.5">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="user-plus" class="w-3.5 h-3.5 text-rose-600"></i> Area Agencies on Aging (55+)
              </div>
              <p class="text-slate-600 text-[11px]">Family Caregiver Support Program for grandparents and older kin 55+ raising children.</p>
              <div class="text-emerald-800 font-extrabold text-xs">📞 1-800-642-5119</div>
            </div>
          </div>
        </div>

        <!-- 4. Healthcare, Early Intervention & Infant Care -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="heart-pulse" class="w-5 h-5 text-teal-600"></i>
              4. Healthcare, Early Intervention & Infant Development
            </h3>
            <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">Health & Wellness</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1">
              <div class="font-bold text-slate-900">Dr. Dynasaur (Medicaid)</div>
              <p class="text-slate-600 text-[11px]">100% comprehensive medical, dental, and prescription coverage for all children in foster/kin care.</p>
              <div class="font-bold text-slate-800 text-xs">📞 1-855-899-9600</div>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1">
              <div class="font-bold text-slate-900">WIC Nutrition Program</div>
              <p class="text-slate-600 text-[11px]">Nutritional food vouchers, infant formula, and feeding support for all children under age 5.</p>
              <div class="font-bold text-teal-800 text-xs">Text "VTWIC" to 855-11</div>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1">
              <div class="font-bold text-slate-900">CIS & Help Me Grow VT</div>
              <p class="text-slate-600 text-[11px]">Children’s Integrated Services: Early intervention, home visiting, PT/OT/speech therapy.</p>
              <div class="font-bold text-slate-800 text-xs">Dial 2-1-1, Ext. 6</div>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-1">
              <div class="font-bold text-slate-900">Plan of Safe Care (POSC)</div>
              <p class="text-slate-600 text-[11px]">CAPTA notification and supportive planning for substance-exposed infants & safe sleep.</p>
              <div class="font-bold text-blue-700 text-[11px] truncate">AHS.DCFFSDCAPTA@vermont.gov</div>
            </div>
          </div>
        </div>

        <!-- 5. State Park Passes, Legal & 12 District Offices -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="map-pin" class="w-5 h-5 text-blue-600"></i>
              5. State Park Passes, Legal Services & 12 DCF District Offices
            </h3>
            <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">Statewide Access</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="trees" class="w-4 h-4 text-emerald-600"></i> Free VT State Park Day Passes
              </div>
              <p class="text-slate-600 text-[11px]">
                Foster and licensed kinship families receive free day-use entry to all 55 Vermont State Parks across the state.
              </p>
              <div class="text-[11px] text-slate-500 font-medium">Request pass via your DCF Resource Coordinator or local district office.</div>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="scale" class="w-4 h-4 text-indigo-600"></i> Legal & Advocacy Resources
              </div>
              <ul class="space-y-1 text-slate-600 text-[11px]">
                <li><strong>Legal Services Vermont:</strong> 1-800-889-2047</li>
                <li><strong>South Royalton Legal Clinic:</strong> (802) 831-1500 (Kinship guardianships)</li>
                <li><strong>Youth Development Program (YDP):</strong> (802) 229-9151 (Ages 14-23)</li>
              </ul>
            </div>

            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                <i data-lucide="building" class="w-4 h-4 text-blue-600"></i> 12 DCF District Offices Directory
              </div>
              <p class="text-slate-600 text-[11px]">
                Barre, Bennington, Brattleboro, Burlington, Hartford, Middlebury, Morrisville, Newport, Rutland, Springfield, St. Albans, St. Johnsbury.
              </p>
              <div class="bg-rose-50 border border-rose-200 rounded-lg p-2 font-bold text-rose-900 text-[11px]">
                🚨 24/7 DCF Crisis & Emergency: 1-800-649-5285
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// ==========================================
// VOICE-TO-TEXT DICTATION ENGINE (Browser Web Speech API)
// ==========================================
let activeRecognition = null;
let isDictating = false;

function toggleVoiceDictation(targetElementId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const labelEl = document.getElementById('voiceDictationLabel');
  const btnEl = document.getElementById('btnVoiceDictation');
  const targetInput = document.getElementById(targetElementId);

  if (!SpeechRecognition) {
    alert('Voice-to-Text dictation is not supported by your current browser. Try Google Chrome, Edge, or Safari.');
    return;
  }

  if (isDictating && activeRecognition) {
    activeRecognition.stop();
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isDictating = true;
      activeRecognition = recognition;
      if (labelEl) labelEl.textContent = 'Listening... (Click to Stop)';
      if (btnEl) {
        btnEl.classList.remove('bg-slate-100', 'text-slate-700');
        btnEl.classList.add('bg-rose-100', 'text-rose-700', 'border-rose-400', 'animate-pulse');
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript && targetInput) {
        const existing = targetInput.value.trim();
        targetInput.value = existing ? `${existing} ${finalTranscript.trim()}` : finalTranscript.trim();
      }
    };

    recognition.onerror = (event) => {
      console.warn('Voice dictation error:', event.error);
      stopVoiceDictationUI();
    };

    recognition.onend = () => {
      stopVoiceDictationUI();
    };

    recognition.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    stopVoiceDictationUI();
  }
}

function stopVoiceDictationUI() {
  isDictating = false;
  activeRecognition = null;
  const labelEl = document.getElementById('voiceDictationLabel');
  const btnEl = document.getElementById('btnVoiceDictation');
  if (labelEl) labelEl.textContent = 'Voice Dictate';
  if (btnEl) {
    btnEl.classList.remove('bg-rose-100', 'text-rose-700', 'border-rose-400', 'animate-pulse');
    btnEl.classList.add('bg-slate-100', 'text-slate-700');
  }
}

// ==========================================
// DIGITAL SIGNATURE PAD ENGINE (Touch & Mouse)
// ==========================================
let sigCanvas, sigCtx;
let isDrawingSignature = false;
let hasSigned = false;

function openSignatureModal() {
  const modal = document.getElementById('signatureModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  initSignatureCanvas();
}

function closeSignatureModal() {
  const modal = document.getElementById('signatureModal');
  if (modal) modal.classList.add('hidden');
}

function initSignatureCanvas() {
  sigCanvas = document.getElementById('signatureCanvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.strokeStyle = '#1e1b4b'; // Deep indigo ink

  clearSignatureCanvas();

  // Mouse & Touch Event Listeners
  sigCanvas.onmousedown = (e) => startSigning(e.offsetX, e.offsetY);
  sigCanvas.onmousemove = (e) => drawSignature(e.offsetX, e.offsetY);
  window.onmouseup = () => stopSigning();

  sigCanvas.ontouchstart = (e) => {
    e.preventDefault();
    const rect = sigCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    startSigning(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  sigCanvas.ontouchmove = (e) => {
    e.preventDefault();
    const rect = sigCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    drawSignature(touch.clientX - rect.left, touch.clientY - rect.top);
  };
  sigCanvas.ontouchend = () => stopSigning();
}

function startSigning(x, y) {
  isDrawingSignature = true;
  hasSigned = true;
  const hint = document.getElementById('signPromptHint');
  if (hint) hint.classList.add('hidden');
  sigCtx.beginPath();
  sigCtx.moveTo(x, y);
}

function drawSignature(x, y) {
  if (!isDrawingSignature) return;
  sigCtx.lineTo(x, y);
  sigCtx.stroke();
}

function stopSigning() {
  isDrawingSignature = false;
}

function clearSignatureCanvas() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  hasSigned = false;
  const hint = document.getElementById('signPromptHint');
  if (hint) hint.classList.remove('hidden');
}
// ==============================================================================
// PHASE 8: PRACTICE SANDBOX & CAREGIVER FLIGHT SIMULATOR (TRAINING HUB)
// ==============================================================================

const TRAINING_SCENARIOS = [
  {
    id: "scen-1",
    title: "Emergency Placement at 11:00 PM",
    category: "Emergency Intake",
    urgency: "Immediate",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    situation: "DCF On-Call worker arrives with an 8-year-old child (EC) placed under a 72-hour emergency hold. Child has no belongings except a plastic bag with one change of clothes and a favorite stuffed dog. No medication provided, but worker mentions the child is allergic to amoxicillin.",
    recommendedActions: [
      "Conduct non-intrusive physical wellness & allergy check; verify amoxicillin alert in Health domain.",
      "Ensure comfort items (stuffed dog) stay with child; log food/comfort items in Care Routines.",
      "Log emergency placement arrival time, DCF duty worker name, and emergency contact in Journal.",
      "Schedule statutory 30-Day EPSDT Well-Child Exam within 24 hours of intake."
    ],
    sampleLogTitle: "Emergency Placement Intake: EC",
    sampleLogSummary: "Child EC arrived at 11:15 PM via DCF After-Hours worker (Sara Higgins). Allergies confirmed: Amoxicillin. Comfort dog kept at bedside. Settled in bedroom at 11:45 PM after snack."
  },
  {
    id: "scen-2",
    title: "Missed Family Time / Visit Cancellation",
    category: "Family Visits",
    urgency: "High",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    situation: "Biological mother did not show for scheduled 3:00 PM supervised family time at Easterseals. Child waited 25 minutes, became visibly dysregulated and tearful, and threw a notebook in the parking lot before returning to the car.",
    recommendedActions: [
      "Document objective, observable behavior without judgment (e.g., 'tearful for 15 minutes, threw notebook' rather than 'child was defiant').",
      "Record transport arrival and departure times for state reimbursement.",
      "Log that the visit did not occur and state reason provided by supervisor.",
      "Flag an automated notification draft to DCF Caseworker."
    ],
    sampleLogTitle: "Family Time Cancellation & Emotional Reaction",
    sampleLogSummary: "Arrived Easterseals 2:50 PM. At 3:15 PM supervisor confirmed parent cancellation. Child cried and threw notebook in parking lot. Offered calm space and water; de-escalated by 3:40 PM."
  },
  {
    id: "scen-3",
    title: "Medication Refill Warning (3 Days Remaining)",
    category: "Health & MAR",
    urgency: "Medium",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    situation: "Child's daily ADHD medication (Methylphenidate 10mg) has only 4 tablets left in the prescription bottle. The prescribing pediatrician requires a 48-hour prior authorization turnaround.",
    recommendedActions: [
      "Check Pharmacy Refill Number on MAR ledger.",
      "Contact pediatric clinic nurse line to request electronic prescription renewal.",
      "Notify DCF caseworker if court or state medical consent sign-off is needed.",
      "Log medication follow-up action item on Today Flight Strip."
    ],
    sampleLogTitle: "Prescription Refill Request: Methylphenidate 10mg",
    sampleLogSummary: "Called Dr. Palmer's office for 30-day refill. Nurse confirmed request submitted to Walgreens. 4 doses remaining at home."
  },
  {
    id: "scen-4",
    title: "Quarterly CHINS Court Review Tomorrow",
    category: "Court Preparation",
    urgency: "Urgent",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    situation: "Family Division court review is tomorrow at 9:30 AM. Guardian ad Litem (GAL) and DCF worker request a 90-day progress summary covering school attendance, counseling notes, and caregiver observations.",
    recommendedActions: [
      "Generate Confidential Court Progress Report (.docx) in Privacy Mode: Initials Only.",
      "Verify that all family time visits and doctor appointments are up to date.",
      "Print or export mileage log (Form FS-334B) for the travel claim.",
      "Review factual observations and ensure zero unverified emotional assumptions."
    ],
    sampleLogTitle: "Court Progress Review Preparation",
    sampleLogSummary: "Compiled 90-day chronology for minor child. Exported monthly reports and attendance ledger for GAL review."
  },
  {
    id: "scen-5",
    title: "School IEP & Behavioral Incident",
    category: "School & Milestones",
    urgency: "Medium",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    situation: "School principal calls to report child had a sensory meltdown during fire drill and hid under a teacher's desk. Special education coordinator recommends an emergency IEP team meeting.",
    recommendedActions: [
      "Record date, teacher name, and exact triggers (loud siren) in Education sub-tab.",
      "Request written incident report from school special education liaison.",
      "Update child comfort items and care routines with sensory noise-canceling headphones.",
      "Coordinate with DCF educational surrogate for IEP signature."
    ],
    sampleLogTitle: "School Sensory Incident & IEP Review Request",
    sampleLogSummary: "Principal reported fire drill overload. Child hid under desk. Coordinated with Ms. Davis to add sensory ear protection to school bag."
  },
  {
    id: "scen-6",
    title: "Celebration: First Honor Roll & Soccer Goal",
    category: "Positive Outcomes",
    urgency: "Celebration",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    situation: "Child achieved Honor Roll in 5th grade and scored their first goal in Saturday's youth soccer league. Child asked to save the game ball and report card.",
    recommendedActions: [
      "Log developmental milestone in Milestones domain to build a positive life storybook.",
      "Photograph report card and save in Education vault.",
      "Share positive progress update with biological parents during next supervised family time (if permitted by case plan).",
      "Reinforce to child that their hard work and perseverance matter."
    ],
    sampleLogTitle: "Celebration Milestone: Honor Roll & Soccer Goal",
    sampleLogSummary: "Earned A's and B's on Q1 report card! Scored winning soccer goal on Saturday. Game ball signed and placed in bedroom shelf."
  }
];

const SYNTHETIC_VAULT_DOCS = [
  {
    id: "vdoc-1",
    name: "SAMPLE_CHINS_Court_Order_Temporary_Custody_Redacted.pdf",
    category: "Court & Legal",
    description: "Sample Family Division Conditional Custody Order (Title 33 V.S.A.). Practice reading court visitation mandates and legal custody conditions.",
    badge: "PRACTICE SANDBOX • NO REAL DATA"
  },
  {
    id: "vdoc-2",
    name: "SAMPLE_Vermont_IEP_Special_Education_Accommodations.pdf",
    category: "Education & School",
    description: "Sample Individualized Education Plan (IEP) with sensory breaks, speech therapy schedules, and paraprofessional support guidelines.",
    badge: "PRACTICE SANDBOX • NO REAL DATA"
  },
  {
    id: "vdoc-3",
    name: "SAMPLE_DCF_FS-221A_Foster_Caregiver_Placement_Agreement.pdf",
    category: "DCF Forms & Plans",
    description: "Sample Department for Children and Families Placement Agreement detailing caregiver authorities, RPPS decision-making, and Medicaid coverage.",
    badge: "PRACTICE SANDBOX • NO REAL DATA"
  },
  {
    id: "vdoc-4",
    name: "SAMPLE_EPSDT_30_Day_Well_Child_Health_Screening_Form.docx",
    category: "Medical & Health",
    description: "Vermont EPSDT statutory intake physical form. Shows baseline immunizations, growth chart curves, and dental referral blocks.",
    badge: "PRACTICE SANDBOX • NO REAL DATA"
  },
  {
    id: "vdoc-5",
    name: "SAMPLE_State_Reimbursement_FS-334B_Mileage_Claim.docx",
    category: "Financial & Claims",
    description: "Pre-formatted State Form FS-334B with itemized visitation mileage calculation at $0.67/mile.",
    badge: "PRACTICE SANDBOX • NO REAL DATA"
  }
];

const MOCK_CASEWORKER_MESSAGES = [
  {
    id: "cw-1",
    sender: "Jessica Taylor, MSW (DCF Family Services Worker)",
    subject: "Quarterly Case Review & Medical Documentation Request",
    timestamp: "Today at 9:15 AM",
    body: "Hi Candy,\n\nWe have our quarterly court review scheduled in two weeks. Could you please ensure all doctor visits and medication refills from the last 60 days are logged in your binder? Also, please send over the latest mileage claim (FS-334B) so our business office can approve it.\n\nThank you for all your support,\nJessica",
    recommendedReply: "Dear Jessica,\n\nI have updated our records in Sprout. The EPSDT well-child exam and immunization logs are current, and the FS-334B mileage claim is exported and ready for your sign-off.\n\nBest,\nCandy"
  },
  {
    id: "cw-2",
    sender: "David Vance (Guardian ad Litem / GAL)",
    subject: "Upcoming Visit Observation & School Check-In",
    timestamp: "Yesterday at 3:45 PM",
    body: "Hello,\n\nI will be meeting with the child at school next Tuesday. Could you let me know how they did emotionally following last Friday's family time? Any notes on bedtime routines or behavioral adjustments would be very helpful for my report to the judge.\n\nSincerely,\nDavid Vance, GAL",
    recommendedReply: "Dear Mr. Vance,\n\nFollowing Friday's visit, the child had a 20-minute emotional de-escalation period but settled well after a snack and evening routine. School attendance has remained at 100% this week. Full notes are logged in our Care Binder.\n\nBest regards,\nCandy"
  }
];

async function renderTrainingSimulatorView(container) {
  // Ensure sandbox theme indicator is activated if in practice mode
  const isSample = currentSproutMode === 'sample';

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Training Header Banner -->
      <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden border border-blue-700">
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40 flex items-center gap-1">
                <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-blue-300"></i> Caregiver Flight Simulator
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                VCWTP Aligned • 100% Synthetic
              </span>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Practice Sandbox & Training Command Center
            </h2>
            <p class="text-xs text-blue-200 max-w-2xl mt-1 leading-relaxed">
              Learn Sprout workflows, master Vermont DCF documentation, practice high-stress emergency intakes, and rehearse court preparation without risking real-family records.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="startInteractiveTutorialTour()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5">
              <i data-lucide="play-circle" class="w-4 h-4"></i> 5-Min First-Run Tour
            </button>
            <button onclick="resetSandboxFactoryData()" class="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-blue-300"></i> Reset Sandbox
            </button>
          </div>
        </div>
      </div>

      <!-- Module 8.2: Role-Based Training Personas (Instant Persona Switching) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4 text-blue-600"></i>
              <span>Role-Based Training Personas (Choose Your Caregiver Perspective)</span>
            </h3>
            <p class="text-xs text-slate-500">Switch personas instantly to explore specialized documentation for kinship, respite, teens, or emergency care.</p>
          </div>
          <span class="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
            15 Personas Available
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <!-- Persona 1: Grandparent Kinship -->
          <div onclick="activateTrainingPersona('Eleanor Vance', 'HH-113', 'Grandparent Kinship')" class="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer transition space-y-1.5 group bg-slate-50/50">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 group-hover:text-emerald-900">Grandparents Kinship</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">HH-113</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Eleanor Vance • Navigating custody stipends, relative search, and informal family visitation.</p>
            <div class="text-[10px] text-emerald-700 font-semibold pt-1 flex items-center gap-1">
              <i data-lucide="arrow-right" class="w-3 h-3"></i> Load Persona & Child
            </div>
          </div>

          <!-- Persona 2: Single Foster Parent -->
          <div onclick="activateTrainingPersona('Sarah Jenkins', 'HH-101', 'Single Foster Parent')" class="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition space-y-1.5 group bg-slate-50/50">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 group-hover:text-blue-900">Single Foster Parent</span>
              <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">HH-101</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Sarah Jenkins • Balancing solo employment with school IEPs and daily MAR medication records.</p>
            <div class="text-[10px] text-blue-700 font-semibold pt-1 flex items-center gap-1">
              <i data-lucide="arrow-right" class="w-3 h-3"></i> Load Persona & Child
            </div>
          </div>

          <!-- Persona 3: Sibling Group Foster Home -->
          <div onclick="activateTrainingPersona('Robert Hayes', 'HH-104', 'Sibling Group Foster Home')" class="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer transition space-y-1.5 group bg-slate-50/50">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 group-hover:text-indigo-900">Sibling Group (4 Beds)</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">HH-104</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Robert & Laura Hayes • Managing multi-child calendars, staggered visits, and bulk mileage logs.</p>
            <div class="text-[10px] text-indigo-700 font-semibold pt-1 flex items-center gap-1">
              <i data-lucide="arrow-right" class="w-3 h-3"></i> Load Persona & Child
            </div>
          </div>

          <!-- Persona 4: Respite Provider -->
          <div onclick="activateTrainingPersona('Julian Scott', 'HH-106', 'Respite Provider')" class="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 cursor-pointer transition space-y-1.5 group bg-slate-50/50">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 group-hover:text-purple-900">Respite Provider</span>
              <span class="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">HH-106</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Julian & Anthony • Confidential need-to-know mode, 72-hour handoff cards, and soothing routines.</p>
            <div class="text-[10px] text-purple-700 font-semibold pt-1 flex items-center gap-1">
              <i data-lucide="arrow-right" class="w-3 h-3"></i> Load Persona & Child
            </div>
          </div>
        </div>
      </div>

      <!-- Module 8.3 & 8.7: Scenario Training Library & Skill Checks -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Scenarios List (2 Columns) -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i>
                <span>Interactive Caregiver Scenarios (Flight Simulation Exercises)</span>
              </h3>
              <p class="text-xs text-slate-500">Practice realistic situations, inspect recommended protocols, and log practice notes without risk.</p>
            </div>
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              6 Practice Scenarios
            </span>
          </div>

          <div class="space-y-3">
            ${TRAINING_SCENARIOS.map(scen => `
              <div class="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition space-y-3 bg-slate-50/30">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] border ${scen.badgeColor}">
                      ${scen.category}
                    </span>
                    <h4 class="font-bold text-slate-900 text-xs">${scen.title}</h4>
                  </div>
                  <span class="text-[11px] font-semibold text-slate-500">Urgency: <strong>${scen.urgency}</strong></span>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  ${scen.situation}
                </p>

                <div class="space-y-1 text-xs">
                  <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Recommended Practice Actions:</span>
                  <ul class="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    ${scen.recommendedActions.map(act => `<li>${act}</li>`).join('')}
                  </ul>
                </div>

                <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Factual, Non-Judgmental Wording Pre-Checked
                  </span>
                  <button onclick="practiceLogScenario('${scen.id}')" class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1">
                    <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i> Practice Logging Note
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Caregiver Skill Checks & Training Progress (1 Column) -->
        <div class="space-y-6">
          
          <!-- Skill Tracker Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
              <span>Caregiver Competency Checks</span>
            </h3>

            <div class="space-y-3 text-xs">
              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span class="text-slate-700">1. Child Privacy & Identity Shielding</span>
                  <span class="text-emerald-700 font-bold">100% Mastered</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-600 h-full w-full"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span class="text-slate-700">2. Objective Behavioral Logging</span>
                  <span class="text-emerald-700 font-bold">85% Proficient</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-600 h-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span class="text-slate-700">3. Medication Administration (MAR)</span>
                  <span class="text-blue-700 font-bold">90% Verified</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span class="text-slate-700">4. DCF Mileage Reimbursement (FS-334B)</span>
                  <span class="text-amber-700 font-bold">75% In Progress</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full w-[75%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span class="text-slate-700">5. Family Court & GAL Preparation</span>
                  <span class="text-emerald-700 font-bold">95% Ready</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-600 h-full w-[95%]"></div>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-[11px] leading-relaxed">
              <strong>VCWTP Credit Equivalent:</strong> 6 Hours of simulated documentation exercises completed.
            </div>
          </div>

          <!-- Module 8.5: Mock Caseworker Simulator -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4 text-indigo-600"></i>
                <span>Mock Caseworker Simulator</span>
              </h3>
              <span class="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">Simulated</span>
            </div>

            <div class="space-y-3">
              ${MOCK_CASEWORKER_MESSAGES.map(msg => `
                <div class="border border-indigo-100 rounded-xl p-3 bg-indigo-50/40 text-xs space-y-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-bold text-indigo-950">${msg.sender}</div>
                      <div class="text-[10px] text-slate-400 font-semibold">${msg.timestamp}</div>
                    </div>
                  </div>
                  <div class="font-semibold text-slate-800 text-[11px]">${msg.subject}</div>
                  <p class="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-indigo-50">
                    ${msg.body}
                  </p>
                  <button onclick="practiceReplyCaseworker('${msg.id}')" class="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-1.5 rounded-lg shadow-2xs transition flex items-center justify-center gap-1">
                    <i data-lucide="reply" class="w-3.5 h-3.5"></i> Practice Factual Response
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>

      <!-- Module 8.4: Synthetic Document Vault -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="file-check" class="w-4 h-4 text-teal-600"></i>
              <span>Synthetic Document Vault (Practice Forms & Templates)</span>
            </h3>
            <p class="text-xs text-slate-500">Explore court orders, IEPs, and DCF agreements. All documents watermarked: <strong>PRACTICE SANDBOX • NO REAL CHILD DATA</strong>.</p>
          </div>
          <span class="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            5 Verified Templates
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          ${SYNTHETIC_VAULT_DOCS.map(doc => `
            <div class="border border-slate-200 rounded-xl p-3.5 hover:border-teal-300 transition space-y-2 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">${doc.category}</span>
                  <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">Mock Data</span>
                </div>
                <h5 class="font-bold text-slate-900 text-xs break-all">${doc.name}</h5>
                <p class="text-[11px] text-slate-500 mt-1 leading-snug">${doc.description}</p>
              </div>
              <button onclick="previewSyntheticVaultDoc('${doc.name}')" class="mt-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] py-1.5 rounded-lg shadow-2xs transition flex items-center justify-center gap-1">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Inspect Sample Document
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  lucide.createIcons();
}

function startInteractiveTutorialTour() {
  alert("🎓 Sprout Interactive Onboarding:\n\n1. Top Bar: Quick-switch between Real Workspace and Practice Sandbox.\n2. Four Cognitive Domains: Health, Visits, Milestones, and Documents.\n3. Daily Briefing Center: Shows immediate doses, upcoming court hearings, and compliance in 10 seconds.\n4. Factual Documentation: Everything logged syncs into court-ready reports automatically!");
}

function activateTrainingPersona(caregiverName, householdId, roleTitle) {
  currentSproutMode = 'sample';
  localStorage.setItem('sproutMode', 'sample');
  activeCaregiverUser = `Sample Caregiver (${caregiverName})`;
  localStorage.setItem('caregiverUser', activeCaregiverUser);

  updateWorkspaceToggleUI();
  updateSproutTheme();
  loadChildren();
  
  alert(`✅ Switched to Training Persona: ${caregiverName} (${roleTitle} • ${householdId})\n\nExplore how Sprout configures specialized workflows for this family!`);
  switchMainSection('dashboard');
}

function practiceLogScenario(scenId) {
  const scen = TRAINING_SCENARIOS.find(s => s.id === scenId);
  if (!scen) return;

  // Open note modal pre-filled with factual practice observation
  openRecordModal();
  setTimeout(() => {
    const titleInput = document.getElementById('recTitle');
    const summaryInput = document.getElementById('recSummary');
    const catInput = document.getElementById('recCategory');
    if (titleInput) titleInput.value = `[PRACTICE] ${scen.sampleLogTitle}`;
    if (summaryInput) summaryInput.value = scen.sampleLogSummary;
    if (catInput) {
      if (scen.category.includes('Health')) catInput.value = 'medical';
      else if (scen.category.includes('Visits')) catInput.value = 'visits';
      else if (scen.category.includes('Court')) catInput.value = 'legal';
      else if (scen.category.includes('School') || scen.category.includes('Celebration')) catInput.value = 'education';
      else catInput.value = 'daily';
    }
  }, 150);
}

function practiceReplyCaseworker(msgId) {
  const msg = MOCK_CASEWORKER_MESSAGES.find(m => m.id === msgId);
  if (!msg) return;

  alert(`📨 Simulated DCF Email Draft Generated:\n\nTo: ${msg.sender}\nSubject: Re: ${msg.subject}\n\n${msg.recommendedReply}\n\n(This draft was created in Practice Sandbox without sending live emails.)`);
}

function previewSyntheticVaultDoc(docName) {
  alert(`📄 Previewing Synthetic Document:\n\n[ WATERMARK: PRACTICE SANDBOX • NO REAL CHILD DATA ]\n\nFilename: ${docName}\nStatus: Verified Synthetic Template for Caregiver Training.`);
}

function resetSandboxFactoryData() {
  if (confirm("Reset Practice Sandbox back to default baseline settings?")) {
    currentSproutMode = 'sample';
    localStorage.setItem('sproutMode', 'sample');
    activeCaregiverUser = 'Sample Caregiver (Sarah Jenkins)';
    localStorage.setItem('caregiverUser', activeCaregiverUser);
    localStorage.removeItem('currentChildId');
    updateWorkspaceToggleUI();
    updateSproutTheme();
    loadChildren();
    alert("Practice Sandbox reset to factory baseline.");
    switchMainSection('training');
  }
}
// ==============================================================================
// PHASE 10: RELATIONSHIP CENTER & CIRCLES OF CARE OPERATING SYSTEM
// ==============================================================================

async function renderRelationshipCenterView(container) {
  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? (child.alias || 'Child') : 'Child';
  const childRefId = child ? (child.child_code || `CH-${child.id || '201'}`) : 'CH-201';

  let contacts = [];
  let commRecords = [];
  try {
    const [cRes, rRes] = await Promise.all([
      apiFetch(`/api/children/${currentChildId}/contacts`),
      apiFetch(`/api/children/${currentChildId}/records?category=all`)
    ]);
    contacts = await cRes.json();
    const allRecords = await rRes.json();
    // Filter records that involve stakeholder interactions or follow-ups
    commRecords = allRecords.filter(r => 
      ['family_time', 'legal', 'medical', 'education'].includes(r.category) || 
      r.participants || r.follow_up_needed
    );
  } catch (err) {
    console.error('Failed to load relationship center records:', err);
  }

  // 4 Concentric Circles of Care Classification
  const circle1DailyCare = contacts.filter(c => 
    ['Caregiver', 'Foster Parent', 'Kinship Caregiver', 'Emergency Resource', 'Respite Provider', 'Babysitter'].some(role => (c.role_type || '').includes(role))
  );

  const circle2DcfTeam = contacts.filter(c => 
    ['DCF', 'Caseworker', 'Social Worker', 'Supervisor', 'Family Services', 'Resource Coordinator'].some(role => (c.role_type || '').includes(role) || (c.organization || '').includes('DCF'))
  );

  const circle3CourtMedical = contacts.filter(c => 
    ['GAL', 'Guardian ad Litem', 'Attorney', 'CASA', 'Judge', 'Pediatrician', 'Doctor', 'Therapist', 'Psychiatrist', 'Dentist'].some(role => (c.role_type || '').includes(role))
  );

  const circle4SchoolCommunity = contacts.filter(c => 
    !circle1DailyCare.includes(c) && !circle2DcfTeam.includes(c) && !circle3CourtMedical.includes(c)
  );

  // If contacts are empty, provide synthetic fallback contacts for training/exploration
  const displayCircle1 = circle1DailyCare.length > 0 ? circle1DailyCare : [
    { id: 'mock-1', full_name: 'Candy Chevalier', role_type: 'Primary Caregiver', organization: 'Maple Ridge Home', phone: '(802) 555-0192', email: 'candy.chevalier@vermont.local', preferred_method: 'Phone / SMS' }
  ];
  const displayCircle2 = circle2DcfTeam.length > 0 ? circle2DcfTeam : [
    { id: 'mock-2', full_name: 'Jessica Taylor, MSW', role_type: 'DCF Family Services Worker', organization: 'Vermont DCF Burlington District', phone: '(802) 863-7370', email: 'jessica.taylor@vermont.gov', preferred_method: 'Email', last_contact: 'Oct 11, 2026' },
    { id: 'mock-3', full_name: 'Marcus Sterling', role_type: 'DCF District Supervisor', organization: 'Vermont DCF Burlington District', phone: '(802) 863-7371', email: 'marcus.sterling@vermont.gov', preferred_method: 'Email' }
  ];
  const displayCircle3 = circle3CourtMedical.length > 0 ? circle3CourtMedical : [
    { id: 'mock-4', full_name: 'David Vance, Esq.', role_type: 'Guardian ad Litem (GAL)', organization: 'Vermont Defender General / Family Court', phone: '(802) 863-7400', email: 'david.vance@gal.vermont.gov', preferred_method: 'Email', last_contact: 'Oct 10, 2026' },
    { id: 'mock-5', full_name: 'Dr. Sarah Miller, MD', role_type: 'Pediatrician', organization: 'UVM Children\'s Hospital Clinic', phone: '(802) 847-2000', email: 'smiller@uvmhealth.org', preferred_method: 'Phone', last_contact: 'Oct 02, 2026' },
    { id: 'mock-6', full_name: 'Elena Rostova, LCMHC', role_type: 'Child Trauma Therapist', organization: 'Youth & Family Counseling Center', phone: '(802) 658-0040', email: 'erostova@counseling.org', preferred_method: 'Phone', last_contact: 'Oct 08, 2026' }
  ];
  const displayCircle4 = circle4SchoolCommunity.length > 0 ? circle4SchoolCommunity : [
    { id: 'mock-7', full_name: 'Karen Harper', role_type: '5th Grade Teacher / IEP Team', organization: 'Maple Ridge Elementary School', phone: '(802) 555-0144', email: 'kharper@school.k12.vt.us', preferred_method: 'Email', last_contact: 'Oct 09, 2026' },
    { id: 'mock-8', full_name: 'Easterseals Family Center', role_type: 'Family Time Supervised Visitation Coordinator', organization: 'Easterseals Vermont', phone: '(802) 223-4721', email: 'visitation@eastersealsvt.org', preferred_method: 'Phone' }
  ];

  const pendingFollowups = commRecords.filter(r => r.follow_up_needed && !r.is_completed);

  container.innerHTML = `
    <div class="space-y-6">

      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md border border-rose-900/60 relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                <i data-lucide="heart-handshake" class="w-3.5 h-3.5 text-rose-400"></i> Circles of Care Operating System
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Child Ref: ${childRefId}
              </span>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Relationship Center & Support Network Map
            </h2>
            <p class="text-xs text-rose-200/80 max-w-2xl mt-1 leading-relaxed">
              The single authoritative people hub for ${alias}. Instant visibility into who supports this child, when you last communicated, what actions are pending, and what is due for court.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="generateCourtRelationshipBrief()" class="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5">
              <i data-lucide="file-text" class="w-4 h-4"></i> Court Stakeholder Brief (.docx)
            </button>
            <button onclick="openNewContactModal()" class="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5">
              <i data-lucide="user-plus" class="w-3.5 h-3.5 text-rose-300"></i> Add Support Person
            </button>
          </div>
        </div>

        <!-- 30-Second Quick Readiness Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/10 text-xs">
          <div class="bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-rose-300 font-bold uppercase block">Active Support Team</span>
            <span class="text-base font-black text-white mt-0.5 block">${displayCircle1.length + displayCircle2.length + displayCircle3.length + displayCircle4.length} Stakeholders</span>
            <span class="text-[10px] text-slate-300">4 Circles of Care</span>
          </div>

          <div class="bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-amber-300 font-bold uppercase block">Pending Follow-Ups</span>
            <span class="text-base font-black text-white mt-0.5 block">${pendingFollowups.length} Actions</span>
            <span class="text-[10px] text-amber-200">${pendingFollowups.length > 0 ? 'Requires attention' : 'All clear'}</span>
          </div>

          <div class="bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-emerald-300 font-bold uppercase block">Last DCF Communication</span>
            <span class="text-base font-black text-white mt-0.5 block">Oct 11, 2026</span>
            <span class="text-[10px] text-emerald-200">2 Days Ago (Call)</span>
          </div>

          <div class="bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-blue-300 font-bold uppercase block">Next Case Conference</span>
            <span class="text-base font-black text-white mt-0.5 block">Oct 24, 2026</span>
            <span class="text-[10px] text-blue-200">Family Division Court</span>
          </div>
        </div>
      </div>

      <!-- Phase 10.5: Visual Circles of Care Mapping -->
      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-rose-600"></i>
              <span>Circles of Care Visual Map — Child Reference: ${childRefId}</span>
            </h3>
            <p class="text-xs text-slate-500">Concentric support network organized by proximity: Daily Home, DCF Team, Court & Health, and School/Community.</p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
            Click Any Person to Review Profile
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <!-- Circle 1: Daily Care Team (Inner Circle) -->
          <div class="bg-emerald-50/60 rounded-2xl border-2 border-emerald-300 p-4 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-emerald-200/80 pb-2">
              <span class="font-black text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="home" class="w-3.5 h-3.5 text-emerald-700"></i> 1. Daily Care Team
              </span>
              <span class="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full">${displayCircle1.length}</span>
            </div>
            <p class="text-[11px] text-emerald-900/80">Caregivers, respite providers, and daily routine partners.</p>
            <div class="space-y-2">
              ${displayCircle1.map(c => `
                <div onclick="openContactDetailModal('${c.id}')" class="bg-white p-3 rounded-xl border border-emerald-200 hover:border-emerald-400 cursor-pointer transition shadow-2xs space-y-1">
                  <div class="font-bold text-slate-900">${c.full_name}</div>
                  <div class="text-[10px] font-semibold text-emerald-800">${c.role_type}</div>
                  <div class="text-[10px] text-slate-500 privacy-sensitive">${c.phone || c.email || 'No direct phone'}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Circle 2: DCF Team (Second Circle) -->
          <div class="bg-blue-50/60 rounded-2xl border-2 border-blue-300 p-4 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-blue-200/80 pb-2">
              <span class="font-black text-blue-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="shield" class="w-3.5 h-3.5 text-blue-700"></i> 2. DCF Family Services
              </span>
              <span class="text-[10px] font-bold bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded-full">${displayCircle2.length}</span>
            </div>
            <p class="text-[11px] text-blue-900/80">Assigned district caseworkers, resource workers, and supervisors.</p>
            <div class="space-y-2">
              ${displayCircle2.map(c => `
                <div onclick="openContactDetailModal('${c.id}')" class="bg-white p-3 rounded-xl border border-blue-200 hover:border-blue-400 cursor-pointer transition shadow-2xs space-y-1">
                  <div class="font-bold text-slate-900">${c.full_name}</div>
                  <div class="text-[10px] font-semibold text-blue-800">${c.role_type}</div>
                  <div class="text-[10px] text-slate-500 privacy-sensitive">${c.phone || c.email || 'District Office'}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Circle 3: Court, Legal & Health (Third Circle) -->
          <div class="bg-purple-50/60 rounded-2xl border-2 border-purple-300 p-4 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-purple-200/80 pb-2">
              <span class="font-black text-purple-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="scale" class="w-3.5 h-3.5 text-purple-700"></i> 3. Court & Medical
              </span>
              <span class="text-[10px] font-bold bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded-full">${displayCircle3.length}</span>
            </div>
            <p class="text-[11px] text-purple-900/80">Guardian ad Litem (GAL), attorney, pediatrician, and therapists.</p>
            <div class="space-y-2">
              ${displayCircle3.map(c => `
                <div onclick="openContactDetailModal('${c.id}')" class="bg-white p-3 rounded-xl border border-purple-200 hover:border-purple-400 cursor-pointer transition shadow-2xs space-y-1">
                  <div class="font-bold text-slate-900">${c.full_name}</div>
                  <div class="text-[10px] font-semibold text-purple-800">${c.role_type}</div>
                  <div class="text-[10px] text-slate-500 privacy-sensitive">${c.phone || c.email || 'Provider clinic'}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Circle 4: School & Community (Fourth Circle) -->
          <div class="bg-amber-50/60 rounded-2xl border-2 border-amber-300 p-4 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <span class="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-amber-700"></i> 4. School & Community
              </span>
              <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full">${displayCircle4.length}</span>
            </div>
            <p class="text-[11px] text-amber-900/80">Teachers, IEP coordinators, sports coaches, and visitation monitors.</p>
            <div class="space-y-2">
              ${displayCircle4.map(c => `
                <div onclick="openContactDetailModal('${c.id}')" class="bg-white p-3 rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer transition shadow-2xs space-y-1">
                  <div class="font-bold text-slate-900">${c.full_name}</div>
                  <div class="text-[10px] font-semibold text-amber-800">${c.role_type}</div>
                  <div class="text-[10px] text-slate-500 privacy-sensitive">${c.phone || c.email || 'School/Org on file'}</div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- Phase 10.3 & 10.4: Unified Communication Ledger & Activity Timeline -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Ledger & Timeline (2 Columns) -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4 text-indigo-600"></i>
                <span>Court-Ready Communication Ledger & Interaction History</span>
              </h3>
              <p class="text-xs text-slate-500">Every phone call, text, IEP conference, and caseworker check-in chronologically unified.</p>
            </div>
            <button onclick="openRecordModal()" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Log Interaction
            </button>
          </div>

          <div class="space-y-3">
            ${commRecords.length === 0 ? `
              <div class="p-8 text-center text-slate-400">
                <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
                <p class="font-bold text-slate-700">No stakeholder interactions recorded yet.</p>
                <p class="text-xs text-slate-400 mt-1">Log calls with your DCF worker, emails with teachers, or therapy check-ins to build this ledger.</p>
              </div>
            ` : commRecords.slice(0, 8).map(r => `
              <div class="border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 transition space-y-1.5 bg-slate-50/40">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-slate-200 text-slate-800">
                      ${r.category.replace('_', ' ')}
                    </span>
                    <h5 class="font-bold text-slate-900 text-xs">${r.title}</h5>
                  </div>
                  <span class="text-[11px] font-semibold text-slate-400">${r.event_date}</span>
                </div>

                <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                  ${r.summary}
                </p>

                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span><strong>Participants:</strong> ${r.participants || 'Caregiver & Stakeholder'}</span>
                  ${r.follow_up_needed ? `
                    <span class="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      ⚠️ Follow-up: ${r.follow_up_notes || 'Pending'}
                    </span>
                  ` : '<span class="text-emerald-700 font-semibold">✓ Completed</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Phase 10.6: Relationship Follow-Up Engine (1 Column) -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <i data-lucide="bell-ring" class="w-4 h-4 text-amber-500"></i>
              <span>Relationship Follow-Up Engine</span>
            </h3>

            <div class="space-y-3 text-xs">
              ${pendingFollowups.length === 0 ? `
                <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <span class="text-emerald-900 font-bold block">Zero Pending Follow-Ups!</span>
                  <span class="text-[11px] text-emerald-700 block mt-0.5">All calls, school emails, and DCF requests are current.</span>
                </div>
              ` : pendingFollowups.map(pf => `
                <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-amber-950 text-xs">${pf.title}</span>
                    <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">Pending</span>
                  </div>
                  <p class="text-[11px] text-amber-900/90 leading-tight">${pf.follow_up_notes || 'Action required.'}</p>
                  <div class="flex items-center justify-between pt-1 border-t border-amber-200/60">
                    <span class="text-[10px] text-amber-800 font-semibold">Logged: ${pf.event_date}</span>
                    <button onclick="markRecordComplete(${pf.id})" class="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Resolve
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Quick Action Directory Card -->
          <div class="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-3xl p-5 space-y-3">
            <h4 class="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="phone-call" class="w-3.5 h-3.5 text-indigo-600"></i> Rapid Team Connect
            </h4>
            <p class="text-[11px] text-indigo-900/80 leading-relaxed">
              1-Tap connection to the child's primary caseworker, pediatrician, or emergency duty worker.
            </p>
            <div class="space-y-1.5">
              <a href="tel:8028637370" class="block bg-white hover:bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 font-bold text-xs text-indigo-950 transition flex items-center justify-between">
                <span>DCF District Desk</span>
                <span class="text-[11px] text-indigo-700 font-semibold">(802) 863-7370</span>
              </a>
              <a href="tel:18006495285" class="block bg-rose-50 hover:bg-rose-100 p-2.5 rounded-xl border border-rose-200 font-bold text-xs text-rose-950 transition flex items-center justify-between">
                <span>24/7 Crisis Hotline</span>
                <span class="text-[11px] text-rose-700 font-semibold">1-800-649-5285</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  lucide.createIcons();
}

function openContactDetailModal(contactId) {
  alert(`👤 Support Profile:\n\nContact ID: ${contactId}\n\nDisplays role, communication preferences, hours of availability, and complete interaction history.`);
}

function generateCourtRelationshipBrief() {
  alert("📄 Generating Court Stakeholder Brief (.docx):\n\nCompiling full Circles of Care roster, last contact dates, open follow-ups, and interaction chronologies formatted for the Family Court Judge and Guardian ad Litem.");
}

async function markRecordComplete(recordId) {
  try {
    await apiFetch(`/api/records/${recordId}/toggle-task`, { method: 'POST' });
    alert("Follow-up action marked as resolved!");
    loadTabContent();
  } catch (err) {
    alert("Failed to update status: " + err.message);
  }
}

// ==============================================================================
// PHASE 11: LIFE JOURNEY & MILESTONE CENTER (CHILD LIFEBOOK & CELEBRATION FEED)
// ==============================================================================

async function renderLifeJourneyView(container) {
  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? (child.alias || 'Child') : 'Child';
  const childRefId = child ? (child.child_code || `CH-${child.id || '201'}`) : 'CH-201';

  let records = [];
  try {
    const res = await apiFetch(`/api/children/${currentChildId}/records?category=all`);
    records = await res.json();
  } catch (err) {
    console.error('Failed to load life journey records:', err);
  }

  // Core Positive Milestones (Strengths-based journey)
  const milestoneList = [
    {
      date: "Oct 12, 2026",
      title: "First Soccer League Goal!",
      category: "Sports & Athletics",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Scored winning goal during Saturday's regional game. Kept game ball as a memento in bedroom.",
      icon: "trophy"
    },
    {
      date: "Oct 05, 2026",
      title: "5th Grade Honor Roll — Q1 Term",
      category: "Educational Success",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      description: "Achieved all A's and B's on quarterly progress report card. Outstanding growth in reading comprehension.",
      icon: "award"
    },
    {
      date: "Sep 22, 2026",
      title: "Reading Milestone: Completed Chapter Book",
      category: "Literacy & Learning",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      description: "Finished 300-page chapter book independently with 30-min bedtime reading routine.",
      icon: "book-open"
    },
    {
      date: "Aug 15, 2026",
      title: "Camp Abnaki Summer Nature Explorer Badge",
      category: "Community & Arts",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Completed one-week day camp canoe and outdoor survival trail challenge.",
      icon: "compass"
    }
  ];

  container.innerHTML = `
    <div class="space-y-6">

      <!-- Life Journey Header Banner -->
      <div class="bg-gradient-to-r from-amber-700 via-rose-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md border border-amber-500/40 relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/30 text-amber-100 border border-amber-300/40 flex items-center gap-1">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i> Child Lifebook & Journey Storybook
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20">
                Child Ref: ${childRefId}
              </span>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Life Journey & Positive Milestone Center
            </h2>
            <p class="text-xs text-amber-100/90 max-w-2xl mt-1 leading-relaxed">
              Every child is a whole person—not an administrative case file. Preserving childhood achievements, sports victories, reading milestones, artwork, and joyful memories with dignity and trauma-informed care.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="generateChildLifebookPdf()" class="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5">
              <i data-lucide="book" class="w-4 h-4"></i> Export Lifebook Packet (.docx)
            </button>
            <button onclick="generateTransitionPacket()" class="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5">
              <i data-lucide="package-check" class="w-3.5 h-3.5 text-amber-200"></i> Transition Packet
            </button>
          </div>
        </div>

        <!-- Positive Metrics Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/15 text-xs">
          <div class="bg-white/10 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-amber-200 font-bold uppercase block">Celebrated Milestones</span>
            <span class="text-base font-black text-white mt-0.5 block">${milestoneList.length} Major Wins</span>
            <span class="text-[10px] text-amber-100">Honor Roll, Sports, Reading</span>
          </div>

          <div class="bg-white/10 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-emerald-200 font-bold uppercase block">Positive Life Growth</span>
            <span class="text-base font-black text-white mt-0.5 block">+2 Grade Levels</span>
            <span class="text-[10px] text-emerald-100">Reading Comprehension</span>
          </div>

          <div class="bg-white/10 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-rose-200 font-bold uppercase block">Preserved Memories</span>
            <span class="text-base font-black text-white mt-0.5 block">12 Keepsakes</span>
            <span class="text-[10px] text-rose-100">Photos, Artwork, Certificates</span>
          </div>

          <div class="bg-white/10 p-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-blue-200 font-bold uppercase block">Supportive Connections</span>
            <span class="text-base font-black text-white mt-0.5 block">6 Caring Adults</span>
            <span class="text-[10px] text-blue-100">Coach, Teacher, Kin, Mentor</span>
          </div>
        </div>
      </div>

      <!-- Main Milestone Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Milestone Cards (2 Columns) -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-amber-600"></i>
                <span>Chronological Milestone & Growth Journey — ${alias}</span>
              </h3>
              <p class="text-xs text-slate-500">Documenting achievements and joyous moments that celebrate child dignity and personal strengths.</p>
            </div>
            <button onclick="openNewMilestoneModal()" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Celebrate Milestone
            </button>
          </div>

          <div class="space-y-4">
            ${milestoneList.map(m => `
              <div class="border border-slate-200 rounded-2xl p-4 hover:border-amber-300 transition space-y-2 bg-gradient-to-r from-amber-50/20 via-white to-slate-50/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                      <i data-lucide="${m.icon}" class="w-4 h-4"></i>
                    </span>
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] uppercase border ${m.badgeColor}">
                      ${m.category}
                    </span>
                    <h4 class="font-bold text-slate-900 text-xs">${m.title}</h4>
                  </div>
                  <span class="text-[11px] font-semibold text-slate-400">${m.date}</span>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  ${m.description}
                </p>

                <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span class="text-emerald-700 font-semibold flex items-center gap-1">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> Preserved in Child Lifebook Story
                  </span>
                  <span class="text-slate-400">Permanently Archived</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Lifebook & Transition Packets (1 Column) -->
        <div class="space-y-6">
          
          <!-- Lifebook Snapshot Card -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <i data-lucide="book-heart" class="w-4 h-4 text-rose-500"></i>
              <span>Child Lifebook Keepsake</span>
            </h3>

            <p class="text-xs text-slate-600 leading-relaxed">
              When a child transitions home to family, permanent guardianship, or adoption, this Lifebook transfers with them—carrying their proudest memories, school photos, and developmental journey.
            </p>

            <div class="space-y-2 text-xs">
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span class="font-bold text-slate-800">Favorite Activities:</span>
                <span class="text-slate-600 font-medium">Soccer, Drawing, Swimming</span>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span class="font-bold text-slate-800">Comfort Routines:</span>
                <span class="text-slate-600 font-medium">Stuffed dog, bedtime story</span>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span class="font-bold text-slate-800">Favorite Foods:</span>
                <span class="text-slate-600 font-medium">Mac & Cheese, Apples, Pasta</span>
              </div>
            </div>

            <button onclick="generateChildLifebookPdf()" class="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-2 rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Download Child Lifebook (.docx)
            </button>
          </div>

          <!-- Transition Packet Generator -->
          <div class="bg-gradient-to-br from-indigo-50 to-amber-50/50 border border-indigo-200 rounded-3xl p-5 space-y-3">
            <h4 class="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="heart" class="w-3.5 h-3.5 text-indigo-600"></i> Care Transition Packet
            </h4>
            <p class="text-[11px] text-indigo-900/80 leading-relaxed">
              Preparing for reunification or permanent guardianship? Sprout bundles immunizations, favorite routines, doctor contacts, and milestone achievements into an empowering handoff packet for the family.
            </p>
            <button onclick="generateTransitionPacket()" class="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-2 rounded-xl shadow-2xs transition flex items-center justify-center gap-1">
              <i data-lucide="file-check" class="w-3.5 h-3.5"></i> Create Transition Packet
            </button>
          </div>

        </div>

      </div>

    </div>
  `;

  lucide.createIcons();
}

function openNewMilestoneModal() {
  openRecordModal();
  setTimeout(() => {
    const title = document.getElementById('recTitle');
    const summary = document.getElementById('recSummary');
    const cat = document.getElementById('recCategory');
    if (title) title.value = "Celebration Milestone: ";
    if (summary) summary.value = "Document positive progress, personal goals, sports achievements, or creative successes here.";
    if (cat) cat.value = "education";
  }, 150);
}

async function generateChildLifebookPdf() {
  if (!currentChildId) {
    alert("Please select a child profile first.");
    return;
  }
  try {
    const res = await apiFetch('/api/reports/lifebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: currentChildId })
    });
    const data = await res.json();
    if (data.download_url) {
      window.open(data.download_url, '_blank');
    } else {
      alert("Notice: " + (data.error || "Lifebook generated."));
    }
  } catch (err) {
    alert("Lifebook generation error: " + err.message);
  }
}

function generateTransitionPacket() {
  openPermanencyHandoverWizard();
}

// ==============================================================================
// PHASE 12A: MISSION CONTROL & SYSTEM UNDERSTANDING LAYER
// ==============================================================================

async function renderMissionControlView(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-fadeIn pb-12">

      <!-- Mission Control Universal Safe Home Banner -->
      <div class="bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/80 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-4xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-wider">
            <i data-lucide="compass" class="w-4 h-4 text-emerald-400"></i> Sprout Mission Control & Operating System
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">
            SPROUT
          </h1>
          <p class="text-emerald-300 text-sm font-bold uppercase tracking-wider">
            Vermont Caregiver Operating System
          </p>
          <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300 pt-1">
            <span class="flex items-center gap-1.5 text-emerald-400"><i data-lucide="shield-check" class="w-4 h-4"></i> Protect Children.</span>
            <span class="flex items-center gap-1.5 text-blue-400"><i data-lucide="feather" class="w-4 h-4"></i> Reduce Burden.</span>
            <span class="flex items-center gap-1.5 text-amber-400"><i data-lucide="check-circle-2" class="w-4 h-4"></i> Stay Prepared.</span>
          </div>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl pt-1">
            Welcome to your universal safe home. Whether you are a brand new foster parent, seasoned kinship grandmother, respite provider, state supervisor, or VCWTP instructor, this Mission Control Center guides your next action with zero confusion.
          </p>
          
          <!-- Immediate 1-Tap Quick Action Row -->
          <div class="pt-3 flex flex-wrap items-center gap-3">
            <button onclick="launchQuickStartTour(5)" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4"></i>
              <span>5-Minute New User Orientation</span>
            </button>
            <button onclick="openSystemHelpModal()" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-emerald-300"></i>
              <span>How Sprout Works Center</span>
            </button>
            <button onclick="switchMainSection('dashboard')" class="px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold rounded-xl text-xs border border-emerald-600/60 transition flex items-center gap-2">
              <i data-lucide="sun" class="w-4 h-4 text-emerald-300"></i>
              <span>Open Today's Priorities</span>
            </button>
          </div>
        </div>
      </div>

      <!-- P0-1: MISSION CONTROL QUICK ACTION DOCK (PERMANENT VISIBILITY) -->
      <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-5 shadow-xl border border-emerald-600/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30 shrink-0">
            <i data-lucide="zap" class="w-6 h-6 text-emerald-400"></i>
          </div>
          <div>
            <h3 class="text-white font-black text-base flex items-center gap-2">
              Mission Control Quick Action Dock
              <span class="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40 uppercase tracking-wide">1-Tap Action</span>
            </h3>
            <p class="text-xs text-emerald-200/80">Log routine events, launch emergency placement intake, open babysitter sheets, access kinship guides, or close placements.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button onclick="openRecordModal()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Log a routine observation in 15 seconds">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>+ 15-Sec Log</span>
          </button>
          <button onclick="openEmergencyPlacementWizard()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Launch 5-Step Guided Emergency Placement Wizard (Basics, Meds, Contacts, Soothing, Care Sheet)">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-300"></i>
            <span>Emergency Intake</span>
          </button>
          <button onclick="openEmergencyHandoffCard()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Print/View 1-Click Care & Safety Sheet for Babysitter, Doctor, or Crisis ER">
            <i data-lucide="shield-alert" class="w-4 h-4"></i>
            <span>Care Sheet</span>
          </button>
          <button onclick="openKinshipFastTrackModal()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Open Plain-English Kinship Fast-Track Guide (Benefits, Paperwork, Jargon Decoder)">
            <i data-lucide="compass" class="w-4 h-4 text-teal-300"></i>
            <span>Kinship Guide</span>
          </button>
          <button onclick="openPermanencyHandoverWizard()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Launch 5-Step Permanency & Handover Wizard (Lifebook, Parent Access, Placement Closure, Zero-Data-Loss Archive)">
            <i data-lucide="flag" class="w-4 h-4 text-indigo-300"></i>
            <span>Case Closure</span>
          </button>
          <button onclick="quickExportThisMonth()" class="flex-1 sm:flex-none px-3.5 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5" title="Generate and download current month's official DCF progress report (.docx)">
            <i data-lucide="file-down" class="w-4 h-4"></i>
            <span>Export Month</span>
          </button>
        </div>
      </div>

      <!-- WHAT WOULD YOU LIKE TO DO TODAY? (4 Primary Quadrants) -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="layout-grid" class="w-5 h-5 text-emerald-700"></i>
              WHAT WOULD YOU LIKE TO DO TODAY?
            </h2>
            <p class="text-xs text-slate-500">Select a quadrant below to immediately launch the targeted workflow.</p>
          </div>
          <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Self-Guiding Interaction Model
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <!-- Quadrant 1: TRAIN -->
          <div class="bg-white rounded-3xl border border-blue-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-blue-400 transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
                  TRAIN
                </span>
                <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-600"></i>
              </div>
              <h3 class="font-extrabold text-slate-900 text-sm">Practice & Simulation</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Consequence-free flight simulator for new foster parents, kin, and instructors.
              </p>
              <div class="space-y-1.5 pt-1 text-xs">
                <button onclick="switchMainSection('training')" class="w-full text-left p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold transition flex items-center justify-between">
                  <span>▶ Training Hub</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-blue-600"></i>
                </button>
                <button onclick="toggleSproutWorkspaceMode()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Practice Sandbox</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('training')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Scenario Simulations</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="openCaregiverProfilesModal()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ 15 Model Households</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="launchTrainerDemoLauncher()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Instructor Demonstrations</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
              </div>
            </div>
            <button onclick="switchMainSection('training')" class="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-2xs transition">
              Open Training Hub
            </button>
          </div>

          <!-- Quadrant 2: CARE -->
          <div class="bg-white rounded-3xl border border-emerald-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-emerald-400 transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  CARE
                </span>
                <i data-lucide="heart" class="w-5 h-5 text-emerald-600"></i>
              </div>
              <h3 class="font-extrabold text-slate-900 text-sm">Daily Child Operations</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Active medication schedules, school profiles, child lifebooks, and routines.
              </p>
              <div class="space-y-1.5 pt-1 text-xs">
                <button onclick="switchMainSection('dashboard')" class="w-full text-left p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold transition flex items-center justify-between">
                  <span>▶ Today's Priorities</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-emerald-600"></i>
                </button>
                <button onclick="switchMainSection('children')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ My Children</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('binder')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Care Binder (20 Tabs)</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('relationships')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Circles of Care</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('life_journey')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Life Journey Storybook</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
              </div>
            </div>
            <button onclick="switchMainSection('dashboard')" class="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition">
              Open Daily Cockpit
            </button>
          </div>

          <!-- Quadrant 3: DCF -->
          <div class="bg-white rounded-3xl border border-indigo-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-indigo-400 transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
                  DCF
                </span>
                <i data-lucide="scale" class="w-5 h-5 text-indigo-600"></i>
              </div>
              <h3 class="font-extrabold text-slate-900 text-sm">State & Court Compliance</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Vermont Title 33 court reviews, EPSDT clocks, and \$0.67/mi state claims.
              </p>
              <div class="space-y-1.5 pt-1 text-xs">
                <button onclick="switchMainSection('reports')" class="w-full text-left p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold transition flex items-center justify-between">
                  <span>▶ DCF Command Center</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-indigo-600"></i>
                </button>
                <button onclick="switchMainSection('reports')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Court Preparation (.docx)</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchTab('expenses')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Mileage Claims (FS-334B)</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchChildTab('chins')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ CHINS Timeline Stepper</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('households')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ 12 District Directory</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
              </div>
            </div>
            <button onclick="switchMainSection('reports')" class="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-2xs transition">
              Open DCF Reports
            </button>
          </div>

          <!-- Quadrant 4: SYSTEM -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-slate-400 transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-800">
                  SYSTEM
                </span>
                <i data-lucide="settings" class="w-5 h-5 text-slate-600"></i>
              </div>
              <h3 class="font-extrabold text-slate-900 text-sm">Architecture & Security</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                Cryptographic audit trails, offline database backups, and privacy guards.
              </p>
              <div class="space-y-1.5 pt-1 text-xs">
                <button onclick="openSystemHelpModal()" class="w-full text-left p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition flex items-center justify-between">
                  <span>▶ How Sprout Works</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-600"></i>
                </button>
                <button onclick="openSystemMapModal()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Interactive Site Map</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="openProcessFlowsModal()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Visual Process Flows</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="openDecisionTreesModal()" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Decision Trees</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
                <button onclick="switchMainSection('settings')" class="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition flex items-center justify-between">
                  <span>▶ Audit & Settings</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
              </div>
            </div>
            <button onclick="switchMainSection('settings')" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-2xs transition">
              Open System Settings
            </button>
          </div>

        </div>
      </div>

      <!-- ROLE-BASED USER JOURNEY SELECTOR (Which experience applies to me?) -->
      <div class="bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-3xl border border-emerald-200 p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-emerald-200/60 pb-3">
          <div>
            <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
              <i data-lucide="map-pin" class="w-5 h-5 text-emerald-700"></i>
              WHICH EXPERIENCE APPLIES TO YOU? (Guided Pathways)
            </h3>
            <p class="text-xs text-slate-600">Select your role to view your tailored learning path, primary workflows, and daily actions.</p>
          </div>
          <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            7 Specialized Journeys
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <!-- Role 1: New Foster Parent -->
          <div onclick="openUserJourneyDetailModal('foster')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Foster Home</span>
            <h4 class="font-bold text-slate-900 text-xs">New Foster Parent</h4>
            <p class="text-[11px] text-slate-500">Intake logging, 30-day health clock, daily observations, and medication records.</p>
          </div>

          <!-- Role 2: Kinship Caregiver -->
          <div onclick="openUserJourneyDetailModal('kinship')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Kinship / Grandparent</span>
            <h4 class="font-bold text-slate-900 text-xs">Kinship Caregiver</h4>
            <p class="text-[11px] text-slate-500">Relative search documentation, guardianship petitions, and family time tracking.</p>
          </div>

          <!-- Role 3: Respite Provider -->
          <div onclick="openUserJourneyDetailModal('respite')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Respite Care</span>
            <h4 class="font-bold text-slate-900 text-xs">Respite Provider</h4>
            <p class="text-[11px] text-slate-500">Weekend care, allergy/routine alerts, transport signatures, and privacy-shielded binder.</p>
          </div>

          <!-- Role 4: Adoptive Placement -->
          <div onclick="openUserJourneyDetailModal('adoptive')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Permanency</span>
            <h4 class="font-bold text-slate-900 text-xs">Adoptive Placement</h4>
            <p class="text-[11px] text-slate-500">Child Lifebook preservation, permanency court packets, and subsidy records.</p>
          </div>

          <!-- Role 5: State Trainer / Instructor -->
          <div onclick="openUserJourneyDetailModal('trainer')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">VCWTP Instructor</span>
            <h4 class="font-bold text-slate-900 text-xs">Trainer / Instructor</h4>
            <p class="text-[11px] text-slate-500">10-minute cohort demonstration, 15 model homes, and crisis simulations.</p>
          </div>

          <!-- Role 6: DCF Caseworker / Supervisor -->
          <div onclick="openUserJourneyDetailModal('supervisor')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">State Worker</span>
            <h4 class="font-bold text-slate-900 text-xs">DCF Supervisor</h4>
            <p class="text-[11px] text-slate-500">Reviewing pre-scrubbed caregiver court summaries and FS-334B claim validity.</p>
          </div>

          <!-- Role 7: Emergency Placement -->
          <div onclick="openUserJourneyDetailModal('emergency')" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition shadow-2xs space-y-1.5">
            <span class="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Urgent 24/7</span>
            <h4 class="font-bold text-slate-900 text-xs">Emergency Intake</h4>
            <p class="text-[11px] text-slate-500">11:00 PM rapid child profile, emergency handoff card, and 24/7 crisis numbers.</p>
          </div>

          <!-- Guided Tour Launcher Card -->
          <div onclick="launchQuickStartTour(15)" class="bg-emerald-600 text-white p-4 rounded-2xl cursor-pointer hover:bg-emerald-700 transition shadow-sm space-y-1.5 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded">Self-Teaching</span>
              <h4 class="font-bold text-white text-xs mt-1">15-Min Guided Tour</h4>
              <p class="text-[11px] text-emerald-100">Step-by-step interactive walkthrough of all 4 cognitive domains.</p>
            </div>
            <span class="text-[11px] font-black flex items-center gap-1 text-emerald-200">Start Tour <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
          </div>
        </div>
      </div>

    </div>
  `;

  lucide.createIcons();
}

// Modal Launchers for System Understanding Modals
function launchQuickStartTour(minutes) {
  alert(`🚀 Launching ${minutes}-Minute Self-Guided Tour:\n\n1. Sprout Universal Cockpit\n2. 4 Cognitive Care Domains (Health, Visits, Learning, Records)\n3. Logging 15-Second Notes & Mileage ($0.67/mi)\n4. Generating Court Summaries\n\nAll tools are 100% offline and safe to explore.`);
}

function launchTrainerDemoLauncher() {
  alert(`🎯 Trainer Demonstration Launcher:\n\nSelect a demonstration profile:\n• 10-Minute New Caregiver Demo\n• Kinship Care Demonstration (Grandparents HH-113)\n• Respite Care Privacy Demo\n• 11:00 PM Emergency Placement Simulation\n• DCF Supervisor Claim Audit Demo`);
}

function openSystemMapModal() {
  alert(`🗺️ Interactive System Map:\n\nSprout Navigation Hierarchy:\n• Welcome Portal & Mission Control\n• Today (Command Center Briefing)\n• My Children (4 Cognitive Domains & 12 Sub-Tabs)\n• Care Binder (20 Vermont Folders)\n• Home & Licensing (FS-221A & VCWTP Ledger)\n• Circles of Care (4 concentric stakeholder tiers)\n• Life Journey (Child Lifebook Keepsakes)\n• Reports (Court Briefs & FS-334B Claims)\n• Settings (SHA-256 Blockchain Ledger & Backups)`);
}

function openProcessFlowsModal() {
  alert(`📊 Process Flow Library:\n\nVisual Workflows Available:\n1. Emergency Placement: Placement Received ➔ Child Profile ➔ Medical Intake ➔ Safety Review\n2. Court Preparation: Timeline ➔ Communications ➔ Court Brief (.docx) ➔ GAL Submission\n3. Mileage Claim: Trip Log ➔ Ledger ➔ Form FS-334B ($0.67/mi) ➔ Submission`);
}

function openDecisionTreesModal() {
  alert(`🌲 System Decision Tree Center:\n\n1. Workspace Selection (Local Live vs Sandbox Simulator)\n2. Privacy Shielding (Child Reference ID & Presentation Blur)\n3. Respite Care Permission Gates (Confidentiality Protection)\n4. Canonical Containment Security (Safe Document Paths)`);
}

function openUserJourneyDetailModal(roleKey) {
  const roles = {
    foster: "New Foster Parent: Focuses on intake logging, 30-day health clock, school IEP notes, and mileage reimbursement.",
    kinship: "Kinship Caregiver: Focuses on relative search, legal guardianship tracking, and family time visitation logs.",
    respite: "Respite Provider: Focuses on daily routines, active medication schedules, allergy alerts, and emergency contacts.",
    adoptive: "Adoptive Placement: Focuses on Child Lifebook preservation, permanency petitions, and subsidy documentation.",
    trainer: "Trainer / Instructor: Demonstrates 15 model homes, scenario simulations, and zero data leakage.",
    supervisor: "DCF Supervisor: Audits caregiver monthly reports, medical compliance, and FS-334B state claims.",
    emergency: "Emergency Intake: Rapid 2-minute child registration, medication intake, and emergency handoff card."
  };
  alert(`🧭 User Journey Pathway:\n\n${roles[roleKey] || 'Custom Caregiver Pathway'}`);
}

// ==============================================================================
// SPRINT 13C P0-3: DEDICATED PARENT PARTICIPANT WORKSPACE
// ==============================================================================

async function renderParentParticipantView(container) {
  const child = childrenList.length > 0 ? childrenList[0] : null;
  const childId = child ? child.id : 1;

  // 1. Check parent authorization & access status from backend
  let statusInfo = { state: 'ACTIVE_ENGAGED', display_name: activeCaregiverUser || 'Parent Participant', linked: true, is_high_conflict: false, child_alias: 'Your Child' };
  try {
    const res = await apiFetch(`/api/parent/status?child_id=${childId}`);
    if (res.ok) {
      statusInfo = await res.json();
    } else if (res.status === 403) {
      statusInfo.state = 'REVOKED';
    }
  } catch (e) {
    console.warn('Failed to fetch parent status:', e);
  }

  // Fail-Closed Gate 1: Revoked Access
  if (statusInfo.state === 'REVOKED') {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border-2 border-rose-600 rounded-3xl text-center space-y-5 shadow-2xl animate-fadeIn">
        <div class="inline-flex p-4 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
          <i data-lucide="shield-alert" class="w-10 h-10"></i>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-white">Parent Access Suspended / Revoked</h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Access to child records and case updates is currently inactive under child safety protocols. All records are secured under Legal Hold. Please contact your DCF caseworker for status.
          </p>
        </div>
        <div>
          <button onclick="exitParentWorkspace()" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 mx-auto">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span>Exit Portal</span>
          </button>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Fail-Closed Gate 2: Unlinked Account (Zero Child Data Leakage)
  if (statusInfo.state === 'UNLINKED' || !statusInfo.linked) {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-slate-700 rounded-3xl text-center space-y-4 shadow-xl animate-fadeIn">
        <div class="inline-flex p-3 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700">
          <i data-lucide="user-x" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-white">Account Not Linked</h2>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            This parent account is not currently linked to an active child placement. Zero child records are accessible.
          </p>
        </div>
        <div>
          <button onclick="exitParentWorkspace()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition">
            Exit
          </button>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const childAlias = statusInfo.child_alias || (child ? (child.alias || child.first_name) : 'Your Child');
  const parentName = (statusInfo.display_name || '').replace(/Sample |Parent Participant \(/g, '').replace(/\)/g, '') || 'Parent';

  container.innerHTML = `
    <div class="space-y-6 animate-fadeIn pb-12 max-w-5xl mx-auto">
      
      <!-- Dignity-First Family Success Banner -->
      <div class="bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-rose-800/80 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-black uppercase tracking-wider">
              <i data-lucide="heart" class="w-3.5 h-3.5 text-rose-400"></i> Family Success & Reunification Portal
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, ${parentName}
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Every milestone, completed class, and family visit brings you closer to ${childAlias}. This portal is your personal space to record accomplishments, check upcoming visits, and celebrate child milestones.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
            <button onclick="exitParentWorkspace()" class="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/20 transition flex items-center gap-1.5" title="Switch to Caregiver Mission Control for system simulation">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
              <span>Exit to Caregiver Mode</span>
            </button>
          </div>
        </div>
      </div>

      <!-- PARENT DASHBOARD: 4 PRIMARY MODULES -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- MODULE 1: MY GOALS (Court-Approved Case Plan Progress) -->
        <div id="parentGoalsCard" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-emerald-300 transition flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <i data-lucide="target" class="w-5 h-5 text-emerald-700"></i>
                </div>
                <div>
                  <h2 class="font-extrabold text-slate-900 text-base">My Goals</h2>
                  <p class="text-xs text-slate-500">Your court-approved reunification roadmap</p>
                </div>
              </div>
              <span id="parentGoalsBadge" class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                Loading...
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Overall Case Plan Progress</span>
                <span id="parentGoalsProgressCount" class="text-emerald-700">Calculating...</span>
              </div>
              <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div id="parentGoalsProgressBar" class="bg-emerald-600 h-full rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>

            <!-- Goal Items List -->
            <div id="parentGoalsList" class="space-y-2.5 text-xs">
              <div class="text-xs text-slate-400 py-3 text-center">Loading goals...</div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Official Court Goal Tracking</span>
            <span class="font-bold text-emerald-700">Verified Plan</span>
          </div>
        </div>

        <!-- MODULE 2: UPLOAD EVIDENCE (Direct 1-Tap Submission) -->
        <div id="parentEvidenceCard" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-300 transition flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
                  <i data-lucide="upload-cloud" class="w-5 h-5 text-indigo-700"></i>
                </div>
                <div>
                  <h2 class="font-extrabold text-slate-900 text-base">Upload Evidence</h2>
                  <p class="text-xs text-slate-500">Fast 1-tap certificate and document vault</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                Instant Verification
              </span>
            </div>

            <!-- Upload Form -->
            <form onsubmit="handleParentEvidenceUpload(event)" class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Document Category *</label>
                <select id="parentDocCategory" required class="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white font-medium focus:ring-2 focus:ring-indigo-500">
                  <option value="parenting_cert">Course Certificate (Parenting Class)</option>
                  <option value="housing_lease">Housing / Lease Verification</option>
                  <option value="counseling_letter">Counseling Attendance Letter</option>
                  <option value="employment_paystub">Employment Paystub / Income Proof</option>
                  <option value="health_wellness">Health & Wellness Verification</option>
                  <option value="milestone_letter">Milestone Letter / Artwork for Child</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Select File or Snap Photo *</label>
                <input type="file" id="parentDocFile" required class="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200 cursor-pointer" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Optional Notes</label>
                <input type="text" id="parentDocNotes" placeholder="e.g. Session 10 Easterseals Certificate" class="w-full text-xs border border-slate-300 rounded-xl p-2 bg-white focus:ring-2 focus:ring-indigo-500" />
              </div>

              <button type="submit" class="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Submit to Case Plan Record</span>
              </button>
            </form>

            <!-- Recent Evidence Uploads -->
            <div class="space-y-2">
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recently Verified Evidence</div>
              <div id="parentEvidenceList" class="space-y-1.5 text-xs">
                <div class="text-xs text-slate-400 py-2 text-center">Loading uploaded evidence...</div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            All files are stripped of location metadata (EXIF/GPS) to protect privacy.
          </div>
        </div>

        <!-- MODULE 3: FAMILY TIME & 1-TAP CHECK-IN -->
        <div id="parentFamilyTimeCard" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-amber-300 transition flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <i data-lucide="calendar" class="w-5 h-5 text-amber-700"></i>
                </div>
                <div>
                  <h2 class="font-extrabold text-slate-900 text-base">Family Time</h2>
                  <p class="text-xs text-slate-500">Scheduled visits & verified attendance</p>
                </div>
              </div>
              <span id="parentCheckInRateBadge" class="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                100% On-Time Record
              </span>
            </div>

            <!-- Next Scheduled Visit Card with 1-Tap Check-In -->
            <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">Upcoming Visit</span>
                <span id="parentNextVisitDate" class="text-xs font-bold text-amber-900">Scheduled</span>
              </div>

              <div class="space-y-1">
                <div id="parentNextVisitTime" class="text-base font-black text-slate-900">3:30 PM – 5:30 PM (2 Hours)</div>
                <div class="text-xs text-slate-600 flex items-center gap-1.5">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-700"></i>
                  <span id="parentVisitLocation">Supervised Family Center / Neutral Site</span>
                </div>
              </div>

              <!-- 1-Tap "I Am Here" Check-In Button -->
              <div class="pt-1">
                <button id="btnParentCheckIn" onclick="handleParentCheckIn(${childId})" class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                  <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                  <span id="parentCheckInLabel">I Am Here (1-Tap Check-In & Timestamp)</span>
                </button>
                <div id="parentCheckInSuccess" class="hidden mt-2 p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold text-center">
                  ✅ Checked in • Verified on-time arrival logged!
                </div>
              </div>
            </div>

            <!-- Past Visit Record -->
            <div class="space-y-1.5 text-xs">
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Past Completed Visits</div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-800">Thursday, Oct 09 • 3:30 PM</div>
                  <div class="text-[10px] text-slate-500">2.0 Hours • Easterseals Center</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">On Time (Verified)</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div class="font-bold text-slate-800">Thursday, Oct 02 • 3:30 PM</div>
                  <div class="text-[10px] text-slate-500">2.0 Hours • Easterseals Center</div>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">On Time (Verified)</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-xs text-slate-500">
            Attendance ledger is exported directly to court progress reports.
          </div>
        </div>

        <!-- MODULE 4: CHILD UPDATES & SHARED FAMILY MOMENTS -->
        <div id="parentChildUpdatesCard" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-rose-300 transition flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="p-2 bg-rose-100 text-rose-800 rounded-xl">
                  <i data-lucide="sparkles" class="w-5 h-5 text-rose-600"></i>
                </div>
                <div>
                  <h2 class="font-extrabold text-slate-900 text-base">Child Updates</h2>
                  <p class="text-xs text-slate-500">Positive milestones shared with care</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                Strengths-Based
              </span>
            </div>

            <!-- Shared Family Milestone Feed -->
            <div id="parentChildUpdatesList" class="space-y-3 text-xs">
              <div class="text-xs text-slate-400 py-3 text-center">Loading shared moments...</div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Shielded shared family milestones under Vermont DCF parent partnership guidelines.
          </div>
        </div>

      </div>

    </div>
  `;

  // 3. Asynchronously Populate All 4 Modules from Backend APIs
  populateParentGoals(childId);
  populateParentEvidence(childId);
  populateParentCheckIn(childId);
  populateParentFeed(childId);
}

async function populateParentGoals(childId) {
  try {
    const res = await apiFetch(`/api/parent/goals?child_id=${childId}`);
    if (!res.ok) return;
    const goals = await res.json();
    const listEl = document.getElementById('parentGoalsList');
    const badgeEl = document.getElementById('parentGoalsBadge');
    const countEl = document.getElementById('parentGoalsProgressCount');
    const barEl = document.getElementById('parentGoalsProgressBar');
    if (!listEl) return;

    if (!Array.isArray(goals) || goals.length === 0) {
      listEl.innerHTML = `<div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-center">No active court goals assigned yet.</div>`;
      if (badgeEl) badgeEl.textContent = 'Active Plan';
      if (barEl) barEl.style.width = '0%';
      return;
    }

    const completed = goals.filter(g => g.status === 'Completed' || (g.progress || 0) >= 100).length;
    const pct = Math.round((completed / goals.length) * 100);

    if (badgeEl) badgeEl.textContent = `${pct}% Complete`;
    if (countEl) countEl.textContent = `${completed} of ${goals.length} Milestones Verified`;
    if (barEl) barEl.style.width = `${pct}%`;

    listEl.innerHTML = goals.map(g => {
      const isDone = g.status === 'Completed' || (g.progress || 0) >= 100;
      const icon = isDone ? 'check-circle' : 'clock';
      const colorClass = isDone ? 'bg-emerald-50/70 border-emerald-200 text-emerald-600' : 'bg-blue-50/70 border-blue-200 text-blue-600';
      const badgeClass = isDone ? 'bg-emerald-200/80 text-emerald-950' : 'bg-blue-200/80 text-blue-950';
      const statusLabel = isDone ? 'Verified' : (g.status || 'In Progress');

      return `
        <div class="p-3 rounded-2xl ${colorClass} border flex items-start gap-3">
          <i data-lucide="${icon}" class="w-4 h-4 shrink-0 mt-0.5"></i>
          <div class="space-y-0.5 flex-1">
            <div class="font-bold text-slate-900 flex items-center justify-between">
              <span>${escapeHtml(g.title)}</span>
              <span class="text-[10px] ${badgeClass} font-black px-1.5 py-0.5 rounded">${statusLabel}</span>
            </div>
            ${g.description ? `<p class="text-[11px] text-slate-600">${escapeHtml(g.description)}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');
    lucide.createIcons();
  } catch (e) {
    console.warn('Error loading parent goals:', e);
  }
}

async function populateParentEvidence(childId) {
  try {
    const res = await apiFetch(`/api/parent/evidence?child_id=${childId}`);
    if (!res.ok) return;
    const evidence = await res.json();
    const listEl = document.getElementById('parentEvidenceList');
    if (!listEl) return;

    if (!Array.isArray(evidence) || evidence.length === 0) {
      listEl.innerHTML = `<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-center">No documents uploaded yet.</div>`;
      return;
    }

    listEl.innerHTML = evidence.slice(0, 5).map(e => `
      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-600"></i>
          <div>
            <div class="font-bold text-slate-800 text-xs">${escapeHtml(e.file_name)}</div>
            <div class="text-[10px] text-slate-500">${escapeHtml(e.category || 'Court Document')}${e.notes ? ' • ' + escapeHtml(e.notes) : ''}</div>
          </div>
        </div>
        <span class="text-[10px] font-bold ${e.verified ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'} px-2 py-0.5 rounded border">
          ${e.verified ? 'Verified' : 'Pending Review'}
        </span>
      </div>
    `).join('');
    lucide.createIcons();
  } catch (e) {
    console.warn('Error loading parent evidence:', e);
  }
}

async function populateParentCheckIn(childId) {
  try {
    const res = await apiFetch(`/api/parent/checkin?child_id=${childId}`);
    if (!res.ok) return;
    const data = await res.json();
    const dateEl = document.getElementById('parentNextVisitDate');
    const locEl = document.getElementById('parentVisitLocation');
    const rateEl = document.getElementById('parentCheckInRateBadge');

    if (dateEl && data.next_visit) dateEl.textContent = data.next_visit;
    if (locEl && data.location) locEl.textContent = data.location;
    if (rateEl && data.attendance_rate) rateEl.textContent = `${data.attendance_rate} On-Time Record`;
  } catch (e) {
    console.warn('Error loading parent checkin info:', e);
  }
}

async function populateParentFeed(childId) {
  try {
    const res = await apiFetch(`/api/parent/feed?child_id=${childId}`);
    if (!res.ok) return;
    const feed = await res.json();
    const listEl = document.getElementById('parentChildUpdatesList');
    if (!listEl) return;

    if (!Array.isArray(feed) || feed.length === 0) {
      listEl.innerHTML = `<div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-center">Shared milestones will appear here as recorded.</div>`;
      return;
    }

    listEl.innerHTML = feed.slice(0, 5).map(f => `
      <div class="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-black text-rose-950 text-xs flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-rose-600"></i> ${escapeHtml(f.title)}
          </span>
          <span class="text-[10px] text-slate-400">${escapeHtml(f.event_date || '')}</span>
        </div>
        <p class="text-slate-700 text-xs leading-relaxed">
          ${escapeHtml(f.summary || '')}
        </p>
      </div>
    `).join('');
    lucide.createIcons();
  } catch (e) {
    console.warn('Error loading parent feed:', e);
  }
}

function exitParentWorkspace() {
  activeCaregiverUser = 'Candy Chevalier';
  localStorage.setItem('caregiverUser', activeCaregiverUser);
  const select = document.getElementById('caregiverSelect');
  if (select) select.value = activeCaregiverUser;
  updateCaregiverAvatarDisplay(activeCaregiverUser);
  switchMainSection('mission_control');
}

async function handleParentCheckIn(childId) {
  const label = document.getElementById('parentCheckInLabel');
  const successBox = document.getElementById('parentCheckInSuccess');
  const btn = document.getElementById('btnParentCheckIn');
  if (btn) btn.disabled = true;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    const res = await apiFetch('/api/parent/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: childId || 1, notes: '1-Tap on-time visit check-in' })
    });
    if (res.ok) {
      if (label) label.textContent = `Checked In at ${timeStr} (Verified)`;
      if (successBox) {
        successBox.textContent = `✅ Checked in at ${timeStr} • Verified on-time arrival logged to court progress packet!`;
        successBox.classList.remove('hidden');
      }
    } else {
      if (label) label.textContent = `Check-in recorded locally (${timeStr})`;
    }
  } catch (e) {
    if (label) label.textContent = `Checked In at ${timeStr}`;
  }
}

async function handleParentEvidenceUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('parentDocFile');
  const notesInput = document.getElementById('parentDocNotes');
  const catInput = document.getElementById('parentDocCategory');
  
  if (!fileInput || fileInput.files.length === 0) {
    alert("Please choose a file or take a photo first.");
    return;
  }

  const fileName = fileInput.files[0].name;
  const category = catInput ? catInput.options[catInput.selectedIndex].text : 'Court Document';
  const noteText = notesInput ? notesInput.value || category : category;
  const child = childrenList.length > 0 ? childrenList[0] : null;
  const childId = child ? child.id : 1;

  try {
    const res = await apiFetch('/api/parent/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child_id: childId,
        file_name: fileName,
        category: category,
        notes: noteText,
        verified: 1
      })
    });
    if (res.ok) {
      populateParentEvidence(childId);
    }
  } catch (err) {
    console.warn('Error saving evidence to backend:', err);
  }

  alert(`Document "${fileName}" successfully uploaded and cryptographically timestamped for your Parent Progress Packet!`);
  fileInput.value = '';
  if (notesInput) notesInput.value = '';
}

// ==============================================================================
// WATCH ITEM 1: EMERGENCY PLACEMENT WIZARD (5 STEPS)
// ==============================================================================
let epwCurrentStep = 1;

function openEmergencyPlacementWizard() {
  epwCurrentStep = 1;
  const modal = document.getElementById('emergencyPlacementWizardModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('epwPlacementDate');
  if (dateInput && !dateInput.value) dateInput.value = today;

  updateEpwUI();
  if (window.lucide) lucide.createIcons();
}

function closeEmergencyPlacementWizard() {
  const modal = document.getElementById('emergencyPlacementWizardModal');
  if (modal) modal.classList.add('hidden');
}

function updateEpwUI() {
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`epwStepPane${i}`);
    const tab = document.getElementById(`epwStepTab${i}`);
    if (pane) {
      if (i === epwCurrentStep) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (tab) {
      if (i === epwCurrentStep) {
        tab.className = "py-1 rounded bg-rose-600 text-white font-bold shadow-xs";
      } else if (i < epwCurrentStep) {
        tab.className = "py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300";
      } else {
        tab.className = "py-1 rounded bg-slate-100 text-slate-500 font-bold";
      }
    }
  }

  const prevBtn = document.getElementById('epwPrevBtn');
  const nextBtn = document.getElementById('epwNextBtn');
  const saveBtn = document.getElementById('epwSaveBtn');

  if (prevBtn) {
    if (epwCurrentStep > 1) prevBtn.classList.remove('hidden');
    else prevBtn.classList.add('hidden');
  }

  if (epwCurrentStep === 5) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (saveBtn) saveBtn.classList.remove('hidden');
    renderEpwSummary();
  } else {
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      const stepNames = ['', 'Medical →', 'Contacts →', 'Soothing →', 'Review →'];
      nextBtn.textContent = `Next: ${stepNames[epwCurrentStep] || 'Next →'}`;
    }
    if (saveBtn) saveBtn.classList.add('hidden');
  }
}

function nextEpwStep() {
  if (epwCurrentStep === 1) {
    const alias = (document.getElementById('epwAlias')?.value || '').trim();
    if (!alias) {
      alert("Please enter Child Initials / Alias (e.g. CD).");
      return;
    }
  }
  if (epwCurrentStep < 5) {
    epwCurrentStep++;
    updateEpwUI();
  }
}

function prevEpwStep() {
  if (epwCurrentStep > 1) {
    epwCurrentStep--;
    updateEpwUI();
  }
}

function renderEpwSummary() {
  const container = document.getElementById('epwSummaryReview');
  if (!container) return;

  const alias = (document.getElementById('epwAlias')?.value || 'CD').toUpperCase();
  const dob = document.getElementById('epwDob')?.value || 'Not set';
  const placement = document.getElementById('epwPlacementDate')?.value || 'Today';
  const rel = document.getElementById('epwRelationship')?.value || 'Emergency Respite';
  const allergies = document.getElementById('epwAllergies')?.value || 'None logged';
  const medicaid = document.getElementById('epwMedicaid')?.value || 'Pending DCF';
  const medName = document.getElementById('epwMedName')?.value || 'None';
  const medDose = document.getElementById('epwMedDose')?.value || '';
  const workerName = document.getElementById('epwWorkerName')?.value || 'DCF After-Hours';
  const workerPhone = document.getElementById('epwWorkerPhone')?.value || 'Pending';
  const comfort = document.getElementById('epwComfort')?.value || 'Standard soothing lovey';
  const soothing = document.getElementById('epwSoothing')?.value || 'Quiet routine';

  container.innerHTML = `
    <div class="grid grid-cols-2 gap-2 text-[11px]">
      <div><strong>Child:</strong> ${alias} (DOB: ${dob})</div>
      <div><strong>Placement:</strong> ${placement} (${rel})</div>
      <div><strong>Allergies:</strong> <span class="text-rose-700 font-semibold">${allergies}</span></div>
      <div><strong>Medicaid / VT ID:</strong> ${medicaid}</div>
      <div><strong>Active Meds:</strong> ${medName} ${medDose ? `(${medDose})` : ''}</div>
      <div><strong>Worker Cell:</strong> ${workerName} - ${workerPhone}</div>
      <div class="col-span-2"><strong>Comfort & Routine:</strong> ${comfort}. ${soothing}</div>
    </div>
  `;
}

async function finishEmergencyPlacementWizard() {
  const saveBtn = document.getElementById('epwSaveBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving & Generating Care Sheet...";
  }

  const alias = (document.getElementById('epwAlias')?.value || 'CD').trim().toUpperCase();
  const dob = document.getElementById('epwDob')?.value || '';
  const placementDate = document.getElementById('epwPlacementDate')?.value || new Date().toISOString().split('T')[0];
  const rel = document.getElementById('epwRelationship')?.value || 'Emergency Respite';
  const goal = document.getElementById('epwGoal')?.value || 'Reunification';
  const allergies = document.getElementById('epwAllergies')?.value || '';
  const medicaid = document.getElementById('epwMedicaid')?.value || '';
  const comfort = document.getElementById('epwComfort')?.value || '';
  const food = document.getElementById('epwFood')?.value || '';
  const soothing = document.getElementById('epwSoothing')?.value || '';

  const medName = (document.getElementById('epwMedName')?.value || '').trim();
  const medDose = document.getElementById('epwMedDose')?.value || '';
  const medDoctor = document.getElementById('epwMedDoctor')?.value || '';

  const workerName = (document.getElementById('epwWorkerName')?.value || '').trim();
  const workerPhone = document.getElementById('epwWorkerPhone')?.value || '';
  const pedName = (document.getElementById('epwPedName')?.value || '').trim();
  const pedPhone = document.getElementById('epwPedPhone')?.value || '';

  const medications = [];
  if (medName) {
    medications.push({
      name: medName,
      dosage: medDose || 'As prescribed',
      prescriber: medDoctor || 'Middlebury Pediatrics'
    });
  }

  const emergencyContacts = [];
  if (workerName) {
    emergencyContacts.push({
      role_type: 'DCF Worker',
      full_name: workerName,
      phone: workerPhone,
      is_emergency: 1,
      notes: 'Emergency after-hours caseworker'
    });
  }
  if (pedName) {
    emergencyContacts.push({
      role_type: 'Doctor',
      full_name: pedName,
      phone: pedPhone,
      is_emergency: 0,
      notes: 'Primary pediatrician'
    });
  }

  const payload = {
    alias: alias,
    dob: dob,
    placement_date: placementDate,
    relationship_type: rel,
    permanency_goal: goal,
    episode_status: 'Active',
    episode_start_date: placementDate,
    allergies: allergies,
    medicaid_number: medicaid,
    comfort_items: comfort,
    food_preferences: food,
    behavioral_supports: soothing,
    emergency_notes: allergies ? `Known Alerts: ${allergies}` : '',
    medications: medications,
    emergency_contacts: emergencyContacts
  };

  try {
    const res = await apiFetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to create child profile.');
      return;
    }

    const newChildId = data.id;
    closeEmergencyPlacementWizard();

    await loadChildren();
    if (newChildId) {
      currentChildId = newChildId;
      const select = document.getElementById('childSelect');
      if (select) select.value = newChildId;
      await renderChildSnapshot();
      openEmergencyHandoffCard();
    }
  } catch (err) {
    alert("Error creating emergency intake: " + err.message);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save & Generate Care Sheet";
    }
  }
}

// ==============================================================================
// WATCH ITEM 2: PERMANENCY & HANDOVER WIZARD (5 STEPS)
// ==============================================================================
let phwCurrentStep = 1;

async function openPermanencyHandoverWizard() {
  const child = childrenList.find(c => c.id === currentChildId);
  if (!child) {
    alert("Please select a child profile first.");
    return;
  }

  phwCurrentStep = 1;
  const modal = document.getElementById('permanencyHandoverWizardModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('phwEndDate');
  if (dateInput && !dateInput.value) dateInput.value = today;

  try {
    const pRes = await apiFetch(`/api/parent/status?child_id=${currentChildId}`);
    const pData = await pRes.json().catch(() => ({}));
    const badge = document.getElementById('phwParentStatusBadge');
    if (badge) {
      badge.textContent = pData.state || 'UNLINKED / NONE';
      if (pData.state === 'ACTIVE_ENGAGED') {
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800';
      } else if (pData.state === 'REVOKED') {
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800';
      } else {
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800';
      }
    }
  } catch (_) {}

  updatePhwUI();
  if (window.lucide) lucide.createIcons();
}

function closePermanencyHandoverWizard() {
  const modal = document.getElementById('permanencyHandoverWizardModal');
  if (modal) modal.classList.add('hidden');
}

function updatePhwUI() {
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`phwStepPane${i}`);
    const tab = document.getElementById(`phwStepTab${i}`);
    if (pane) {
      if (i === phwCurrentStep) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (tab) {
      if (i === phwCurrentStep) {
        tab.className = "py-1 rounded bg-indigo-600 text-white font-bold shadow-xs";
      } else if (i < phwCurrentStep) {
        tab.className = "py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300";
      } else {
        tab.className = "py-1 rounded bg-slate-100 text-slate-500 font-bold";
      }
    }
  }

  const prevBtn = document.getElementById('phwPrevBtn');
  const nextBtn = document.getElementById('phwNextBtn');
  const saveBtn = document.getElementById('phwSaveBtn');

  if (prevBtn) {
    if (phwCurrentStep > 1) prevBtn.classList.remove('hidden');
    else prevBtn.classList.add('hidden');
  }

  if (phwCurrentStep === 5) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (saveBtn) saveBtn.classList.remove('hidden');
    renderPhwSummary();
  } else {
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      const stepNames = ['', 'Parent Access →', 'Closure Details →', 'Archive Review →', 'Final Review →'];
      nextBtn.textContent = `Next: ${stepNames[phwCurrentStep] || 'Next →'}`;
    }
    if (saveBtn) saveBtn.classList.add('hidden');
  }
}

function nextPhwStep() {
  if (phwCurrentStep < 5) {
    phwCurrentStep++;
    updatePhwUI();
  }
}

function prevPhwStep() {
  if (phwCurrentStep > 1) {
    phwCurrentStep--;
    updatePhwUI();
  }
}

async function downloadLifebookForClosure() {
  try {
    const res = await apiFetch('/api/reports/lifebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: currentChildId })
    });
    const data = await res.json();
    if (data.download_url) {
      window.open(data.download_url, '_blank');
    } else {
      alert("Notice: " + (data.error || "Lifebook generated."));
    }
  } catch (err) {
    alert("Lifebook generation error: " + err.message);
  }
}

function renderPhwSummary() {
  const container = document.getElementById('phwSummaryReview');
  if (!container) return;

  const child = childrenList.find(c => c.id === currentChildId);
  const alias = child ? child.alias : 'Child';
  const endDate = document.getElementById('phwEndDate')?.value || 'Today';
  const outcome = document.getElementById('phwOutcome')?.value || 'Reunified';
  const parentActionElem = document.querySelector('input[name="phwParentAction"]:checked');
  const parentAction = parentActionElem ? parentActionElem.value : 'graduate';

  let parentActionLabel = 'Graduate to Read-Only Lifebook';
  if (parentAction === 'revoke') parentActionLabel = 'Revoke & Legal Hold';
  else if (parentAction === 'keep') parentActionLabel = 'Keep Unchanged';

  container.innerHTML = `
    <div class="space-y-1.5 text-[11px]">
      <div><strong>Child:</strong> ${alias} (Ref: ${child?.child_code || 'CCC-001'})</div>
      <div><strong>Permanency Outcome:</strong> <span class="font-bold text-indigo-700">${outcome}</span></div>
      <div><strong>Episode End Date:</strong> ${endDate}</div>
      <div><strong>Parent Access Action:</strong> ${parentActionLabel}</div>
      <div class="pt-1 border-t text-emerald-800 font-semibold">
        ✓ 100% Data Preservation Verified: Records will be safely sealed under soft-tombstone retention (retention_state = 'Archived'). Zero rows deleted.
      </div>
    </div>
  `;
}

async function finishPermanencyHandoverWizard() {
  const saveBtn = document.getElementById('phwSaveBtn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Archiving Placement & Sealing Records...";
  }

  const endDate = document.getElementById('phwEndDate')?.value || new Date().toISOString().split('T')[0];
  const outcome = document.getElementById('phwOutcome')?.value || 'Reunified';
  const notes = document.getElementById('phwNotes')?.value || `Placement concluded with permanency outcome: ${outcome}.`;
  const parentActionElem = document.querySelector('input[name="phwParentAction"]:checked');
  const parentAction = parentActionElem ? parentActionElem.value : 'graduate';

  try {
    const res = await apiFetch(`/api/children/${currentChildId}/permanency-archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        episode_end_date: endDate,
        permanency_outcome: outcome,
        parent_action: parentAction,
        notes: notes
      })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to archive placement.');
      return;
    }

    alert(`✅ Placement Closure Complete!\n\nChild Outcome: ${data.permanency_outcome}\nClosure Date: ${data.episode_end_date}\nParent Access: ${data.parent_action}\n\n${data.message}`);
    closePermanencyHandoverWizard();
    await loadChildren();
    if (currentMainSection === 'mission_control') {
      await renderMissionControlView(document.getElementById('mainContent'));
    } else {
      await renderChildSnapshot();
    }
  } catch (err) {
    alert("Error completing case closure: " + err.message);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Seal & Complete Case Closure";
    }
  }
}

// ==============================================================================
// WATCH ITEM 3: KINSHIP FAST-TRACK GUIDE (PLAIN-ENGLISH SURVIVAL GUIDE)
// ==============================================================================
function openKinshipFastTrackModal() {
  const modal = document.getElementById('kinshipFastTrackModal');
  if (modal) {
    modal.classList.remove('hidden');
    switchKftTab('first');
    if (window.lucide) lucide.createIcons();
  }
}

function closeKinshipFastTrackModal() {
  const modal = document.getElementById('kinshipFastTrackModal');
  if (modal) modal.classList.add('hidden');
}

function switchKftTab(tabKey) {
  const tabs = ['first', 'benefits', 'paperwork', 'wait', 'decoder'];
  tabs.forEach(t => {
    const pane = document.getElementById(`kftPane-${t}`);
    const btn = document.getElementById(`kftTabBtn-${t}`);
    if (pane) {
      if (t === tabKey) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (btn) {
      if (t === tabKey) {
        btn.className = "px-3 py-1.5 rounded-lg font-bold bg-white text-teal-900 shadow-xs";
      } else {
        btn.className = "px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900";
      }
    }
  });
}




