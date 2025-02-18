const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// Dégager les trucs google

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ error: "No password or email provided" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    console.log("💾 Saving user:", user);

    await user.save();

    console.log("✅ User saved successfully!");

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ message: " register Successful", success: true, token: token });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res
      .status(500)
      .json({ err: "erreur lors de la creation de profile", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "no password or email provided" });
    }

    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, lobbies: user.lobbies },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: true, // Only send over HTTPS in production
      sameSite: "false", // Protect against CSRF attacks
      path: "/",
    });

    console.log("✅ Cookie envoyé:", res.getHeaders()["set-cookie"]);

    res
      .status(200)
      .json({ message: " login Successful", success: true, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ err: "erreur lors de la creation de profile", error });
  }
};

const getUsers = async (req, res) => {
  console.log("🍪 Cookies:")

  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des lobbies.", error });
  }
};



const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token"); // Supprime le cookie JWT
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la déconnexion", error });
  }
};

const getUsersById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des lobbies.", error });
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.updateOne({ _id: id }, req.body);

    console.log(req.body);

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des lobbies.", error });
  }
};

const getOwnUserId = async (req, res) => {
  try {
    const id = req.user.id;
    res.json({ id });
  } catch (error) {
    res.json({ error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUsersById,
  updateUserById,
  logOutUser,
  getOwnUserId
};
