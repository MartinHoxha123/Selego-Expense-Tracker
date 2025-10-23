// backend/services/emailService.js

import * as Brevo from '@getbrevo/brevo'; // The correct, current Brevo SDK package
import dotenv from 'dotenv';
dotenv.config();

// --- Configuration ---
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set up API Key Authentication
const apiKey = apiInstance.authentications.apiKey;
apiKey.apiKey = process.env.EMAIL_API_KEY;

const SENDER_EMAIL = process.env.EMAIL_SENDER || 'no-reply@expensetracker.com';
const RECIPIENT_EMAIL = process.env.BUDGET_ALERT_RECIPIENT || 'admin@example.com';

// --- Service Function ---

/**
 * Sends a budget alert email if the total spending exceeds the budget limit.
 * This function sends an email asynchronously and does not block the API response.
 * * @param {number} totalSpent - The current total expense amount.
 * @param {number} limit - The defined budget limit from the .env.example file.
 */
export const sendBudgetAlert = async (totalSpent, limit) => {
    if (!process.env.EMAIL_API_KEY) {
        console.warn("⚠️ Email alert skipped: EMAIL_API_KEY is not set in .env.example.");
        return;
    }

    // Create the email payload using the SDK's SendSmtpEmail model
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
        email: SENDER_EMAIL,
        name: "Expense Tracker Alert"
    };
    sendSmtpEmail.to = [{
        email: RECIPIENT_EMAIL
    }];
    sendSmtpEmail.subject = "🚨 BUDGET ALERT: Spending Exceeded Limit!";
    sendSmtpEmail.textContent = `
    Dear Administrator,

    Your company's total spending has exceeded the budget limit of $${limit.toFixed(2)}.
    The current total spending is $${totalSpent.toFixed(2)}.

    Action required: Please review the expense dashboard immediately.
  `;

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Budget alert email sent successfully.', response.body);
        return {
            ok: true,
            message: `Email sent to ${RECIPIENT_EMAIL}`
        };
    } catch (error) {
        // Log the error but do NOT crash the application (as per common best practice)
        console.error(
            '❌ Error sending budget alert email:',
            error.response ? error.response.text : error.message
        );
        return {
            ok: false,
            error: 'Email service failed to send'
        };
    }
};