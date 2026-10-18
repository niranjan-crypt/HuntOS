const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  exportApplications,
  getStats,
  getActivity,
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Specific routes before /:id
router.get('/stats', getStats);
router.get('/activity', getActivity);
router.get('/export', exportApplications);

// Standard CRUD
router.get('/', getApplications);
router.post('/', createApplication);
router.get('/:id', getApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
