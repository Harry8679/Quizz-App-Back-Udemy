const express = require("express");
const Question = require("../models/question.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * 📌 1️⃣ Ajouter une nouvelle question
 * 🔐 Route protégée (nécessite une authentification)
 */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { question, options, category, difficulty } = req.body;

    // 🛑 Vérifier si tous les champs nécessaires sont présents
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Une question doit avoir au moins 2 options valides." });
    }

    // 🛑 Vérifier si une seule réponse est correcte
    const correctAnswers = options.filter(opt => opt.isCorrect === true);
    if (correctAnswers.length !== 1) {
      return res.status(400).json({ error: "Une question doit avoir UNE seule bonne réponse." });
    }

    // ✅ Création de la nouvelle question
    const newQuestion = new Question({ question, options, category, difficulty });
    await newQuestion.save();

    res.status(201).json({ message: "Question ajoutée avec succès !" });
  } catch (err) {
    console.error("Erreur lors de l'ajout de la question :", err);
    res.status(500).json({ error: "Erreur serveur lors de la création de la question." });
  }
});


/**
 * 📌 2️⃣ Récupérer 10 questions aléatoires selon la catégorie et la difficulté
 * 🔓 Accessible sans authentification
 */
router.get("/:category/:difficulty", async (req, res) => {
  try {
    const { category, difficulty } = req.params;

    // 🛑 Vérifier que la catégorie et la difficulté sont fournies
    if (!category || !difficulty) {
      return res.status(400).json({ error: "Veuillez spécifier une catégorie et une difficulté." });
    }

    const questions = await Question.aggregate([
      { $match: { category, difficulty } },
      { $sample: { size: 10 } } // Prendre 10 questions aléatoires
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ error: "Aucune question trouvée pour cette catégorie et difficulté." });
    }

    res.json(questions);
  } catch (err) {
    console.error("Erreur lors de la récupération des questions :", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des questions." });
  }
});


/**
 * 📌 3️⃣ Supprimer une question par son ID
 * 🔐 Route protégée (nécessite une authentification)
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question supprimée avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la suppression de la question :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression." });
  }
});

module.exports = router;