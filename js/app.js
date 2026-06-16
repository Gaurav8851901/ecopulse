// Carbon Footprint Tracker - Core JavaScript App Logic

// Action Checklist Database
const REDUCTION_ACTIONS = [
  {
    id: "action-1",
    title: "Switch to LED Bulbs",
    category: "energy",
    impact: "low",
    co2Saved: 150, // kg CO2e / year
    xp: 20,
    description: "Replace standard incandescent bulbs with energy-efficient LED bulbs to lower electricity usage."
  },
  {
    id: "action-2",
    title: "Meatless Mondays",
    category: "diet",
    impact: "medium",
    co2Saved: 360,
    xp: 50,
    description: "Skip meat for just one day a week and eat plant-based instead to reduce cattle footprint."
  },
  {
    id: "action-3",
    title: "Commute by Bicycle or Walk",
    category: "transport",
    impact: "high",
    co2Saved: 850,
    xp: 100,
    description: "Walk or ride a bike for trips under 2 miles instead of driving standard gas-powered vehicles."
  },
  {
    id: "action-4",
    title: "Thermostat Winter Adjustment",
    category: "energy",
    impact: "medium",
    co2Saved: 300,
    xp: 45,
    description: "Lower your thermostat in winter by 1°C to reduce heating oil/gas usage."
  },
  {
    id: "action-5",
    title: "Unplug Vampire Electronics",
    category: "energy",
    impact: "low",
    co2Saved: 80,
    xp: 15,
    description: "Unplug chargers, standby TVs, and appliances when not in use to avoid phantom energy draw."
  },
  {
    id: "action-6",
    title: "Compost Food Waste",
    category: "waste",
    impact: "medium",
    co2Saved: 280,
    xp: 40,
    description: "Set up a home compost system for vegetable peels and organic scrap to avoid landfill methane."
  },
  {
    id: "action-7",
    title: "100% Green Energy Tariff",
    category: "energy",
    impact: "high",
    co2Saved: 1200,
    xp: 120,
    description: "Contact your power utility to switch your home source to a 100% certified wind/solar energy plan."
  },
  {
    id: "action-8",
    title: "Carpool to Commutes",
    category: "transport",
    impact: "high",
    co2Saved: 900,
    xp: 90,
    description: "Carpool with colleagues or neighbors for your regular weekly commutes to split fuel consumption."
  },
  {
    id: "action-9",
    title: "Zero Single-Use Plastics",
    category: "waste",
    impact: "low",
    co2Saved: 100,
    xp: 25,
    description: "Switch to reusable grocery canvas bags, metal drinkware, and zero-packaging goods."
  },
  {
    id: "action-10",
    title: "Limit Regional Short Flights",
    category: "transport",
    impact: "high",
    co2Saved: 1100,
    xp: 110,
    description: "Take high-speed electric trains or passenger buses instead of short flights for regional travel."
  }
];

// App State Model
let appState = {
  calculatorInputs: {
    electricity: 250, // kWh / month
    gas: 50,          // therms / month
    cleanEnergy: "none", // none, partial, full
    carMiles: 150,    // miles / week
    fuelType: "gas",  // gas, hybrid, electric
    flights: 2,       // flights / year
    transitHours: 5,  // hours / week
    dietType: "average", // meat-heavy, average, vegetarian, vegan
    wasteBags: 3,     // trash bags / week
    recycling: "some"  // none, some, full
  },
  footprintBreakdown: {
    energy: 0,
    transport: 0,
    diet: 0,
    waste: 0,
    total: 0
  },
  committedActions: [], // list of action IDs
  completedActions: [], // list of action IDs
  userXP: 0,
  carbonSaved: 0, // kg CO2e / year saved
  hasCalculated: false
};

// Global Chart Instance Reference
let carbonChartInstance = null;

// Initialize App
window.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Set up inputs from saved state
  syncInputsToDOM();
  
  // Calculate raw live numbers initially
  updateCalculatorValues();
  
  // Render Dashboard details
  updateDashboardDisplay();
  
  // Render actions grid
  renderActionPlan();
  
  // Render recommendations list
  renderRecommendations();
  
  // Route initial URL fragment
  const currentHash = window.location.hash.substring(1);
  if (currentHash && ["dashboard", "calculator", "action-plan", "insights"].includes(currentHash)) {
    switchTab(currentHash);
  } else {
    switchTab("dashboard");
  }
});

// Load state from local storage
function loadStateFromStorage() {
  const savedState = localStorage.getItem("ecotrace_state");
  if (savedState) {
    try {
      appState = JSON.parse(savedState);
    } catch (e) {
      console.error("Error parsing stored EcoTrace state, resetting.", e);
    }
  }
}

// Save state to local storage
function saveStateToStorage() {
  localStorage.setItem("ecotrace_state", JSON.stringify(appState));
}

// Tab soft-routing logic
function switchTab(tabId) {
  // Update section displays
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.remove("active");
  });
  const activeSection = document.getElementById(tabId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
  
  // Update Sidebar active tabs
  document.querySelectorAll(".sidebar .nav-link").forEach(link => {
    link.classList.remove("active");
  });
  const desktopNavLink = document.getElementById(`nav-${tabId === 'action-plan' ? 'action' : tabId}`);
  if (desktopNavLink) {
    desktopNavLink.classList.add("active");
  }
  
  // Update Mobile active tabs
  document.querySelectorAll(".mobile-nav-bar .mobile-nav-link").forEach(link => {
    link.classList.remove("active");
  });
  const mobileNavLink = document.getElementById(`mob-nav-${tabId === 'action-plan' ? 'action' : tabId}`);
  if (mobileNavLink) {
    mobileNavLink.classList.add("active");
  }
  
  // Update Header text
  const sectionTitles = {
    "dashboard": "Dashboard Overview",
    "calculator": "Carbon Footprint Calculator",
    "action-plan": "Green Action Challenges",
    "insights": "Personalized Eco Insights"
  };
  const titleEl = document.getElementById("section-title");
  if (titleEl && sectionTitles[tabId]) {
    titleEl.innerText = sectionTitles[tabId];
  }
  
  // Special action: if dashboard is selected, refresh charts
  if (tabId === "dashboard") {
    updateDashboardDisplay();
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Calculator category tabs switcher
function switchCalcTab(category) {
  document.querySelectorAll(".calc-tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(`tab-${category}`).classList.add("active");
  
  document.querySelectorAll(".calc-tab-content").forEach(content => {
    content.classList.remove("active");
  });
  document.getElementById(`calc-content-${category}`).classList.add("active");
}

// Sync values from state to DOM inputs (used on load)
function syncInputsToDOM() {
  const inputs = appState.calculatorInputs;
  
  // Sliders
  document.getElementById("input-electricity").value = inputs.electricity;
  document.getElementById("input-gas").value = inputs.gas;
  document.getElementById("input-car-miles").value = inputs.carMiles;
  document.getElementById("input-flights").value = inputs.flights;
  document.getElementById("input-transit").value = inputs.transitHours;
  document.getElementById("input-waste").value = inputs.wasteBags;
  
  // Energy Select Card
  updateSelectCardHighlight("opt-clean", inputs.cleanEnergy);
  // Fuel Select Card
  updateSelectCardHighlight("opt-fuel", inputs.fuelType);
  // Diet Select Card
  updateSelectCardHighlight("opt-diet", inputs.dietType);
  // Recycling Select Card
  updateSelectCardHighlight("opt-recycle", inputs.recycling);
}

// Helper: Toggle active highlighting on custom button grids
function updateSelectCardHighlight(prefix, value) {
  document.querySelectorAll(`[id^="${prefix}-"]`).forEach(card => {
    card.classList.remove("active");
  });
  const targetCard = document.getElementById(`${prefix}-${value}`);
  if (targetCard) {
    targetCard.classList.add("active");
  }
}

// Select Clean Energy Options
function selectCleanEnergy(val) {
  appState.calculatorInputs.cleanEnergy = val;
  updateSelectCardHighlight("opt-clean", val);
  updateCalculatorValues();
}

// Select Fuel Types
function selectFuelType(val) {
  appState.calculatorInputs.fuelType = val;
  updateSelectCardHighlight("opt-fuel", val);
  updateCalculatorValues();
}

// Select Diets
function selectDiet(val) {
  appState.calculatorInputs.dietType = val;
  updateSelectCardHighlight("opt-diet", val);
  updateCalculatorValues();
}

// Select Recycling habits
function selectRecycling(val) {
  appState.calculatorInputs.recycling = val;
  updateSelectCardHighlight("opt-recycle", val);
  updateCalculatorValues();
}

// Live calculation algorithms
function calculateCurrentEmissions() {
  const inputs = appState.calculatorInputs;
  
  // 1. Home Energy Calculations
  let electricityFactor = 0.45; // kg CO2e per kWh
  if (inputs.cleanEnergy === "partial") electricityFactor = 0.225;
  if (inputs.cleanEnergy === "full") electricityFactor = 0.0;
  
  const annualElectricityCo2 = (inputs.electricity * electricityFactor) * 12; // kg/year
  const annualGasCo2 = (inputs.gas * 5.3) * 12; // kg/year (5.3kg CO2 per therm)
  const energyTotalTons = (annualElectricityCo2 + annualGasCo2) / 1000;
  
  // 2. Transport Calculations
  let carFactor = 0.404; // kg CO2e per mile (average gasoline vehicle)
  if (inputs.fuelType === "hybrid") carFactor = 0.22;
  if (inputs.fuelType === "electric") carFactor = 0.08;
  
  const annualCarCo2 = (inputs.carMiles * carFactor) * 52; // kg/year
  const annualFlightsCo2 = inputs.flights * 250; // kg/year (250kg CO2 per flight)
  const annualTransitCo2 = (inputs.transitHours * 25 * 0.14) * 52; // kg/year (25mph, 0.14kg/passenger mile)
  
  const transportTotalTons = (annualCarCo2 + annualFlightsCo2 + annualTransitCo2) / 1000;
  
  // 3. Diet Calculations (Direct Annual Tons CO2e)
  let dietTotalTons = 2.2; // average
  if (inputs.dietType === "meat-heavy") dietTotalTons = 3.3;
  if (inputs.dietType === "vegetarian") dietTotalTons = 1.7;
  if (inputs.dietType === "vegan") dietTotalTons = 1.5;
  
  // 4. Waste Calculations
  let recyclingMultiplier = 0.8; // partial
  if (inputs.recycling === "none") recyclingMultiplier = 1.0;
  if (inputs.recycling === "full") recyclingMultiplier = 0.5;
  
  const annualWasteCo2 = (inputs.wasteBags * 2.5 * recyclingMultiplier) * 52; // kg/year
  const wasteTotalTons = annualWasteCo2 / 1000;
  
  // Totals
  const grandTotalTons = energyTotalTons + transportTotalTons + dietTotalTons + wasteTotalTons;
  
  return {
    energy: parseFloat(energyTotalTons.toFixed(2)),
    transport: parseFloat(transportTotalTons.toFixed(2)),
    diet: parseFloat(dietTotalTons.toFixed(2)),
    waste: parseFloat(wasteTotalTons.toFixed(2)),
    total: parseFloat(grandTotalTons.toFixed(2))
  };
}

// Live updating of inputs and sidebar gauge
function updateCalculatorValues() {
  const inputs = appState.calculatorInputs;
  
  // Sync slider inputs to values shown on UI
  inputs.electricity = parseInt(document.getElementById("input-electricity").value);
  document.getElementById("val-electricity").innerText = inputs.electricity;
  
  inputs.gas = parseInt(document.getElementById("input-gas").value);
  document.getElementById("val-gas").innerText = inputs.gas;
  
  inputs.carMiles = parseInt(document.getElementById("input-car-miles").value);
  document.getElementById("val-car-miles").innerText = inputs.carMiles;
  
  inputs.flights = parseInt(document.getElementById("input-flights").value);
  document.getElementById("val-flights").innerText = inputs.flights;
  
  inputs.transitHours = parseInt(document.getElementById("input-transit").value);
  document.getElementById("val-transit").innerText = inputs.transitHours;
  
  inputs.wasteBags = parseInt(document.getElementById("input-waste").value);
  document.getElementById("val-waste").innerText = inputs.wasteBags;
  
  // Calculate raw footprint totals
  const breakdown = calculateCurrentEmissions();
  
  // Update live sidebar text
  document.getElementById("calc-live-value").innerText = breakdown.total.toFixed(1);
  
  // Calculate rating text and color
  const ratingEl = document.getElementById("calc-feedback-rating");
  const comparisonEl = document.getElementById("calc-comparison-text");
  
  ratingEl.className = "widget-feedback"; // reset
  if (breakdown.total < 4.0) {
    ratingEl.innerText = "Excellent Low Footprint";
    ratingEl.classList.add("low");
  } else if (breakdown.total <= 12.0) {
    ratingEl.innerText = "Moderate Emissions";
    ratingEl.classList.add("medium");
  } else {
    ratingEl.innerText = "High Carbon Footprint";
    ratingEl.classList.add("high");
  }
  
  // Compare to average
  const US_AVERAGE = 16.0;
  const percentage = (breakdown.total / US_AVERAGE) * 100;
  comparisonEl.innerText = `Your footprint is approximately ${percentage.toFixed(0)}% of the US national average (${US_AVERAGE} tons/yr).`;
  
  // Update Circular Gauge svg fill
  const strokeMax = 440; // perimeter of 70 radius circle
  const maxFootprint = 25.0; // scale boundary
  const footprintPercent = Math.min(1, breakdown.total / maxFootprint);
  const strokeOffset = strokeMax - (strokeMax * footprintPercent);
  
  const gaugeFill = document.getElementById("calc-gauge-fill");
  if (gaugeFill) {
    gaugeFill.style.strokeDashoffset = strokeOffset;
  }
}

// Triggered when clicking "Save Footprint & Calculate"
function saveCalculationResult() {
  const breakdown = calculateCurrentEmissions();
  appState.footprintBreakdown = breakdown;
  appState.hasCalculated = true;
  
  // Add some XP for completing the calculation
  if (!appState.hasCalculated) {
    appState.userXP += 30; // 30 XP first time
  } else {
    appState.userXP += 10; // 10 XP on update
  }
  
  saveStateToStorage();
  
  // Trigger animations & notify user
  showToast("Footprint calculated and saved successfully!", "success");
  
  // Re-run displays
  updateDashboardDisplay();
  renderRecommendations();
  
  // Soft redirect to dashboard
  setTimeout(() => {
    switchTab("dashboard");
  }, 400);
}

// Show Toast notification popup
function showToast(message, type = "success") {
  // Remove existing toasts
  document.querySelectorAll(".notification-toast").forEach(t => t.remove());
  
  const toast = document.createElement("div");
  toast.className = `notification-toast glass ${type}`;
  
  let icon = "check-circle";
  if (type === "info") icon = "info";
  if (type === "warning") icon = "alert-triangle";
  
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { class: 'lucide-icon' } });
  }
  
  // Fade out
  setTimeout(() => {
    toast.style.animation = "slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Update Dashboard screen displays
function updateDashboardDisplay() {
  const breakdown = appState.footprintBreakdown;
  const hasCalculated = appState.hasCalculated;
  
  // Value elements
  const carbValEl = document.getElementById("dash-carbon-value");
  const compValEl = document.getElementById("dash-carbon-comparison");
  
  if (hasCalculated) {
    carbValEl.innerText = breakdown.total.toFixed(1);
    
    // Comparison display
    const WORLD_AVG = 4.7;
    if (breakdown.total < WORLD_AVG) {
      compValEl.className = "summary-card-subtext positive";
      compValEl.innerHTML = `<i data-lucide="shield-check"></i> Below global average (${WORLD_AVG} tons)`;
    } else {
      compValEl.className = "summary-card-subtext negative";
      compValEl.innerHTML = `<i data-lucide="trending-up"></i> Above global average (${WORLD_AVG} tons)`;
    }
  } else {
    carbValEl.innerText = "0.0";
    compValEl.className = "summary-card-subtext";
    compValEl.innerHTML = `<i data-lucide="alert-circle"></i> Run calculation to set`;
  }
  
  // Saved Carbon
  document.getElementById("dash-saved-value").innerText = appState.carbonSaved;
  const completedCount = appState.completedActions.length;
  document.getElementById("dash-saved-comparison").innerHTML = `
    <i data-lucide="sparkles"></i> ${completedCount} action${completedCount === 1 ? '' : 's'} completed
  `;
  
  // Active Goals
  const activeCount = appState.committedActions.length;
  document.getElementById("dash-goals-value").innerText = activeCount;
  document.getElementById("dash-goals-subtext").innerHTML = `
    <i data-lucide="clock"></i> ${activeCount} goals in progress
  `;
  
  // User badge level and XP
  updateUserRankDisplay();
  
  // Render Chart breakdown
  renderBreakdownChart();
  
  // Render top quick dashboard challenges
  renderDashboardQuickActions();
  
  // Refresh icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Rank & Level Thresholds
function updateUserRankDisplay() {
  const xp = appState.userXP;
  
  let rank = "Eco Explorer";
  let nextRank = "Eco Seedling";
  let badgeIcon = "sprout";
  let minXP = 0;
  let maxXP = 100;
  
  if (xp >= 500) {
    rank = "Planet Guardian";
    nextRank = "Max Rank Achieved";
    badgeIcon = "shield";
    minXP = 500;
    maxXP = 500;
  } else if (xp >= 300) {
    rank = "Carbon Warrior";
    nextRank = "Planet Guardian";
    badgeIcon = "flame-kindling";
    minXP = 300;
    maxXP = 500;
  } else if (xp >= 100) {
    rank = "Eco Seedling";
    nextRank = "Carbon Warrior";
    badgeIcon = "leaf";
    minXP = 100;
    maxXP = 300;
  }
  
  // Update header and profile badges
  document.getElementById("user-level-badge").innerText = rank;
  document.getElementById("badge-level").innerText = rank;
  document.getElementById("badge-next-level").innerText = nextRank;
  
  // Update badge graphic icon
  const badgeIconEl = document.getElementById("badge-icon");
  if (badgeIconEl) {
    badgeIconEl.setAttribute("data-lucide", badgeIcon);
  }
  
  // Calculate progress percent
  let percent = 100;
  if (maxXP > minXP) {
    percent = ((xp - minXP) / (maxXP - minXP)) * 100;
    document.getElementById("badge-progress-current").innerText = `${xp} / ${maxXP} XP`;
  } else {
    document.getElementById("badge-progress-current").innerText = `${xp} XP (Maxed)`;
  }
  
  document.getElementById("badge-progress-bar").style.width = `${percent}%`;
}

// Renders the chart
function renderBreakdownChart() {
  const canvas = document.getElementById("carbonChart");
  const placeholder = document.getElementById("chart-placeholder");
  
  if (!appState.hasCalculated) {
    canvas.style.display = "none";
    placeholder.style.display = "block";
    return;
  }
  
  canvas.style.display = "block";
  placeholder.style.display = "none";
  
  const ctx = canvas.getContext("2d");
  const data = appState.footprintBreakdown;
  
  // Destroy existing chart to prevent canvas overlapping
  if (carbonChartInstance) {
    carbonChartInstance.destroy();
  }
  
  carbonChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Energy", "Transport", "Diet", "Waste"],
      datasets: [{
        data: [data.energy, data.transport, data.diet, data.waste],
        backgroundColor: [
          "hsl(190, 90%, 45%)", // Cyan
          "hsl(346, 85%, 57%)", // Red
          "hsl(142, 72%, 43%)", // Green
          "hsl(35, 92%, 52%)"   // Orange
        ],
        borderColor: "rgba(13, 20, 38, 0.8)",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "hsl(210, 40%, 98%)",
            font: {
              family: "Plus Jakarta Sans",
              size: 12
            },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const percent = ((val / data.total) * 100).toFixed(0);
              return ` ${context.label}: ${val.toFixed(1)} tons (${percent}%)`;
            }
          }
        }
      },
      cutout: "70%"
    }
  });
}

// Renders full Action Checklist section
function renderActionPlan(filter = "all") {
  const container = document.getElementById("actions-grid-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Apply filters
  let filtered = REDUCTION_ACTIONS;
  
  if (filter === "high" || filter === "medium" || filter === "low") {
    filtered = REDUCTION_ACTIONS.filter(act => act.impact === filter);
  } else if (filter === "committed") {
    filtered = REDUCTION_ACTIONS.filter(act => appState.committedActions.includes(act.id));
  }
  
  // Render cards
  filtered.forEach(action => {
    const isCommitted = appState.committedActions.includes(action.id);
    const isCompleted = appState.completedActions.includes(action.id);
    
    let stateClass = "";
    let statusLabel = "";
    if (isCompleted) {
      stateClass = "completed";
      statusLabel = `<span class="action-status-label completed">Completed</span>`;
    } else if (isCommitted) {
      stateClass = "committed";
      statusLabel = `<span class="action-status-label committed">Active Goal</span>`;
    }
    
    const card = document.createElement("div");
    card.className = `glass-card action-card ${stateClass} glow-green`;
    card.id = `card-${action.id}`;
    
    // Build buttons based on states
    let footerButtons = "";
    if (isCompleted) {
      footerButtons = `<button class="btn-commit" style="cursor: not-allowed; opacity: 0.5;" disabled>Accomplished</button>`;
    } else if (isCommitted) {
      footerButtons = `
        <button class="btn-commit" onclick="abandonAction('${action.id}')" style="border-color: var(--danger); color: var(--danger);">Abandon</button>
        <button class="btn-complete" onclick="completeAction('${action.id}')">Complete</button>
      `;
    } else {
      footerButtons = `
        <button class="btn-commit" onclick="commitToAction('${action.id}')">
          <i data-lucide="plus" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:3px;"></i> Commit Goal
        </button>
      `;
    }
    
    card.innerHTML = `
      ${statusLabel}
      <div class="action-card-header">
        <span class="action-impact-badge ${action.impact}">${action.impact.toUpperCase()} IMPACT</span>
        <span class="action-co2-saved">-${action.co2Saved} kg/yr</span>
      </div>
      <h4 class="action-card-title">${action.title}</h4>
      <p class="action-card-desc">${action.description}</p>
      <div class="action-card-footer">
        ${footerButtons}
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // Refresh icons inside cards
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Action filter switcher
function filterActions(type) {
  document.querySelectorAll(".action-filter-bar .filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  const targetBtn = document.getElementById(`filter-${type}`);
  if (targetBtn) {
    targetBtn.classList.add("active");
  }
  
  renderActionPlan(type);
}

// Renders the 3 most recommended actions onto the dashboard based on footprint
function renderDashboardQuickActions() {
  const container = document.getElementById("dashboard-quick-actions");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Pick actions that aren't completed, sorted by high-to-low impact
  const eligibleActions = REDUCTION_ACTIONS.filter(act => !appState.completedActions.includes(act.id));
  
  // Grab up to 3 recommendations
  const displayActions = eligibleActions.slice(0, 3);
  
  if (displayActions.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--neutral-400);">
        <i data-lucide="check-circle-2" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 0.5rem;"></i>
        <p>Outstanding! You have accomplished all eco challenges.</p>
      </div>
    `;
    return;
  }
  
  displayActions.forEach(action => {
    const isCommitted = appState.committedActions.includes(action.id);
    
    const div = document.createElement("div");
    div.className = "quick-action-item";
    
    let btnHtml = "";
    if (isCommitted) {
      btnHtml = `<button class="btn-action" onclick="completeAction('${action.id}', true)">Complete</button>`;
    } else {
      btnHtml = `<button class="btn-action" onclick="commitToAction('${action.id}', true)">Commit</button>`;
    }
    
    let iconName = "zap";
    if (action.category === "transport") iconName = "car";
    if (action.category === "diet") iconName = "sandwich";
    if (action.category === "waste") iconName = "trash-2";
    
    div.innerHTML = `
      <div class="quick-action-info">
        <div class="quick-action-icon">
          <i data-lucide="${iconName}"></i>
        </div>
        <div class="quick-action-details">
          <h4>${action.title}</h4>
          <p>Saves ${action.co2Saved} kg CO2e/year • +${action.xp} XP</p>
        </div>
      </div>
      ${btnHtml}
    `;
    
    container.appendChild(div);
  });
}

// User Action Actions: COMMIT
function commitToAction(actionId, refreshDashboard = false) {
  if (appState.completedActions.includes(actionId)) return;
  
  if (!appState.committedActions.includes(actionId)) {
    appState.committedActions.push(actionId);
    saveStateToStorage();
    
    const act = REDUCTION_ACTIONS.find(a => a.id === actionId);
    showToast(`Committed to: ${act.title}!`, "info");
    
    if (refreshDashboard) {
      updateDashboardDisplay();
    } else {
      // Re-render current filter view
      const activeFilter = document.querySelector(".action-filter-bar .filter-btn.active").id.replace("filter-", "");
      renderActionPlan(activeFilter);
    }
  }
}

// User Action Actions: ABANDON
function abandonAction(actionId) {
  const index = appState.committedActions.indexOf(actionId);
  if (index > -1) {
    appState.committedActions.splice(index, 1);
    saveStateToStorage();
    
    const act = REDUCTION_ACTIONS.find(a => a.id === actionId);
    showToast(`Removed goal: ${act.title}`, "info");
    
    const activeFilter = document.querySelector(".action-filter-bar .filter-btn.active").id.replace("filter-", "");
    renderActionPlan(activeFilter);
  }
}

// User Action Actions: COMPLETE
function completeAction(actionId, refreshDashboard = false) {
  // Move from committed to completed
  const commitIndex = appState.committedActions.indexOf(actionId);
  if (commitIndex > -1) {
    appState.committedActions.splice(commitIndex, 1);
  }
  
  if (!appState.completedActions.includes(actionId)) {
    appState.completedActions.push(actionId);
    
    const act = REDUCTION_ACTIONS.find(a => a.id === actionId);
    appState.carbonSaved += act.co2Saved;
    appState.userXP += act.xp;
    
    saveStateToStorage();
    showToast(`Completed Challenge! Saved ${act.co2Saved}kg CO2e & earned +${act.xp} XP!`, "success");
    
    if (refreshDashboard) {
      updateDashboardDisplay();
    } else {
      const activeFilter = document.querySelector(".action-filter-bar .filter-btn.active").id.replace("filter-", "");
      renderActionPlan(activeFilter);
    }
  }
}

// Generate Personalized guidelines inside Insights
function renderRecommendations() {
  const container = document.getElementById("insights-recommendations");
  if (!container) return;
  
  container.innerHTML = "";
  
  const hasCalc = appState.hasCalculated;
  const data = appState.footprintBreakdown;
  
  if (!hasCalc) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--neutral-400);">
        <i data-lucide="calculator" style="width: 36px; height: 36px; margin-bottom: 0.5rem; opacity: 0.7;"></i>
        <p>No carbon calculator outputs recorded. Please fill out the <strong>Calculator tab</strong> first to receive personalized recommendations.</p>
      </div>
    `;
    return;
  }
  
  // Find highest category
  const categories = [
    { name: "energy", value: data.energy, label: "Home Energy" },
    { name: "transport", value: data.transport, label: "Transportation" },
    { name: "diet", value: data.diet, label: "Diet & Food" },
    { name: "waste", value: data.waste, label: "Waste & Recycling" }
  ];
  
  categories.sort((a, b) => b.value - a.value);
  const highest = categories[0];
  
  // Render general overview
  const summaryDiv = document.createElement("div");
  summaryDiv.style.marginBottom = "1.5rem";
  summaryDiv.innerHTML = `
    <p>Your primary emission contributor is <strong>${highest.label}</strong>, accounting for <strong>${highest.value.toFixed(1)} tons CO2e/yr</strong> (${((highest.value / data.total) * 100).toFixed(0)}% of your total footprint).</p>
  `;
  container.appendChild(summaryDiv);
  
  // Custom tips database
  const tips = {
    energy: [
      {
        title: "Improve insulation & seal air leaks",
        desc: "Sealing cracks around windows and adding loft insulation can reduce heating energy consumption by up to 15%."
      },
      {
        title: "Install a programmable thermostat",
        desc: "Set templates for your heating to decrease automatically when you sleep or leave the house."
      },
      {
        title: "Audit home appliances",
        desc: "Older refrigerators, dryers, and washing machines draw twice the load of modern Energy Star appliances."
      }
    ],
    transport: [
      {
        title: "Adopt public transit commutes",
        desc: "Swapping solo driving for trains or buses just 2 days a week saves up to 1.2 tons of carbon annually."
      },
      {
        title: "Opt for fuel-efficient tire pressure",
        desc: "Keeping tires fully inflated increases gas mileage efficiency by 3%, lowering fuel footprint."
      },
      {
        title: "Group travels and consolidate errands",
        desc: "Plan single-trip routes for shopping and work runs rather than multiple cold-engine cold-starts."
      }
    ],
    diet: [
      {
        title: "Swap beef for poultry or beans",
        desc: "Beef generates 10 times the greenhouse gases of chicken, and 30 times more than lentils/soy foods."
      },
      {
        title: "Eliminate food waste leftovers",
        desc: "Up to 30% of household food purchases go directly to landfills, generating methane. Prep smart."
      },
      {
        title: "Prioritize local, seasonal food items",
        desc: "Out-of-season produce imported via air-freight contributes heavy transport footprint."
      }
    ],
    waste: [
      {
        title: "Maximize organic composting",
        desc: "Composting organic garbage stops oxygen-poor landfill decay which vents methane."
      },
      {
        title: "Avoid buying multi-layer packaging",
        desc: "Buy bulk pantry staples in recyclable card or glass rather than composite foil pouches."
      },
      {
        title: "Opt-out of physical mail listings",
        desc: "Register to cancel paper catalogs, saving trees and processing plants."
      }
    ]
  };
  
  // Render custom cards for highest emitter
  const tipList = tips[highest.name] || [];
  tipList.forEach((tip, idx) => {
    const item = document.createElement("div");
    item.className = "rec-item";
    
    let icon = "alert-circle";
    if (highest.name === "energy") icon = "home";
    if (highest.name === "transport") icon = "car";
    if (highest.name === "diet") icon = "sandwich";
    if (highest.name === "waste") icon = "trash-2";
    
    item.innerHTML = `
      <div class="rec-icon">
        <i data-lucide="${icon}"></i>
      </div>
      <div class="rec-details">
        <h4>${tip.title}</h4>
        <p>${tip.desc}</p>
      </div>
    `;
    container.appendChild(item);
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
