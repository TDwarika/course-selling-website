const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(cors());

app.use("/admin" , adminRoutes);
app.use("/users",userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://tangududwarika18:lKP93a6ltCvGgrnh@cluster0.moern1l.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});