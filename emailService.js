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

async function sendQuizResults({ firstName, email, answers }) {
  const htmlBody = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for completing the quiz. Here are your answers:</p>
    ${formatAnswers(answers)}
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
