const express = require('express');
const router = express.Router();
const { getMeetings, getAdminMeetings, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

router.get('/', getMeetings);
router.get('/admin', protect, getAdminMeetings);
router.post('/', protect, createMeeting);
router.put('/:id', protect, updateMeeting);
router.delete('/:id', protect, deleteMeeting);

module.exports = router;
