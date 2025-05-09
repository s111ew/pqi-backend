const express = require("express");
const bodyParser = require("body-parser");
const { sendQuizResults } = require("./emailService");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // You can specify your frontend's URL here
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

app.post("/send-results", async (req, res) => {
  const { firstName, email, answers } = req.body;

  if (!firstName || !email || !answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    await sendQuizResults({ firstName, email, answers });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).send(`Route ${req.originalUrl} not found`);
});
