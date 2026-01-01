# 360-Degree Government News Monitoring System

A comprehensive AI-powered platform for automated crawling, categorization, and sentiment analysis of digital news with an integrated feedback system.

## 📋 Overview

This project is a **Smart News Monitoring & Feedback System** developed for the **Smart India Hackathon (SIH) 2023** (Problem Statement #1329). It addresses the Government of India's need to monitor news stories across regional media in real-time using AI and Machine Learning.


## 👥 Team Members
- Parth Mahajan
- Swarup Patil
- Priyanshi Patale
- Bhagyesh Pawar
- Nikita Pawar

## 🎯 Problem Statement

The need for a 360-degree feedback software for monitoring Government of India-related news stories in regional media using Artificial Intelligence to enable quick response and policy adjustments.

## 💡 Solution

We've built an intelligent system that:

1. **Crawls** news from multiple sources (text articles & video news)
2. **Categorizes** news by government ministry jurisdiction
3. **Analyzes sentiment** (positive, neutral, negative)
4. **Alerts** relevant departments about negative sentiment
5. **Displays** news via a user-friendly dashboard
6. **Supports** multiple languages (English, Hindi, regional languages)

## 📁 Project Structure

```
DBMS_Course_Project/
├── SIH-2023/                    # Main AI/ML + Backend project
│   ├── client/                  # Next.js frontend dashboard
│   ├── server/                  # Django REST API backend
│   ├── models/                  # ML models (classification, sentiment, clustering)
│   ├── crawler/                 # Web scraping scripts
│   ├── data/                    # Datasets and processed data
│   └── README.md
├── about/                       # About/Info React app
├── feedback-form/               # Feedback collection system
│   ├── src/                     # Frontend components
│   └── feedback-backend/        # Node.js backend
├── login-signup-page/           # Authentication system
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## 🛠 Tech Stack

### Backend
- **Framework**: Django (Python)
- **API**: Django REST Framework
- **Database**: SQLite / PostgreSQL
- **Scraping**: Beautiful Soup, Selenium

### Frontend
- **Client**: Next.js, React, Tailwind CSS
- **State Management**: Redux/Context API
- **Feedback Form**: React

### AI/ML
- **Libraries**: PyTorch, TensorFlow, HuggingFace Transformers
- **Models**: BERT, DistilBERT, RoBERTa
- **Tasks**: Text Classification, Sentiment Analysis, Named Entity Recognition

### Backend Services
- **Feedback Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, OAuth

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm/yarn
- Python 3.8+
- MongoDB (for feedback service)
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/Nikita-Pawar-22/360Degree-GovNews-Monitoring.git
cd DBMS_Course_Project
```

### 2. Run SIH-2023 (Main Project)

#### Frontend (Next.js)
```bash
cd SIH-2023/client
npm install
npm run dev
# Opens at http://localhost:3000
```

#### Backend (Django)
```bash
cd SIH-2023/server
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# API at http://127.0.0.1:8000
```

### 3. Run Feedback System

```bash
cd feedback-form/feedback-backend
npm install
npm start
# Server at http://localhost:5000
```

### 4. Run About Page

```bash
cd about
npm install
npm start
# Opens at http://localhost:3000 (or next available port)
```

## 📊 Features

- ✅ Automated news crawling from multiple sources
- ✅ Multi-category classification (Ministry-wise)
- ✅ Real-time sentiment analysis
- ✅ Alert system for negative sentiment
- ✅ Multi-language support (English, Hindi, regional)
- ✅ User feedback & ratings
- ✅ Auto-refresh every hour
- ✅ Dashboard with filtering & search
- ✅ Admin panel for monitoring

## 📚 ML Models

Located in `SIH-2023/models/`:

- **Classification**: Text categorization into ministry domains
- **Sentiment Analysis**: Positive/Neutral/Negative classification
- **Clustering**: Topic-based news grouping
- **Preprocessing**: Data cleaning and tokenization

See individual notebook READMEs for model training details.

## 📖 Documentation

- [SIH-2023 README](./SIH-2023/README.md) - Main project details
- [About Project](./about/README.md) - About page
- [Feedback System](./feedback-form/README.md) - Feedback module docs
- [API Docs](./SIH-2023/server/README.md) - Backend API endpoints

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For questions or support, please open an issue on GitHub or contact the team members listed above.

---

**Built with ❤️ for Smart India Hackathon 2023**
