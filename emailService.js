const nodemailer = require("nodemailer");
const fs = require("fs");
const juice = require("juice");
const handlebars = require("handlebars");

require("dotenv").config();

const rawHtml = fs.readFileSync("emailTemplate.html", "utf8");
const template = handlebars.compile(rawHtml);

const categoryDisplayNames = {
  physical: "Physical Development",
  cognitive: "Cognitive Development",
  social: "Social Development",
  emotional: "Emotional Development",
  systemic: "Systemic Development",
  playful: "Playful Behaviours",
};

const categoryColours = {
  physical: "rgba(132, 186, 121, 0.1)",
  cognitive: "rgba(180, 133, 214, 0.1)",
  social: "rgba(255, 168, 118, 0.1)",
  emotional: "rgba(155, 176, 239, 0.1)",
  systemic: "rgba(251, 153, 196, 0.1)",
  playful: "rgba(234, 215, 42, 0.1)",
};

const categoryBodiesHighest = {
  physical:
    "Physical movement is your thing! It helps you think and be at your best. You take pride in your physical health. It is very important to you.You are grounded and live in the present moment. You are open and willing try new things. You delight in pushing yourself to test your limits.",
  emotional:
    "You feel all your feels and can name your emotions as they emerge. You remain grounded in spite of internal and external turmoil. You are able to feel joy and enjoy yourself and life itself.",
  cognitive:
    "You are curious about everything! Your mind races at a hundred miles an hour. Problem solving is your superpower.  No problem too big or too small. You value logical reasoning over jumping to conclusions. You think for yourself. You express yourself clearly to others.",
  systemic:
    "You recognise there are things you can change and accept things you cannot not. You trust yourself in distinguishing between the two. You know that everyone and everything has a place and that a sense of belonging begins with yourself.",
  social:
    "You are passionate about people. You are thrive on collaboration and conflict resolution and everything in between. You understand and respect rules and boundaries. You seek help and support from those around when needed.",
  playful:
    "You can find the answer to any problem or situation and help make things better. You take responsibility for your feelings, thoughts and actions. You come from a place of mutual respect in your interactions. You almost never give up and try, try again - differently. You talk your talk, walk you walk and dance your dance. You are you.",
};

const categoryBodiesLowest = {
  physical:
    "You enjoy exercising your mind over exercising your body. You view your body as simply a means for getting around. It's your mind that gets you from A to B. You may feel anxious at times. Uncertainty is your nemesis. You prefer sticking with what you know instead of venturing into the unknown.",
  emotional:
    "You tend to find it difficult to deal with emotions - in yourself and in others. There are times you don't know how you really feel. You may find it a struggle to feel joy and enjoy yourself and life itself.",
  cognitive:
    "You prefer to accept things are they are instead of wondering how things can be different. You're not keen on change or new experiences. You keep your opinions to yourself. It is not easy to share what you really think. You prefer to go with the flow to avoid conflict.",
  systemic:
    "You find it hard to accept people and situations as they are. You tend to second-guess people and things. You find it difficult to trust yourself. You tend to feel like a fish out of water when it comes to belonging in groups and communities.",
  social:
    "You prefer to work on your own than with others. You tend to challenge rules and boundaries because you view them as constraining rather than enabling. You don't feel supported by those around you and tend to be unwilling to ask for help when you need it.",
  playful:
    "You struggle to solve problems or resolve situations. You don't take responsibility for your feelings, thoughts and actions. You don't respect yourself and / or others. It is difficult for you to bounce back from challenges and difficulties. You hide your authentic self from others and possibly also yourself.",
};

function processAnswers(answers) {
  const categoryScores = {
    physical: 0,
    cognitive: 0,
    social: 0,
    emotional: 0,
    systemic: 0,
    playful: 0,
  };

  let overallTotal = 0;

  for (const { category, answer } of answers) {
    if (categoryScores.hasOwnProperty(category)) {
      categoryScores[category] += answer;
      overallTotal += answer;
    }
  }

  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const [highestKey, highestScore] = sorted[0];
  const [lowestKey, lowestScore] = sorted[sorted.length - 1];

  return {
    overallPercentage: Math.round((overallTotal / (answers.length * 5)) * 100),
    physical: categoryScores.physical,
    cognitive: categoryScores.cognitive,
    social: categoryScores.social,
    emotional: categoryScores.emotional,
    systemic: categoryScores.systemic,
    playful: categoryScores.playful,
    highestTitle: categoryDisplayNames[highestKey],
    highestBody: categoryBodiesHighest[highestKey],
    lowestTitle: categoryDisplayNames[lowestKey],
    lowestBody: categoryBodiesLowest[lowestKey],
    highestColour: categoryColours[highestKey],
    lowestColour: categoryColours[lowestKey],
    answerA: answers[0].answer,
    answerB: answers[1].answer,
    answerC: answers[2].answer,
    answerD: answers[3].answer,
    answerE: answers[4].answer,
    answerF: answers[5].answer,
    answerG: answers[6].answer,
    answerH: answers[7].answer,
    answerI: answers[8].answer,
    answerJ: answers[9].answer,
    answerK: answers[10].answer,
    answerL: answers[11].answer,
    answerM: answers[12].answer,
    answerN: answers[13].answer,
    answerO: answers[14].answer,
    answerP: answers[15].answer,
    answerQ: answers[16].answer,
    answerR: answers[17].answer,
    answerS: answers[18].answer,
    answerT: answers[19].answer,
  };
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendQuizResults({ firstName, email, answers }) {
  const htmlVars = processAnswers(answers);
  const htmlWithVars = template({ firstName, ...htmlVars });

  const inlinedHtml = juice(htmlWithVars);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${firstName}, your results are in!`,
    html: inlinedHtml,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendQuizResults };
