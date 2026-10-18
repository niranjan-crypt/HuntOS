const express = require('express');
const router = express.Router();
const {
  extractDetails,
  generateInterviewPrep,
  reviewResumeATS,
  generateCoverLetter,
} = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected AI Routes
router.post('/extract', authMiddleware, extractDetails);
router.post('/prep', authMiddleware, generateInterviewPrep);
router.post('/ats-review', authMiddleware, reviewResumeATS);
router.post('/cover-letter', authMiddleware, generateCoverLetter);

module.exports = router;
