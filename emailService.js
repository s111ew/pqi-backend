const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // set to true if using port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatAnswers(answers) {
  return Object.entries(answers)
    .map(
      ([question, answer]) => `<p><strong>${question}:</strong> ${answer}</p>`
    )
    .join("");
}

function getTotal(answers) {
  let total = 0;
  let max = 0;

  for (const category in answers) {
    const scores = Object.values(answers[category]);
    for (const value of scores) {
      const score = Number(value);
      if (!isNaN(score)) {
        total += score;
        max += 5;
      }
    }
  }

  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
  return `<h2>${percentage} %</h2>`;
}

function getCategoryTotal(categ8ory, answers) {
  let total = 0;
  let max = 0;

  const scores = Object.values(answers[category]);
  for (const value of scores) {
    const score = Number(value);
    if (!isNaN(score)) {
      total += score;
      max += 5;
    }
  }

  return `<span>${total} out of ${max}</span>`;
}

async function sendQuizResults({ firstName, email, answers }) {
  const htmlBody = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for completing the PQI quiz!</p>
    <p>Your Play Genius Score:</p>
    ${getTotal(answers)}
    <p>These are your results grouped by categories:</p>
    <p>Physical Development: ${getCategoryTotal("physical", answers)}</p>
    <p>Emotional Development: ${getCategoryTotal("emotional", answers)}</p>
    <p>Cognitive Development: ${getCategoryTotal("cognitive", answers)}</p>
    <p>Systemic Development: ${getCategoryTotal("systemic", answers)}</p>
    <p>Social Development: ${getCategoryTotal("social", answers)}</p>
    <p>Playful Behaviours: ${getCategoryTotal("playful", answers)}</p>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Your Quiz Results",
    html: htmlBody,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendQuizResults };
