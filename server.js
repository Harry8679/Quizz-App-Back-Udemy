require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log("Erreur de connexion MongoDB :", err));

// app.use("/api/auth", require("./routes/auth.route"));
// app.use("/api/quiz", require("./routes/quiz.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/quiz", require("./routes/quiz.route"));
app.use("/api/score", require("./routes/score.route"));


const PORT = process.env.PORT || 4900;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));