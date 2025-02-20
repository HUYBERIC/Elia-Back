const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res
      .status(200)
      .json({ message: " register successful.", success: true, token: token });
  } catch (error) {
    console.error("❌ Registration failed:", error);
    res
      .status(500)
      .json({ err: "Error while creating profile.", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "No password or email provided" });
    }

    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found." });
    }

    console.log(user);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password.");
      return res.status(401).json({ message: "Incorrect password." });
    }
    console.log(isPasswordValid);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        lobbies: user.lobbies,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    console.log(token);
    res
      .status(200)
      .json({ message: " register Successful", success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Error while logging in.", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching lobbies.", error });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token"); // Supprime le cookie JWT
    res.status(200).json({ message: "Disconnected successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error while disconnecting.", error });
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
      .json({ message: "Error while fetching lobbies.", error });
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.updateOne({ _id: id }, req.body);

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching lobbies.", error });
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
  getOwnUserId,
};
