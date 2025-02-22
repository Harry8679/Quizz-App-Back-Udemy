const express = require("express");
const Question = require("../models/question.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * 📌 Ajouter une question avec des options, une catégorie et une difficulté
 */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { question, options, category, difficulty } = req.body;

    // Vérifier que la question et ses options existent
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: "Une question doit avoir au moins 2 options." });
    }

    // Vérifier qu'il y a exactement UNE bonne réponse
    const correctAnswers = options.filter(opt => opt.isCorrect === true);
    if (correctAnswers.length !== 1) {
      return res.status(400).json({ error: "Une question doit avoir UNE seule bonne réponse." });
    }

    // Création de la question
    const newQuestion = new Question({ question, options, category, difficulty });
    await newQuestion.save();

    res.status(201).json({ message: "Question ajoutée avec succès !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de la création de la question." });
  }
});

module.exports = router;