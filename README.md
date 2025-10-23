# Selego Expense Tracker - Junior Developer Assessment

## 🚀 Project Overview

This is a full-stack expense tracking application built for the Selego Junior Developer assessment. It meets all core requirements by allowing users to:
* Create and manage expense categories.
* Log expenses with amounts and descriptions.
* View total spending aggregated by category.
* Implement a budget alert system using an external email service.

## 💻 Tech Stack

| Component | Technology Used | Notes |
| :--- | :--- | :--- |
| **Frontend** | React (JavaScript) | Uses `axios` for API calls. |
| **Backend** | Node.js, Express.js | Follows the required one-route, one-job pattern. |
| **Database** | MongoDB (via Mongoose) | Uses separate, flat collections for Category and Expense. |
| **External Service** | Brevo (Sendinblue) | Used for sending budget notification emails. |

## 🛠 Installation and Setup

### Prerequisites

You must have the following installed locally:
* Node.js (v14+) and npm
* MongoDB Atlas Account
* Brevo Account (for the API Key)

### Step 1: Clone the Repository

```bash
git clone [[YOUR GITHUB REPO URL](https://github.com/MartinHoxha123/Selego-Expense-Tracker)]
cd [expense-tracker]
Step 2: Configure Environment Variables
Navigate to the backend directory.

Create a file named .env by copying the provided .env.example file (you must do this step locally if you created .env.example via GitHub):

Bash

cp backend/.env.example backend/.env
Edit the new backend/.env file with your actual credentials:

# backend/.env 

MONGO_URI="[YOUR ACTUAL MONGODB ATLAS CONNECTION STRING]"
EMAIL_API_KEY="[YOUR ACTUAL BREVO API KEY]"
EMAIL_SENDER="[SENDER EMAIL, e.g., mhoxha21@epoka.edu.al]"
BUDGET_ALERT_RECIPIENT="[RECIPIENT EMAIL, e.g., aalia21@epoka.edu.al]"
BUDGET_LIMIT=1000 
Step 3: Run the Application
You need two separate terminal windows for the backend and frontend.

1. Start the Backend API (Port 5000)
Bash

cd backend
npm install
npm start
2. Start the Frontend App (Port 3000)
Bash

cd frontend
npm install
npm start
The application should automatically open in your browser at http://localhost:3000.

✅ Design Decisions & Technical Notes
1. Budget Alert Logic (Required Integration)
Trigger: The email alert is sent when the creation of a new expense causes the running total spending (aggregated from all categories) to exceed the BUDGET_LIMIT defined in the backend's .env file.

Service: Brevo was used for the integration. The code includes basic error handling to log any email failure without crashing the server.

2. Adherence to Coding Standards
Consistent Responses: All API routes return a consistent structure: { ok: true, data: ... } for success or { ok: false, error: ... } for failure.

Early Returns: Used extensively in Express routes to check for invalid input or missing resources before continuing logic.

Data Structure: Adheres to the requirement of keeping data flat, utilizing two separate Mongoose models/collections (Category and Expense) linked by categoryId.

⏰ Time Spent & Challenges
Estimated Total Time Spent: [2:30 hours] 

Key Challenges Encountered:
Git Secret-Scanning Resolution: The most challenging part was accidentally committing the Brevo API key, which was blocked by GitHub's Push Protection. This was resolved by using git filter-branch to rewrite the entire commit history and then performing a force push (git push --force), ensuring no secrets remain in the public repository history.

State Management: Ensuring the React frontend correctly updated the total spending summaries and displayed budget alerts immediately after an expense was added required careful synchronization of component state.
---
## 🖼 Application Screenshots

The image below showcases the core functionality of the expense tracker, including categorized totals and the budget alert system.

### Expense Dashboard

![Expense Tracker Dashboard Screenshot] (assets/[dashboard_screenshot.png])

---
Thank you for the opportunity to complete this assessment.
