const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const SECRET = 'SECr3t';
// This should be in an environment variable in a real applicatio
const authenticateJwt = (req, res, next) => {
  const checkToken = req.headers.authorization;
  if (checkToken) {
    const token = checkToken.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
  else {
    res.sendStatus(403);
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const adminSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
});
const courseSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  imageLink: { type: String },
  published: { type: String }
});
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);


mongoose.connect('mongodb+srv://tangududwarika18:lKP93a6ltCvGgrnh@cluster0.moern1l.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });


// Admin routes
app.post('/admin/signup', async (req, res) => {
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

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/admin/me', authenticateJwt, async (req, res) => {
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

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course._id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(403).json({ message: 'Course not found' });
  }
});
app.get('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findOne({ _id: id });
  if (course) {
    res.json({ course: course });
  }
  else {
    res.status(404).json({ message: 'Course not Found' });
  }
})


app.delete('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  let id = req.params.courseId;

  const course = await Course.findByIdAndDelete({ _id: id });

  if (course) {
    res.json({ message: 'Course deleted successfully' })
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses: courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
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

app.post('/users/login', async (req, res) => {
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
app.get('/user/me', authenticateJwt, async (req, res) => {
  let user = undefined;
  if (req.user)
    user = await Admin.findOne({ username: req.user.username });

  if (user) {
    res.json({ username: user.username });
  }
  else {
    res.sendStatus(403);
  }
})
app.get('/users/courses', authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: "Yes" });
  res.json({ courses: courses });

});
app.get('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findOne({ _id: id });
  if (course) {
    res.json({ course: course });
  }
  else {
    res.status(404).json({ message: 'Course not Found' });
  }
})
app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
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

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  }
  else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
