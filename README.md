# EcoTrace: Carbon Footprint Tracker & Guide

EcoTrace is a premium, responsive Single Page Application (SPA) designed to help individuals calculate their annual carbon footprint, set actionable eco-reduction goals, track accomplishments, and review personalized sustainability insights.

Designed using modern **glassmorphism web styles**, the application operates entirely client-side using browser `LocalStorage`. This means the application is 100% serverless, private, fast, and completely free to host.

---

## 📂 Project Structure

```text
├── index.html         # Main SPA interface (HTML5 structure + CDN imports)
├── css/
│   └── style.css      # Custom design tokens, glassmorphism UI, & responsive layouts
├── js/
│   └── app.js         # Carbon calculator logic, state managers, & Chart.js controllers
├── Dockerfile         # Nginx container wrapper for Cloud Run
├── nginx.conf         # Custom Nginx server routing configurations
├── cloudbuild.yaml    # Google Cloud Build deployment pipeline
└── README.md          # Project documentation & GCP deployment guide
```

---

## 💻 Local Quickstart

Since the project uses vanilla web technologies and has no build compile steps:

1. **Direct Execution**: Simply double-click `index.html` to open it in any web browser.
2. **Lightweight Web Server**:
   If you wish to test Nginx headers or avoid CORS limits on some local browsers, launch a local server inside the project root:
   - **Python**: `python -m http.server 8000` (Open [http://localhost:8000](http://localhost:8000))
   - **Node (if installed)**: `npx serve .`

---

## 🚀 Google Cloud Platform (GCP) Deployment

Choose one of the two serverless deployment options below:

### Option 1: Google Cloud Run (Recommended Containerized Method)
This builds the application into a Docker container and deploys it on Google's managed serverless runtime. It automatically provisions SSL, handles custom domains, and offers automatic scaling.

#### Prerequisites:
- Install the [Google Cloud SDK](https://cloud.google.com/sdk).
- Enable the **Cloud Build** and **Cloud Run** APIs in your GCP Console.

#### Quick Deployment Command:
In your terminal, navigate to this directory and run:
```bash
gcloud run deploy carbon-tracker --source . --region us-central1 --allow-unauthenticated
```
*Note: This command automatically uploads your source files, builds the Docker image on Google's cloud server, pushes it to your registry, and deploys the Cloud Run service. It will output a public URL once completed.*

#### Deployment via Google Cloud Build Pipeline:
Alternatively, you can trigger Google Cloud Build to run the multi-stage pipeline defined in `cloudbuild.yaml`:
```bash
gcloud builds submit --config cloudbuild.yaml
```

---

### Option 2: Google Cloud Storage (Static Website Hosting - Lowest Cost)
Since the app is entirely static client-side (no backend API required), hosting it directly out of a Google Cloud Storage (GCS) bucket is the most cost-efficient method.

#### Steps:
1. **Create a storage bucket**:
   Replace `[YOUR_PROJECT_ID]` with your GCP Project ID or a custom domain.
   ```bash
   gcloud storage buckets create gs://[YOUR_PROJECT_ID]-carbon-tracker --location=us-central1
   ```
2. **Configure the bucket as a website**:
   Set `index.html` as both the main index and error fallback.
   ```bash
   gcloud storage buckets update gs://[YOUR_PROJECT_ID]-carbon-tracker --web-main-page-suffix=index.html --web-error-page=index.html
   ```
3. **Upload all static assets**:
   Copy the HTML, CSS, and JS files to the bucket (excluding Docker and git configs).
   ```bash
   gsutil rsync -R -x "Dockerfile|nginx.conf|cloudbuild.yaml|\.git.*" . gs://[YOUR_PROJECT_ID]-carbon-tracker
   ```
4. **Make bucket objects publicly readable**:
   Grant read access to all anonymous users.
   ```bash
   gcloud storage buckets add-iam-policy-binding gs://[YOUR_PROJECT_ID]-carbon-tracker --member=allUsers --role=roles/storage.objectViewer
   ```
5. **Access your website**:
   Your app is now live at: `http://storage.googleapis.com/[YOUR_PROJECT_ID]-carbon-tracker/index.html`

---

## 📊 Carbon Metric Reference
Emission coefficients are modelled on standard IPCC (Intergovernmental Panel on Climate Change) and US EPA (Environmental Protection Agency) averages:
- **Electricity**: `0.45 kg CO2e / kWh` (Standard US Grid). Switchable to partial renewable (0.225 kg) or 100% green tariff (0 kg).
- **Natural Gas**: `5.30 kg CO2e / therm`.
- **Gasoline Vehicle**: `0.404 kg CO2e / mile` (based on typical passenger car mpg). Reduced for Hybrids (0.22 kg) and Electric cars (0.08 kg).
- **Flights**: `250 kg CO2e / flight` (average medium-haul trip).
- **Public Transit**: `0.14 kg CO2e / passenger mile` (bus/train averages).
- **Diets**: Annual baseline tons CO2e: Meat Lover (`3.3t`), Average Balanced (`2.2t`), Vegetarian (`1.7t`), Vegan (`1.5t`).
- **Household Trash**: `2.50 kg CO2e / standard bag`, adjustable based on local recycling/composting habits.

---

## 🌱 Problem Statement

Climate change is influenced by daily human activities such as energy consumption, transportation, food choices, and waste generation.

EcoTrace helps individuals understand their personal carbon footprint, identify major emission sources, and take practical steps to reduce environmental impact.


## ✨ Key Features

- Personal carbon footprint calculator
- Emission breakdown by:
  - Energy
  - Transportation
  - Diet
  - Waste
- Personalized sustainability recommendations
- Carbon reduction goal tracking
- Interactive impact visualization
- Privacy-focused client-side storage


## 🧪 Testing

The project includes automated JavaScript tests.

Run tests:

```bash
npm test
