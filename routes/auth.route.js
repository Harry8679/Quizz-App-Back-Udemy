const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const verifyToken = require("../middlewares/auth.middleware");
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// 📌 Inscription utilisateur
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'email ou le username existent déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

// 📌 Connexion utilisateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

// 📌 Récupérer les informations du profil de l'utilisateur
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la récupération du profil" });
  }
});

module.exports = router;