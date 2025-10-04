  # Car_Price Predictor 🚗💰

The Car Price Predictor is a Machine Learning-based web application that estimates the price of a used car based on key attributes such as company, model, year of manufacture, and kilometers driven. It combines a Flask backend with a React frontend, providing users with an intuitive and interactive experience.

## 📊 Project Overview

This project leverages Linear Regression to build a predictive model trained on the Quikr Car Dataset. The model predicts the resale value of a car based on selected input features.

The system architecture follows a full-stack approach:

Frontend: React (deployed on Vercel)

Backend: Flask (runs locally and integrates the ML model)

 ## 🧠 Model Details

Algorithm: Linear Regression

Dataset: Quikr Car Dataset

Features Used:

Company

Model

Year of Manufacture

Kilometers Driven

Target Variable: Price

## Performance Metric: R² Score = 0.89 (89%)

The model is trained using scikit-learn and the cleaned dataset derived from the original Quikr Car dataset.

## ⚙️ Tech Stack
Machine Learning

Python

scikit-learn

pandas

numpy

Backend

Flask

Joblib (for model serialization)

Frontend

React.js

HTML / CSS / JavaScript

Axios (for API communication)

## 🧩 System Architecture

The app follows a client-server architecture:

The React frontend collects user input (company, model, year, kms driven).

The data is sent via a REST API request to the Flask backend.

The backend loads the trained Linear Regression model and predicts the price.

The predicted price is returned and displayed on the frontend.

## 🚀 Deployment

Frontend: Deployed on Vercel

Backend: Runs locally via Flask (deployment planned soon)

## 🗂️ Folder Structure
Car_Price_Predictor/
│
├── backend/
│   ├── app.py                   # Flask backend server
│   ├── requirements.txt         # Backend dependencies
│   ├── cleaned_dataset.csv      # Preprocessed dataset
│   └── linear_regr_model.pkl    # Trained model
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles/
│   └── package.json
│
└── README.md

# 🧪 How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/yourusername/Car_Price_Predictor.git
cd Car_Price_Predictor

2️⃣ Setup Backend
cd backend
pip install -r requirements.txt
python app.py


Backend will run on http://127.0.0.1:5000/

3️⃣ Setup Frontend
cd ../frontend
npm install
npm start


Frontend will start on http://localhost:3000/

Make sure your backend is running before sending requests from the frontend.

# 📈 Results

Achieved an R² score of 0.89, indicating strong model performance.

Successfully predicts car prices within a reasonable margin of error.

Frontend UI built with React for clean visualization and real-time predictions.

# 🔮 Future Improvements

Deploy the Flask backend on a cloud service (e.g., Render, Railway, or AWS).

Add more features such as fuel type, transmission, and ownership.

Implement data visualization for price trends.

Integrate database storage for user queries and analytics.

📚 References

Scikit-learn Documentation

React Documentation

Flask Documentation

Vercel Deployment Guide

🤝 Contributing

Contributions are always welcome!
Feel free to fork this repository and submit a pull request to enhance features, fix bugs, or improve documentation.
