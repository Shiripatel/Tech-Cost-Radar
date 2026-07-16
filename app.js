// AI Cost Radar - CFO Dashboard Engine

// Mock Database State
let apiKeys = [
  { id: 'key_1', name: "Elizabeth Smith's API Key", owner: "Elizabeth Smith", juneSpend: 9994.35, limit: 12000, frequency: 'monthly', alerts: ['50%', '80%', '90%'], alertStatus: 'Warning', risk: 'Medium' },
  { id: 'key_2', name: "Document Vectorizer Prod", owner: "Backend Eng Team", juneSpend: 31250.00, limit: 35000, frequency: 'monthly', alerts: ['50%', '80%', '90%', '100%'], alertStatus: 'Critical', risk: 'High' },
  { id: 'key_3', name: "Customer Support Chatbot", owner: "Support Ops", juneSpend: 15400.00, limit: 20000, frequency: 'monthly', alerts: ['50%', '80%'], alertStatus: 'Normal', risk: 'Low' },
  { id: 'key_4', name: "Copilot Developer Seats", owner: "SaaS Procurement", juneSpend: 42500.00, limit: 50000, frequency: 'monthly', alerts: ['50%', '80%', '100%'], alertStatus: 'Normal', risk: 'Low' },
  { id: 'key_5', name: "Marketing Generation API", owner: "Marketing Copy", juneSpend: 6850.00, limit: 6000, frequency: 'monthly', alerts: ['50%', '80%', '90%', '100%'], alertStatus: 'Breached', risk: 'High' }
];

let vendorOverlaps = [
  {
    id: 'overlap_1',
    category: 'AI Code Assistants',
    potentialSavings: 1540,
    vendorA: { name: 'GitHub Copilot Enterprise', seats: 120, costSeat: 39 },
    vendorB: { name: 'Tabnine Pro', seats: 80, costSeat: 15 },
    redundantSeats: 64,
    recommendation: '64 developers hold active licenses for BOTH tools. Consolidating all developers onto GitHub Copilot Enterprise and reclaiming duplicates saves $1,540/month.'
  },
  {
    id: 'overlap_2',
    category: 'SaaS Translation & Copywriting',
    potentialSavings: 880,
    vendorA: { name: 'Jasper AI Business', seats: 15, costSeat: 80 },
    vendorB: { name: 'Copy.ai Enterprise', seats: 12, costSeat: 45 },
    redundantSeats: 9,
    recommendation: '9 marketing users overlapping features. Transition team to a unified ChatGPT Enterprise workspace subscription to recover seat waste.'
  },
  {
    id: 'overlap_3',
    category: 'Document Search Redundancy',
    potentialSavings: 400,
    vendorA: { name: 'Glean Enterprise Search', seats: 80, costSeat: 25 },
    vendorB: { name: 'Heptabase AI Knowledge', seats: 30, costSeat: 10 },
    redundantSeats: 16,
    recommendation: '16 operations analysts have dual license footprint. We suggest standardizing internal search on Glean which already indexes company wikis.'
  }
];

const schemas = {
  tokens: {
    title: "AI Gateway Usage Logs (JSON Schema)",
    desc: "Export token count logs from your LLM proxies (e.g. LiteLLM, Helicone) to match this structure.",
    code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIGatewayUsageLog",
  "type": "object",
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of request execution."
    },
    "user_id": {
      "type": "string",
      "description": "Unique corporate employee identifier."
    },
    "department": {
      "type": "string",
      "enum": ["Engineering", "Customer Support", "Marketing", "Sales", "Legal", "Operations"]
    },
    "vendor": {
      "type": "string",
      "enum": ["OpenAI", "Anthropic", "Cohere", "Mistral", "Google Vertex", "Self-Hosted"]
    },
    "model": {
      "type": "string",
      "description": "Specific model name, e.g. gpt-4o, claude-3-5-sonnet."
    },
    "prompt_tokens": {
      "type": "integer",
      "minimum": 0
    },
    "completion_tokens": {
      "type": "integer",
      "minimum": 0
    },
    "cost_usd": {
      "type": "number",
      "minimum": 0,
      "description": "Calculated USD cost based on token pricing factors."
    },
    "purpose_tag": {
      "type": "string",
      "description": "Tag attributing cost to project, e.g. 'code-assistant', 'support-bot'"
    }
  },
  "required": ["timestamp", "user_id", "department", "vendor", "model", "cost_usd"]
}`
  },
  licenses: {
    title: "SaaS License Assets (JSON Schema)",
    desc: "Import subscriptions lists from SaaS operations databases (e.g. Zylo, Zluri) to find feature overlaps.",
    code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SaaSLicenseAsset",
  "type": "object",
  "properties": {
    "vendor_name": { "type": "string" },
    "license_name": { "type": "string" },
    "total_seats_purchased": { "type": "integer" },
    "allocated_seats": { "type": "integer" },
    "active_seats_30d": { "type": "integer" },
    "unit_cost_usd_monthly": { "type": "number" },
    "billing_frequency": { "type": "string", "enum": ["monthly", "annual"] },
    "contract_end_date": { "type": "string", "format": "date" },
    "category": {
      "type": "string",
      "enum": ["AI Code Generation", "Marketing Copy", "Document Summarizer", "ERP Platform", "CRM Engine"]
    }
  },
  "required": ["vendor_name", "license_name", "allocated_seats", "unit_cost_usd_monthly", "category"]
}`
  },
  roi: {
    title: "Business ROI Attributions (JSON Schema)",
    desc: "Attribute positive business yields from AI vs legacy processes to benchmark strategic ROI.",
    code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BusinessROIMetric",
  "type": "object",
  "properties": {
    "project_name": { "type": "string" },
    "associated_ai_spend_usd": { "type": "number" },
    "monthly_revenue_attributed_usd": { "type": "number" },
    "equivalent_non_ai_cost_usd": { 
      "type": "number",
      "description": "Baseline labor or tool cost if resolving same task WITHOUT AI."
    },
    "efficiency_multiplier": { "type": "number" },
    "net_savings_usd": { "type": "number" }
  },
  "required": ["project_name", "associated_ai_spend_usd", "equivalent_non_ai_cost_usd"]
}`
  },
  cloud: {
    title: "IT Infrastructure Costs Feed (JSON Schema)",
    desc: "Combine core IT spending (databases, cloud computing, ERP bills) to track total runways.",
    code: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CloudInfraSpend",
  "type": "object",
  "properties": {
    "billing_period": { "type": "string", "description": "e.g., '2026-07'" },
    "resource_provider": { "type": "string", "enum": ["AWS", "Azure", "GCP", "SAP Cloud", "Oracle Cloud"] },
    "service_category": { "type": "string", "enum": ["Compute", "Storage", "Database", "ERP Licenses", "Fulfillment"] },
    "allocated_department": { "type": "string" },
    "gross_spend_usd": { "type": "number" },
    "unassigned_idle_spend_usd": { "type": "number" }
  },
  "required": ["billing_period", "resource_provider", "service_category", "gross_spend_usd"]
}`
  }
};

// Global App State & Chart Hook
let spendChart = null;
let activeModalKeyId = null;
let selectedSchemaName = 'tokens';

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  renderApiKeys();
  renderVendorOverlaps();
  initSpendChart();
  selectSchema('tokens');
  calculateSimulatorResult();
});

// Tab Switching System
function switchTab(tabId) {
  const contents = document.querySelectorAll('.tab-content');
  const tabs = document.querySelectorAll('.tab-btn');
  
  contents.forEach(content => content.classList.remove('active'));
  tabs.forEach(tab => tab.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  
  // Find which tab button corresponds
  const targetBtn = Array.from(tabs).find(t => t.getAttribute('onclick').includes(tabId));
  if (targetBtn) targetBtn.classList.add('active');
}

// Render API Keys Table
function renderApiKeys() {
  const tbody = document.getElementById('api-keys-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  apiKeys.forEach(k => {
    const formattedSpend = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(k.juneSpend);
    const formattedLimit = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(k.limit);
    
    // Status color badge
    let statusClass = 'active';
    if (k.alertStatus === 'Breached') statusClass = 'inactive'; // uses standard style mapping
    
    let riskBadge = '';
    if (k.risk === 'High') {
      riskBadge = `<span class="kpi-badge down" style="font-size:0.8rem; padding:0.25rem 0.5rem;">High Threat</span>`;
    } else if (k.risk === 'Medium') {
      riskBadge = `<span class="kpi-badge" style="background:#fff3cd; color:#856404; font-size:0.8rem; padding:0.25rem 0.5rem;">Medium Risk</span>`;
    } else {
      riskBadge = `<span class="kpi-badge up" style="font-size:0.8rem; padding:0.25rem 0.5rem;">Healthy</span>`;
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight: 700; color: var(--text-primary); cursor: pointer;" onclick="openAlertModal('${k.id}')">
          ${k.name}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top:2px;">ID: ${k.id}</div>
      </td>
      <td>${k.owner}</td>
      <td style="font-weight: 600;">${formattedSpend}</td>
      <td><strong>${formattedLimit}</strong> <span style="font-size:0.8rem; color:var(--text-secondary);">/ ${k.frequency}</span></td>
      <td>${riskBadge}</td>
      <td>
        <button class="btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.85rem;" onclick="openAlertModal('${k.id}')">Edit Alert Limit</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Vendor Overlaps
function renderVendorOverlaps() {
  const container = document.getElementById('vendor-overlaps-list');
  if (!container) return;
  container.innerHTML = '';
  
  vendorOverlaps.forEach(o => {
    const item = document.createElement('div');
    item.className = 'overlap-item';
    item.innerHTML = `
      <div class="overlap-meta">
        <span class="overlap-category">${o.category}</span>
        <span class="overlap-savings">Savings Potential: $${o.potentialSavings}/mo</span>
      </div>
      
      <div class="overlap-grid-vs">
        <div class="overlap-vendor-box">
          <div class="overlap-vendor-name">${o.vendorA.name}</div>
          <div class="overlap-vendor-seats">${o.vendorA.seats} seats · $${o.vendorA.costSeat}/mo</div>
        </div>
        <div class="overlap-separator-vs">VS</div>
        <div class="overlap-vendor-box">
          <div class="overlap-vendor-name">${o.vendorB.name}</div>
          <div class="overlap-vendor-seats">${o.vendorB.seats} seats · $${o.vendorB.costSeat}/mo</div>
        </div>
      </div>
      
      <div class="overlap-recommendation">
        <strong>Audit Focus:</strong> ${o.redundantSeats} users overlap. ${o.recommendation}
      </div>
    `;
    container.appendChild(item);
  });
}

// Modal Interaction
function openAlertModal(keyId) {
  const keyObj = apiKeys.find(k => k.id === keyId) || {
    id: 'key_new',
    name: 'New Custom API Key',
    owner: 'Admin Profile',
    juneSpend: 0,
    limit: 1000,
    frequency: 'monthly',
    alerts: ['50%', '80%'],
    risk: 'Low'
  };
  
  activeModalKeyId = keyObj.id;
  
  document.getElementById('modal-key-name').innerText = keyObj.name;
  document.getElementById('modal-key-spend').innerText = `Total spend in June: $${keyObj.juneSpend.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
  document.getElementById('modal-spend-limit').value = `$${keyObj.limit.toLocaleString()}`;
  document.getElementById('modal-spend-freq').value = keyObj.frequency;
  document.getElementById('modal-key-owner-notified').innerText = `${keyObj.owner} will always receive alerts. Choose who else to notify.`;
  
  // Render notification threshold badges
  renderModalAlertBadges(keyObj.alerts);
  
  document.getElementById('edit-alerts-modal').classList.add('active');
}

function renderModalAlertBadges(activeAlerts) {
  const row = document.getElementById('modal-alerts-row');
  row.innerHTML = '';
  
  const standardThresholds = ['50%', '80%', '90%'];
  
  standardThresholds.forEach(t => {
    const isSelected = activeAlerts.includes(t);
    const btn = document.createElement('button');
    btn.className = `badge-toggle-btn ${isSelected ? 'active' : ''}`;
    btn.innerText = t;
    btn.onclick = () => toggleModalBadge(t);
    row.appendChild(btn);
  });
  
  // 100% button is locked as required by reference mockup
  const lockedBtn = document.createElement('button');
  lockedBtn.className = 'badge-toggle-btn locked';
  lockedBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
     100%`;
  row.appendChild(lockedBtn);
  
  // Plus sign button to add arbitrary alert threshold range
  const plusBtn = document.createElement('button');
  plusBtn.className = 'badge-add-btn';
  plusBtn.innerText = '+';
  plusBtn.onclick = () => {
    const newPct = prompt('Enter notification trigger percentage (e.g. 75%):');
    if (newPct && newPct.trim() !== '') {
      const sanitized = newPct.replace('%','').trim() + '%';
      toggleModalBadge(sanitized);
    }
  };
  row.appendChild(plusBtn);
}

function toggleModalBadge(percentageStr) {
  const keyObj = apiKeys.find(k => k.id === activeModalKeyId);
  if (!keyObj) return;
  
  if (keyObj.alerts.includes(percentageStr)) {
    keyObj.alerts = keyObj.alerts.filter(x => x !== percentageStr);
  } else {
    keyObj.alerts.push(percentageStr);
    keyObj.alerts.sort();
  }
  renderModalAlertBadges(keyObj.alerts);
}

function closeAlertModal() {
  document.getElementById('edit-alerts-modal').classList.remove('active');
  activeModalKeyId = null;
}

function submitAlertChanges() {
  const limitValue = document.getElementById('modal-spend-limit').value.replace(/[^0-9.]/g, '');
  const parsedLimit = parseFloat(limitValue);
  const freq = document.getElementById('modal-spend-freq').value;
  
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    alert('Please enter a valid spent limit amount.');
    return;
  }
  
  const keyObj = apiKeys.find(k => k.id === activeModalKeyId);
  if (keyObj) {
    keyObj.limit = parsedLimit;
    keyObj.frequency = freq;
    
    // Recalculate risk rating Mock
    if (keyObj.juneSpend > keyObj.limit) {
      keyObj.alertStatus = 'Breached';
      keyObj.risk = 'High';
    } else if (keyObj.juneSpend >= keyObj.limit * 0.9) {
      keyObj.alertStatus = 'Critical';
      keyObj.risk = 'High';
    } else if (keyObj.juneSpend >= keyObj.limit * 0.75) {
      keyObj.alertStatus = 'Warning';
      keyObj.risk = 'Medium';
    } else {
      keyObj.alertStatus = 'Normal';
      keyObj.risk = 'Low';
    }
    
    renderApiKeys();
  }
  
  closeAlertModal();
}

// Chart.js Setup
function initSpendChart() {
  const ctx = document.getElementById('spendChart').getContext('2d');
  
  // Weekly Default Data (similar to screenshot)
  const defaultLabels = ['June 01', 'June 08', 'June 15', 'June 22', 'June 29', 'July 06', 'July 13'];
  
  // Department Cost Series
  const dataEng = [3.0, 3.1, 2.8, 1.2, 3.0, 3.2, 3.2]; 
  const dataSupport = [0.8, 0.4, 0.5, 0.8, 0.7, 0.5, 0.7]; 
  const dataMarketing = [0.4, 0.2, 0.1, 0.3, 0.2, 0.3, 0.2]; 
  const dataOps = [0.3, 0.3, 0.1, 0.1, 0.4, 0.2, 0.4];
  
  // Calculate aggregate trend line overlay
  const dataTrendLine = [];
  for (let i = 0; i < defaultLabels.length; i++) {
    const total = dataEng[i] + dataSupport[i] + dataMarketing[i] + dataOps[i];
    dataTrendLine.push(total - 0.2); // slight offset to match graphic curve
  }

  spendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: defaultLabels,
      datasets: [
        {
          label: 'Engineering (Model API)',
          data: dataEng,
          backgroundColor: '#354839', // Dark Moss primary
          stack: 'CombinedSpend',
          borderRadius: 4
        },
        {
          label: 'Customer Support',
          data: dataSupport,
          backgroundColor: '#dbbbc1', // Pink overlay
          stack: 'CombinedSpend',
          borderRadius: 4
        },
        {
          label: 'Marketing Content',
          data: dataMarketing,
          backgroundColor: '#9ebae8', // Light blue
          stack: 'CombinedSpend',
          borderRadius: 4
        },
        {
          label: 'Operations (RPA)',
          data: dataOps,
          backgroundColor: '#d8b9ed', // Lavender
          stack: 'CombinedSpend',
          borderRadius: 4
        },
        {
          label: 'Aggregate Trend Line',
          data: dataTrendLine,
          type: 'line',
          borderColor: '#1d1d1f',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false }
        },
        y: {
          stacked: true,
          grid: { color: 'rgba(0, 0, 0, 0.04)' },
          ticks: {
            callback: function(val) { return '$' + val + 'K'; }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 15, font: { family: 'Inter' } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y + 'K';
            }
          }
        }
      }
    }
  });
}

function updateSpendChart(cadence) {
  // Toggle Active Button Styles
  document.getElementById('ctrl-daily').classList.remove('active');
  document.getElementById('ctrl-weekly').classList.remove('active');
  document.getElementById('ctrl-monthly').classList.remove('active');
  document.getElementById('ctrl-' + cadence).classList.add('active');
  
  if (!spendChart) return;
  
  if (cadence === 'daily') {
    spendChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Redraw with smaller scale dataset
    spendChart.data.datasets[0].data = [0.4, 0.5, 0.4, 0.3, 0.5, 0.2, 0.1];
    spendChart.data.datasets[1].data = [0.1, 0.1, 0.05, 0.1, 0.1, 0.05, 0.05];
    spendChart.data.datasets[2].data = [0.05, 0.02, 0.04, 0.05, 0.03, 0.01, 0.01];
    spendChart.data.datasets[3].data = [0.03, 0.02, 0.02, 0.02, 0.04, 0.01, 0.03];
    spendChart.data.datasets[4].data = [0.55, 0.62, 0.49, 0.45, 0.60, 0.25, 0.18];
  } else if (cadence === 'weekly') {
    spendChart.data.labels = ['June 01', 'June 08', 'June 15', 'June 22', 'June 29', 'July 06', 'July 13'];
    spendChart.data.datasets[0].data = [3.0, 3.1, 2.8, 1.2, 3.0, 3.2, 3.2]; 
    spendChart.data.datasets[1].data = [0.8, 0.4, 0.5, 0.8, 0.7, 0.5, 0.7]; 
    spendChart.data.datasets[2].data = [0.4, 0.2, 0.1, 0.3, 0.2, 0.3, 0.2]; 
    spendChart.data.datasets[3].data = [0.3, 0.3, 0.1, 0.1, 0.4, 0.2, 0.4];
    spendChart.data.datasets[4].data = [4.3, 3.8, 3.4, 2.2, 4.1, 4.0, 4.3];
  } else if (cadence === 'monthly') {
    spendChart.data.labels = ['Jan Spend', 'Feb Spend', 'Mar Spend', 'Apr Spend', 'May Spend', 'Jun Spend'];
    spendChart.data.datasets[0].data = [12.0, 15.2, 17.5, 22.0, 31.0, 42.5];
    spendChart.data.datasets[1].data = [5.5, 7.8, 11.2, 16.4, 24.1, 31.2];
    spendChart.data.datasets[2].data = [3.2, 4.1, 6.0, 9.5, 14.2, 18.8];
    spendChart.data.datasets[3].data = [2.0, 2.4, 4.0, 6.2, 9.8, 13.5];
    spendChart.data.datasets[4].data = [22.0, 28.5, 37.0, 52.0, 75.0, 102.0];
  }
  
  spendChart.update();
}

// Vendor Overlap Calculator Simulator
function calculateSimulatorResult() {
  const consolRate = parseFloat(document.getElementById('slider-consolidation').value);
  const reclaimRate = parseFloat(document.getElementById('slider-reclaim').value);
  
  document.getElementById('label-consolidation-pct').innerText = consolRate + '%';
  document.getElementById('label-reclaim-pct').innerText = reclaimRate + '%';
  
  // Math formulation: base redundant license pool total is $2,820/mo
  const baseOverhead = 2820 * 12; // $33,840 annual base overlap waste
  const consolidationSavings = baseOverhead * (consolRate / 100) * 0.70; // 70% efficiency reclaim
  const idleReclaimSavings = baseOverhead * (reclaimRate / 100) * 0.30; // 30% idle reclaim
  
  const totalAnnualSavings = consolidationSavings + idleReclaimSavings;
  const netMarginUplift = (totalAnnualSavings / 245000) * 100; // measured against total spend index baseline
  
  document.getElementById('val-simulated-savings').innerText = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalAnnualSavings);
  
  document.getElementById('val-roi-increase').innerText = '+' + netMarginUplift.toFixed(1) + '% Margin Savings';
}

// Schema Page Dynamic Display
function selectSchema(schemaName) {
  selectedSchemaName = schemaName;
  
  // Set navbar highlights
  document.getElementById('schema-nav-tokens').classList.remove('active');
  document.getElementById('schema-nav-licenses').classList.remove('active');
  document.getElementById('schema-nav-roi').classList.remove('active');
  document.getElementById('schema-nav-cloud').classList.remove('active');
  
  document.getElementById('schema-nav-' + schemaName).classList.add('active');
  
  // Change code block
  const specObj = schemas[schemaName];
  document.getElementById('schema-preview-title').innerText = specObj.title;
  document.getElementById('schema-preview-desc').innerText = specObj.desc;
  document.getElementById('schema-code-block').innerText = specObj.code;
}

function copySchemaCode() {
  const codeText = document.getElementById('schema-code-block').innerText;
  navigator.clipboard.writeText(codeText)
    .then(() => alert('API JSON Schema successfully copied to clipboard.'))
    .catch(() => alert('Copy failed. Please manually copy code.'));
}

// Sample CSV Download Builder
function downloadSampleCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  if (selectedSchemaName === 'tokens') {
    csvContent += "timestamp,user_id,department,vendor,model,prompt_tokens,completion_tokens,cost_usd,purpose_tag\n";
    csvContent += "2026-07-16T12:00:00Z,usr_01a,Engineering,OpenAI,gpt-4o,1200,400,0.0102,code-completion\n";
    csvContent += "2026-07-16T12:04:12Z,usr_772,Customer Support,Anthropic,claude-3-5-sonnet,5000,1200,0.0330,copilot-chat\n";
    csvContent += "2026-07-16T12:15:30Z,usr_981,Marketing,Google Vertex,gemini-1.5-pro,12000,2000,0.0210,copy-writing-draft\n";
  } else if (selectedSchemaName === 'licenses') {
    csvContent += "vendor_name,license_name,allocated_seats,active_seats_30d,unit_cost_usd_monthly,category\n";
    csvContent += "Microsoft,GitHub Copilot Enterprise,120,84,39.00,AI Code Generation\n";
    csvContent += "Tabnine,Tabnine Pro,80,32,15.00,AI Code Generation\n";
    csvContent += "Jasper,Jasper AI Business,15,6,80.00,Marketing Copy\n";
  } else if (selectedSchemaName === 'roi') {
    csvContent += "project_name,associated_ai_spend_usd,monthly_revenue_attributed_usd,equivalent_non_ai_cost_usd,efficiency_multiplier,net_savings_usd\n";
    csvContent += "Customer Support Bot,12500.0,46000.0,35000.0,2.8,22500.0\n";
    csvContent += "Developer Copilots,42500.0,78000.0,90000.0,1.4,47500.0\n";
  } else if (selectedSchemaName === 'cloud') {
    csvContent += "billing_period,resource_provider,service_category,allocated_department,gross_spend_usd,unassigned_idle_spend_usd\n";
    csvContent += "2026-07,AWS,Compute,Engineering,56000.0,12000.0\n";
    csvContent += "2026-07,SAP Cloud,ERP Licenses,Operations,83250.0,0.0\n";
    csvContent += "2026-07,Salesforce,CRM Seats,Sales,48000.0,4800.0\n";
  }
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ai_cost_radar_${selectedSchemaName}_sample.csv`);
  document.body.appendChild(link); // Required for FF
  
  link.click();
  document.body.removeChild(link);
}
