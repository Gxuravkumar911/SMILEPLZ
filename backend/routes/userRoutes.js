const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, score: 0, maxScore: 0, earnings: 0 });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/leaderboard", async (req, res) => {
    try {
        const leaders = await User.find({ score: { $gt: 0 } }) 
            .sort({ maxScore: -1 }) 
            .limit(10) 
            .select("username score maxScore earnings"); 
        res.status(200).json(leaders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.post("/updateScore", async (req, res) => {
    const { username, newScore } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.score = newScore;
        user.maxScore = Math.max(user.maxScore, newScore);
        user.earnings = user.maxScore * 0.001; // Earnings logic
        await user.save();

        res.status(200).json({ message: "Score updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/getMaxScore", async (req, res) => {
    const { username } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ maxScore: user.maxScore });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
module.exports = router;
