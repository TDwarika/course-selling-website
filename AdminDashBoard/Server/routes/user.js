const mongoose = require('mongoose');
const express = require('express');
const { User, Course, Admin } = require('../db/index');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');
const { authenticateJwt } = require('../middleware/auth');

const router = express.Router();

//User routes
router.post('/signup', async (req, res) => {
    // logic to sign up user
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (user) {
        res.status(403).json({ message: "User already Exists" });
    }
    else {
        const user = new User({ username, password });
        await user.save();
        const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User Created Successfully", token });
    }
});

router.post('/login', async (req, res) => {
    // logic to log in user
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (user) {
        const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.get('/me', authenticateJwt, async (req, res) => {
    let user = undefined;
    if (req.user)
        user = await Admin.findOne({ username: req.user.username });

    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.sendStatus(403);
    }
});

router.get('/courses', authenticateJwt, async (req, res) => {
    // logic to list all courses
    const courses = await Course.find({ published: "Yes" });
    res.json({ courses: courses });
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
});

router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    // logic to purchase a course
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (course) {
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            user.purchasedCourses.push(course);
            await user.save();
            res.json({ message: 'Course purchased successfully' });
        } else {
            res.status(403).json({ message: 'User not found' });
        }
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    // logic to view purchased courses
    const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses || [] });
    }
    else {
        res.status(403).json({ message: 'User not found' });
    }
});
module.exports = router;
