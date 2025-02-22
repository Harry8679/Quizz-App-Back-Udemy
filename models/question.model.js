const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true }, // Texte de l'option
      isCorrect: { type: Boolean, required: true }, // Si cette réponse est correcte
    }
  ],
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true }
});

module.exports = mongoose.model("Question", QuestionSchema);
