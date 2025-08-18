
# Smart Candidate Scanner

## Demo Video
<a href="https://www.youtube.com/watch?v=cdxVzdL8s4c" target="_blank" rel="noopener noreferrer">
   <img src="https://img.youtube.com/vi/cdxVzdL8s4c/0.jpg" alt="Watch the demo"/>
</a>

<br>

## Project Description
**A modern, full-stack AI-powered Web App for bulk resume analysis and smart candidate screening. Instantly analyze and rank multiple resumes against your job requirements, saving hours of manual review with automated, explainable scoring.**

## Features
- **Bulk Resume Upload:** Upload up to 20 resumes (PDF or TXT) at once for instant analysis.
- **AI-Powered Matching:** Advanced candidate scoring and ranking based on your job description.
- **Detailed Assessment:** See relevant skills, match scores, and candidate summaries.
- **Fast & Secure:** Built with FastAPI (Python) and Vite/React (TypeScript) for speed and reliability.


## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### Backend Setup (FastAPI)

#### Claude API Key Required
To use Claude AI features, you must add your personal Claude API key to a `.env` file in the `backend/app/services/` directory:

```
CLAUDE_API_KEY=your-api-key-here
```
Replace `your-api-key-here` with your actual Claude API key. This key is required for resume analysis to work.
1. **Clone the repository:**
   ```sh
   git clone https://github.com/harels14/Smart-Candidate-Screener.git
   cd Smart-Candidate-Screener/backend
   ```
2. **Create and activate a virtual environment:**
   ```sh
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Run the FastAPI server:**
   ```sh
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup (Vite + React)
1. **Navigate to the frontend directory:**
   ```sh
   cd ../vite-project
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Usage
1. Open the web app in your browser.
2. Upload up to 20 candidate resumes (PDF or TXT).
3. Paste your job description and requirements.
4. Click "Start Candidate Screening" to analyze and rank candidates.
5. Review match scores, relevant skills, and AI-generated candidate assessments.

---

## Project Structure
```
Smart-Candidate-Screener/
├── backend/         # FastAPI backend (Python)
│   ├── main.py      # API entry point
│   ├── requirements.txt
│   └── app/
│       ├── api/     # API routes
│       ├── models/  # Data models & analysis logic
│       └── services/# Service integrations
├── vite-project/    # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md        # Project documentation
```

---

## Technologies Used
- **Backend:** FastAPI, Python, PyPDF2
- **Frontend:** React, Vite, Mantine UI, TypeScript
- **Other:** REST API, FormData, Modern CSS

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Author
**Harel S.**
- [GitHub](https://github.com/harels14)

---

## Acknowledgements
- [Mantine UI](https://mantine.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Vite](https://vitejs.dev/)

---

