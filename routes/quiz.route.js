const express = require("express");
const Question = require("../models/question.model");

const router = express.Router();

// 📌 Récupérer une liste de questions aléatoires
router.get("/", async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]); // 5 questions aléatoires
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de la récupération des questions." });
  }
});

module.exports = router;