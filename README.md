# AI Cost Radar — CFO & Finance Audit Dashboard

A high-fidelity, premium interactive dashboard built to help Chief Financial Officers (CFOs), technology procurement teams, and IT audit departments analyze, simulate, and optimize AI and broader SaaS assets (e.g. ERP, CRM, Cloud Infrastructure) to check for feature redundancies, control runaway LLM tokens, and calculate strategic business ROI.

---

## 🚀 Key Features

*   **AI Cost Analytics:** View total costs aggregated at daily, weekly, or monthly intervals. Breakdown spending by engineering, operations, customer support, and marketing, and trace unit economies like *price per million tokens*.
*   **API Credentials & Spending Limits:** Directly review active developer token keys, current monthly spend run-rates, and override alerts thresholds (similar to the edit alerts panel mockup).
*   **Vendor Overlap & Duplicate Auditing:** Automatically scan for redundant tool footprints (e.g., developers holding active seats in both *GitHub Copilot* and *Tabnine*; marketing users using both *Jasper* and *Copy.ai*). Includes a consolidation simulator indicating annual savings metrics.
*   **IT Spend & ERP Projections:** Bridge modern AI telemetry with legacy IT overhead by charting ERP licensing (SAP S/4HANA), CRM subscriptions (Salesforce), and Cloud Infrastructure (AWS compute) side-by-side.
*   **Interactive Data API Configurator:** Review JSON schema specs and download sample CSV templates to construct integration feeds from internal API gateways (e.g., LiteLLM, Helicone) or SaaS vendor lists.

---

## 🛠️ Local Installation & Testing

The project is built using semantic HTML5, custom CSS design tokens, and lightweight vanilla Javascript powered by Chart.js.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed:
```bash
node -v
```

### Steps to Run
1.  Navigate into the code directory:
    ```bash
    cd "AI Cost radar"
    ```
2.  Start the lightweight dependency-free Node server:
    ```bash
    node server.js
    ```
3.  Access the UI dashboard:
    Open your browser and navigate to **`http://127.0.0.1:3000/`**.

---

## 📊 Shared Data / API Organization Schemas
To feed data into the AI Cost Radar in production, configure your internal systems to export files or issue POST API payloads conforming to our four integrated schemas:

### 1. AI API Gateway Logs
Captured from proxy gateways to track text volume and costs:
*   **Field specifications:** `timestamp` (ISO 8601), `user_id` (employee ID), `department` (e.g., Engineering), `vendor` (e.g., OpenAI, Anthropic), `model` (e.g., gpt-4o), `prompt_tokens` (Int), `completion_tokens` (Int), `cost_usd` (Float), `purpose_tag` (custom string).

### 2. IT & SaaS License Assets
Pulled from asset databases (like ServiceNow or Zylo) to audit vendor overlaps:
*   **Field specifications:** `vendor_name`, `license_name`, `total_seats_purchased`, `allocated_seats`, `active_seats_30d`, `unit_cost_usd_monthly`, `billing_frequency`, `category`.

### 3. Business ROI Attributions
Used to compare productivity gains from AI against traditional operations:
*   **Field specifications:** `project_name`, `associated_ai_spend_usd`, `monthly_revenue_attributed_usd`, `equivalent_non_ai_cost_usd`, `efficiency_multiplier`, `net_savings_usd`.

### 4. Cloud Infrastructure Feed
Combines database runtime and ERP billing information:
*   **Field specifications:** `billing_period`, `resource_provider`, `service_category`, `allocated_department`, `gross_spend_usd`, `unassigned_idle_spend_usd`.

See the **Data Requirements** tab in the running app to preview full JSON specifications or click **Download CSV** to download ready-to-test CSV templates.