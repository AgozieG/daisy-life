import dns from 'node:dns';
import nodemailer from 'nodemailer';
import { buildReceiptMessage } from '../utils/buildReceiptMessage.js';

dns.setDefaultResultOrder('ipv4first');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error('SMTP credentials are missing. Add SMTP_USER and SMTP_PASS to the backend .env file.');
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      family: Number(process.env.SMTP_FAMILY || 4),
      port: Number(SMTP_PORT || 587),
      secure: String(SMTP_SECURE || 'false') === 'true',
      requireTLS: Number(SMTP_PORT || 587) === 587,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS.replace(/\s+/g, ''),
      },
    });
  }

  return transporter;
}

function getFromAddress() {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || 'georgeiwunna@gmail.com';
}

function getRecipientAddress() {
  return process.env.EMAIL_TO || 'agozieiwunna@gmail.com';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

export async function sendOrderReceiptEmail(orderData) {
  const message = buildReceiptMessage(orderData);
  const { reference } = orderData;

  const mailOptions = {
    from: getFromAddress(),
    to: getRecipientAddress(),
    subject: `Daisy Life New Order: ${reference}`,
    text: message,
    html: `<pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${escapeHtml(message)}</pre>`,
  };

  return getTransporter().sendMail(mailOptions);
}

export const sendWhatsAppReceipt = sendOrderReceiptEmail;
