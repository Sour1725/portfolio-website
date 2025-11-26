const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST Contact message
router.post('/', async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and message."
      });
    }

    const newContact = new Contact({ email, message });
    await newContact.save();

    console.log(`📨 New message received from ${email}`);

    res.status(201).json({
      success: true,
      message: "Message stored successfully!"
    });

  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong."
    });
  }
});

module.exports = router;
