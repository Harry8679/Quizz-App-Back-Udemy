const express = require("express");
const Score = require("../models/score.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// 📌 Ajouter un score
router.post("/", verifyToken, async (req, res) => {
  try {
    const { score } = req.body;
    const newScore = new Score({ userId: req.userId, score });
    await newScore.save();
    res.status(201).json({ message: "Score enregistré avec succès !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement du score." });
  }
});

// 📌 Récupérer les scores d'un utilisateur
router.get("/", verifyToken, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des scores." });
  }
});

module.exports = router;