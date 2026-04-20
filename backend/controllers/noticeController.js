const Notice = require('../models/Notice');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a new notice (Admin only)
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
  try {
    const { title, content, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const notice = new Notice({
      title,
      content,
      priority: priority || 'normal',
      createdBy: req.user._id
    });

    const savedNotice = await notice.save();
    await savedNotice.populate('createdBy', 'name email');

    // Create notifications for all students
    try {
      const students = await User.find({ role: 'student' });
      const notificationPromises = students.map(student => 
        createNotification(
          student._id,
          'student',
          'New Notice Posted',
          `${title}: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
          'notice',
          savedNotice._id
        )
      );
      await Promise.all(notificationPromises);
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
    }

    res.status(201).json(savedNotice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notices (Admin & Students)
// @route   GET /api/notices
// @access  Private
const getAllNotices = async (req, res) => {
  try {
    const { activeOnly = false } = req.query;
    
    let filter = {};
    if (activeOnly === 'true') {
      filter.isActive = true;
    }

    const notices = await Notice.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a notice (Admin only)
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
  try {
    const { title, content, priority, isActive } = req.body;
    const noticeId = req.params.id;

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Update fields
    if (title) notice.title = title;
    if (content) notice.content = content;
    if (priority) notice.priority = priority;
    if (typeof isActive === 'boolean') notice.isActive = isActive;

    const updatedNotice = await notice.save();
    await updatedNotice.populate('createdBy', 'name email');

    res.json(updatedNotice);
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notice (Admin only)
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(noticeId);

    res.json({ 
      message: 'Notice deleted successfully',
      deletedNotice: {
        _id: notice._id,
        title: notice.title
      }
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle notice active status (Admin only)
// @route   PATCH /api/notices/:id/toggle
// @access  Private/Admin
const toggleNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.isActive = !notice.isActive;
    const updatedNotice = await notice.save();
    await updatedNotice.populate('createdBy', 'name email');

    res.json(updatedNotice);
  } catch (error) {
    console.error('Error toggling notice:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
  toggleNotice
};
