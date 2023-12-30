const mongoose = require('mongoose');
const express = require('express');
const { User, Course, Admin } = require('../db/index');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');
const { authenticateJwt } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin) {
        res.status(403).json({ message: "Admin already exists" });
    } else {
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        const token = jwt.sign({ username, role: 'Admin' }, SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "Admin Created Successfully", token });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.get('/me', authenticateJwt, async (req, res) => {
    let admin = undefined;
    if (req.user)
        admin = await Admin.findOne({ username: req.user.username });

    if (admin) {
        res.json({ username: admin.username });
    }
    else {
        res.sendStatus(403);
    }
})

router.post('/courses', authenticateJwt, async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course._id });
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const id = req.params.courseId;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(403).json({ message: 'Course not found' });
    }
});
router.get('/courses/:courseId', authenticateJwt, async (req, res) => {
    const id = req.params.courseId;
    const course = await Course.findOne({ _id: id });
    if (course) {
        res.json({ course: course });
    }
    else {
        res.status(404).json({ message: 'Course not Found' });
    }
})


router.delete('/courses/:courseId', authenticateJwt, async (req, res) => {
    let id = req.params.courseId;

    const course = await Course.findByIdAndDelete({ _id: id });

    if (course) {
        res.json({ message: 'Course deleted successfully' })
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({});
    res.json({ courses: courses });
});
module.exports = router;
