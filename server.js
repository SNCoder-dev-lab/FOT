import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "PASTE_YOUR_API_KEY_HERE";

app.post("/chat", async (req, res) => {
  const { message, subject } = req.body;

  let subjectInstruction = "";

  if (subject === "math") {
    subjectInstruction = "Explain step-by-step like a maths teacher.";
  } else if (subject === "science") {
    subjectInstruction = "Explain clearly with simple science concepts.";
  } else if (subject === "english") {
    subjectInstruction = "Help improve writing and explain grammar.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are FOT AI, a study assistant.

Rules:
- Help learning, not cheating
- Explain step-by-step
- Be clear and simple

Subject: ${subject}
Instruction: ${subjectInstruction}

Student: ${message}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Error talking to AI" });
  }
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));