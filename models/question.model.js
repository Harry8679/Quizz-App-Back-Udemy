const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  category: { type: String, enum: ["maths", "physique", "chimie", "informatique"], required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true }
});

module.exports = mongoose.model("Question", QuestionSchema);