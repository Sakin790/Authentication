import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { default as connectDB } from "./db/db.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is Running at Port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoBD Connection failed", error);
  });

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// User Schema and Model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  email: {
    type: String,
    
    unique: true,
  },
  password: {
    type: String,
    
  },
  isAdmin: {
    type: Boolean, // Optional: Add an isAdmin flag if needed
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

// Hash Password before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT for user authentication
const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "snbdshdbn", {
    expiresIn: "1h",
  });
};

app.get("/", (req, res) => {
  res.status(200).json({
    message: " Auth Server Working",
  });
});

// User Registration Endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
     const user = await User.create({
      name: name.toLowerCase(),
      email,
      password,
     
    });

    const savedUser = await user.save();
    const token = generateToken(savedUser);
    res.status(201).json({ user: savedUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// User Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
 

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser);
    res.json({ token }); // Send only the token upon successful login
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed",err });
  }
});

// Add this route and its implementation below the login endpoint:

// Password Change Endpoint
app.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Basic validation
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save updated user with the new password
    const savedUser = await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password change failed" });
  }
});
