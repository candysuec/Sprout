let currentChildId = null;
let currentTab = 'dashboard';
let childrenList = [];

// Sprout Environment State ('' = Unselected [Default Welcome Portal], 'sample' = Dev Sandbox, 'local' = Local Live Data)
let currentSproutMode = localStorage.getItem('sproutMode') || '';

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

// Initialize app on load
document.addEventListener('DOMContentLoaded', async () => {
  const subNav = document.getElementById('childWorkspaceSubNav');
  if (subNav) subNav.classList.add('hidden');

  const sproutSelect = document.getElementById('sproutModeSelect');
  if (sproutSelect) {
    sproutSelect.value = currentSproutMode;
  }

  populateCaregiverDropdown();
  updateSproutTheme();

  await loadChildren();
  lucide.createIcons();
  
  // Set default date picker to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('recDate');
  if (dateInput) dateInput.value = today;
});

function updateSproutTheme() {
  const header = document.getElementById('topHeader');
  const isSample = currentSproutMode === 'sample';
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

function onSproutModeChange() {
  const sproutSelect = document.getElementById('sproutModeSelect');
  if (sproutSelect) {
    currentSproutMode = sproutSelect.value;
    if (currentSproutMode) {
      localStorage.setItem('sproutMode', currentSproutMode);
    } else {
      localStorage.removeItem('sproutMode');
    }
  }
  
  // Reset caregiver selection to unselected prompt upon mode switch
  activeCaregiverUser = '';
  localStorage.removeItem('caregiverUser');

  populateCaregiverDropdown();
  updateSproutTheme();
  loadChildren();
  loadTabContent();
}

function resetToHomeLanding() {
  currentSproutMode = '';
  activeCaregiverUser = '';
  localStorage.removeItem('sproutMode');
  localStorage.removeItem('caregiverUser');

  const sproutSelect = document.getElementById('sproutModeSelect');
  if (sproutSelect) sproutSelect.value = '';

  const caregiverSelect = document.getElementById('caregiverSelect');
  if (caregiverSelect) caregiverSelect.value = '';

  populateCaregiverDropdown();
  updateSproutTheme();
  loadChildren();
  loadTabContent();
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

  // Placeholder Prompt Option: "-- Select Caregiver User --"
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = currentSproutMode === 'local' ? '-- Select Caregiver User --' : '-- Select Sample Caregiver --';
  defaultOpt.className = 'bg-slate-800 text-slate-400 italic';
  select.appendChild(defaultOpt);

  list.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    opt.className = 'bg-slate-800 text-white';
    select.appendChild(opt);
  });

  // Verify activeCaregiverUser is in list, else set to empty
  const exists = list.some(c => c.id === activeCaregiverUser);
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
  await loadChildren();
  if (currentMainSection === 'households' || currentMainSection === 'children' || currentMainSection === 'dashboard') {
    switchMainSection(currentMainSection);
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
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i> 30-Day Health Clock
            </div>
            <div class="text-xs font-bold text-emerald-900 mt-0.5">Compliant (Exam on File)</div>
          </div>
        `;
      } else if (daysRemaining >= 0) {
        const urgencyColor = daysRemaining <= 7 ? 'bg-rose-50 border-rose-300 text-rose-900' : (daysRemaining <= 15 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-sky-50 border-sky-300 text-sky-900');
        const iconColor = daysRemaining <= 7 ? 'text-rose-600' : (daysRemaining <= 15 ? 'text-amber-600' : 'text-sky-600');
        healthClockHtml = `
          <div class="${urgencyColor} border rounded-xl px-3.5 py-2">
            <div class="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3 ${iconColor}"></i> 30-Day Health Clock
            </div>
            <div class="text-xs font-bold mt-0.5">${daysRemaining} Days Left (Due Day 30)</div>
          </div>
        `;
      } else {
        healthClockHtml = `
          <div class="bg-rose-100 border border-rose-300 text-rose-950 rounded-xl px-3.5 py-2">
            <div class="text-[10px] uppercase font-bold tracking-wider text-rose-700 flex items-center gap-1">
              <i data-lucide="alert-octagon" class="w-3 h-3 text-rose-600"></i> 30-Day Health Clock
            </div>
            <div class="text-xs font-bold mt-0.5">${Math.abs(daysRemaining)} Days Overdue</div>
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
            DOB: <span class="font-semibold text-slate-700">${child.dob || 'Not set'}</span> • 
            Placement Date: <span class="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">${child.placement_date || 'N/A'}</span> • 
            Goal: <span class="font-semibold text-emerald-700 uppercase tracking-wider">${child.permanency_goal || 'Reunification'}</span>
          </p>
        </div>
      </div>

      <!-- Vital Alerts, Health Clock & Emergency Handoff Section -->
      <div class="flex flex-wrap items-center gap-3">
        <button onclick="openEmergencyHandoffCard()" class="bg-rose-700 hover:bg-rose-800 text-white rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-2 shadow transition" title="Print/View 1-Click Care Handoff Card for ER, Doctor, or Babysitter">
          <i data-lucide="shield-alert" class="w-4 h-4 text-rose-200"></i>
          <span>Emergency / Babysitter Card</span>
        </button>

        ${healthClockHtml}

        <div class="bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2">
          <div class="text-[10px] uppercase font-bold tracking-wider text-rose-600 flex items-center gap-1">
            <i data-lucide="alert-circle" class="w-3 h-3"></i> Allergies / Medical Alerts
          </div>
          <div class="text-xs font-semibold text-rose-900 mt-0.5">${child.allergies || 'None logged'}</div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
          <div class="text-[10px] uppercase font-bold tracking-wider text-amber-700 flex items-center gap-1">
            <i data-lucide="bell" class="w-3 h-3"></i> Action Follow-Ups
          </div>
          <div class="text-xs font-semibold text-amber-900 mt-0.5">${followUps.length} Pending Tasks</div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

let currentMainSection = 'dashboard';
let currentChildSubTab = 'overview';

function switchMainSection(sectionKey) {
  currentMainSection = sectionKey;
  currentTab = sectionKey; // backwards compatibility for helpers

  // Update top main navigation styles
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    btn.classList.remove('bg-slate-100', 'font-bold', 'text-emerald-800');
  });
  const activeBtn = document.getElementById(`navBtn-${sectionKey}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-slate-100', 'font-bold', 'text-emerald-800');
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

function switchChildTab(subTabKey) {
  currentChildSubTab = subTabKey;
  document.querySelectorAll('.child-subtab-btn').forEach(btn => {
    if (btn.getAttribute('data-childtab') === subTabKey) {
      btn.className = "child-subtab-btn active px-2.5 py-1.5 rounded-lg transition text-emerald-900 bg-white shadow-sm border border-emerald-200";
    } else {
      btn.className = "child-subtab-btn px-2.5 py-1.5 rounded-lg transition text-slate-600 hover:bg-white/80";
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

  // WELCOME / ENTRY PORTAL: When no sphere mode or caregiver is selected, render the master welcome portal & state resource center
  if (!currentSproutMode || !activeCaregiverUser) {
    if (mainNav) mainNav.classList.add('hidden');

    const card = document.getElementById('snapshotCard');
    if (card) {
      card.classList.add('hidden');
      card.innerHTML = '';
    }
    const subNav = document.getElementById('childWorkspaceSubNav');
    if (subNav) subNav.classList.add('hidden');

    renderWelcomeLandingView(container);
    lucide.createIcons();
    return;
  }

  // Caregiver and Sphere selected: reveal main navigation toolbar
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
  } else if (currentMainSection === 'reports') {
    renderReportsView(container);
  } else if (currentMainSection === 'sample_data') {
    await renderSampleDataExplorerView(container);
  } else if (currentMainSection === 'settings') {
    await renderSettingsView(container);
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

  const activeUser = getActiveCaregiver();
  const isSample = activeUser === 'Sample User';

  container.innerHTML = `
    <div class="space-y-6">

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
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Child Identifier</div>
          <div class="text-base font-bold text-slate-800 mt-1">${alias}</div>
          <div class="text-[11px] text-emerald-700 font-semibold mt-0.5">ID: ${child ? (child.child_code || 'CCC-000001') : 'N/A'}</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placement Target</div>
          <div class="text-base font-bold text-emerald-800 mt-1 flex items-center gap-1">
            <i data-lucide="calendar" class="w-4 h-4"></i> ${child.placement_date || 'Wed Oct 14'}
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
    </div>
  `;
}

// Modal Handlers
function openRecordModal() {
  document.getElementById('recEditId').value = '';
  document.getElementById('recordForm').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('recDate').value = today;
  toggleFollowUpFields();
  updateMileagePayoutDisplay();
  document.getElementById('recordModal').classList.remove('hidden');
}

function closeRecordModal() {
  document.getElementById('recordModal').classList.add('hidden');
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
  
  toggleFollowUpFields();
  document.getElementById('recordModal').classList.remove('hidden');
}

// Task Completed Toggle
async function toggleTaskComplete(id) {
  await fetch(`/api/records/${id}/toggle-complete`, { method: 'POST' });
  renderChildSnapshot();
  loadTabContent();
}

// Global Instant Search
let searchDebounce = null;
function handleGlobalSearch(e) {
  clearTimeout(searchDebounce);
  const query = e.target.value.trim();
  searchDebounce = setTimeout(async () => {
    if (query.length > 0) {
      if (currentTab !== 'timeline') {
        currentTab = 'timeline';
        document.querySelectorAll('.tab-btn').forEach(btn => {
          if (btn.getAttribute('data-tab') === 'timeline') {
            btn.classList.add('bg-slate-100', 'font-bold', 'text-emerald-800');
          } else {
            btn.classList.remove('bg-slate-100', 'font-bold', 'text-emerald-800');
          }
        });
      }
      const container = document.getElementById('tabContent');
      const res = await fetch(`/api/children/${currentChildId}/records?category=all&search=${encodeURIComponent(query)}`);
      const records = await res.json();
      await renderRecordsCustomList(container, records, `Search Results for "${query}"`);
    } else {
      loadTabContent();
    }
  }, 250);
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




