 INFERENCE AI
Smart Form Extraction powered by AI
Transforming handwritten and printed forms into structured data in seconds.

Hackathon
Next.js
Gemini AI
Supabase

📖 What is INFERENCE AI?
INFERENCE AI is an intelligent document processing platform that extracts structured data from form images using OCR and AI. Whether it's invoices, shipping manifests, applications, or medical forms—just snap a photo and let AI do the work.

✨ Key Features
📸 Live Camera Capture – Take photos directly in the app

🔍 Real-Time OCR – Watch text extraction progress in real-time

🤖 AI-Powered Parsing – Google Gemini understands form structure automatically

📊 Confidence Scores – Know how reliable each extracted field is (0-100%)

📄 Auto-Fill PDFs – Generate filled PDFs from extracted data

💾 Cloud Storage – All submissions saved to Supabase

🎨 Modern UI – Clean, responsive interface built with Next.js + Tailwind CSS

🎯 Use Cases
Healthcare: Patient intake forms, prescriptions, insurance claims

Logistics: Shipping manifests, delivery receipts, customs forms

Finance: Invoices, receipts, tax forms, applications

Education: Student registration, exam forms, surveys

Government: License applications, permits, citizen forms

🛠️ Tech Stack
Frontend
Next.js 14 – React framework with App Router

TypeScript – Type-safe development

Tailwind CSS – Modern styling

Shadcn UI – Component library

Backend
Next.js API Routes – Serverless backend

Python (Flask) – OCR processing server (optional)

Tesseract OCR – Text extraction engine

Google Gemini AI – Form parsing and understanding

Database & Storage
Supabase – PostgreSQL database

Supabase Storage – PDF file storage

Deployment
Vercel – Frontend hosting

GitHub – Version control

🚀 Getting Started
Prerequisites
Node.js 18+ and npm/pnpm

Python 3.9+ (for OCR backend)

Supabase account

Google Gemini API key

Installation
Clone the repository

bash
git clone https://github.com/your-username/inference-ai.git
cd inference-ai
Install dependencies

bash
npm install
# or
pnpm install
Set up environment variables

Create a .env.local file:

text
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash-latest

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OCR
OCR_PROVIDER=tesseract
STORE_PDF=true
Set up Python backend (optional for OCR)

bash
cd python-backend  # if you have a separate Python folder
pip install -r requirements.txt
python main.py
Run the development server

bash
npm run dev
Open http://localhost:3000

📂 Project Structure
text
inference-ai/
├── app/
│   ├── api/
│   │   └── formsnap/
│   │       └── route.ts          # Main API endpoint
│   ├── upload/
│   │   └── page.tsx              # Upload page
│   ├── processing/
│   │   └── page.tsx              # Processing status page
│   └── results/
│       └── page.tsx              # Results display
├── lib/
│   ├── gemini-agent.ts           # Gemini AI integration
│   ├── ocr.ts                    # OCR processing
│   ├── supabase-client.ts        # Supabase client
│   └── pdf-generator.ts          # PDF generation
├── components/
│   └── ui/                       # Reusable UI components
├── public/
└── README.md
🎨 How It Works
text
graph LR
    A[Upload/Camera] --> B[OCR Text Extraction]
    B --> C[AI Parsing Gemini]
    C --> D[Structured JSON]
    D --> E[Save to Supabase]
    D --> F[Generate PDF]
    E --> G[Display Results]
    F --> G
Upload or capture a form image

OCR extracts all text from the image (Tesseract)

AI parses the text into structured fields (Gemini)

Confidence scores indicate extraction quality

Data is saved to Supabase database

PDF is generated with filled data

Results displayed on clean results page

🧪 Example Output
Input: Photo of a shipping form
Output:

json
{
  "formType": "logistics_shipping",
  "trackingNumber": "DXB-2025-112358",
  "senderName": "Acme Trading LLC",
  "receiverName": "Global Imports Co.",
  "totalAmount": "5000",
  "currency": "AED",
  "confidenceHints": {
    "trackingNumber": 0.98,
    "senderName": 0.96,
    "receiverName": 0.95
  }
}
👥 Team
🏆 Hackathon 2025
Role	Name	Responsibilities
👨‍💼 Team Leader	Fahad	Project management, strategy, presentation
💻 Lead Developer	Muaaz Syed	Full-stack development, AI integration, backend
🎨 Strategist & Designer	Minaal	UX/UI design, product strategy, user flows
🔮 Future Enhancements
 Support for multi-page documents

 Batch processing of multiple forms

 Custom form templates

 Export to Excel/CSV

 Mobile app (React Native)

 IBM watsonx Orchestrate integration

 Multi-language OCR support

 Form validation rules

 API for third-party integration

📜 License
This project was built for [Hackathon Name] 2025.

🙏 Acknowledgments
Google Gemini for powerful AI parsing

Tesseract OCR for text extraction

Supabase for backend infrastructure

Vercel for seamless deployment

Next.js team for amazing developer experience

📧 Contact
For questions or feedback, reach out to the team:

GitHub: your-username/inference-ai

Demo: your-vercel-url.vercel.app

<p align="center"> Made with ❤️ by Team INFERENCE AI | Hackathon 2025 </p>
