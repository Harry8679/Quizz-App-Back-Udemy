const express = require("express");
const Question = require("../models/question.model");

const router = express.Router();

// 📌 Récupérer 10 questions aléatoires selon une catégorie
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.aggregate([
      { $match: { category } }, // Filtrer par catégorie choisie
      { $sample: { size: 10 } } // Sélectionner 10 questions aléatoires
    ]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des questions." });
  }
});

module.exports = router;