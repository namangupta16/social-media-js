const express = require('express')
const dotenv = require('dotenv').config()
//const mongoose = require('mongoose')
const authController = require('./controllers/auth')
const commentController = require('./controllers/comment')
const postController = require('./controllers/post')
const userController = require('./controllers/user')
const app = express()

//conect db

const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://naman:naman@cluster0.6gnbn21.mongodb.net/cluster0?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

connectToDatabase();



//mongoose.connect(process.env.MONGO, () => console.log('DB is connected successfully'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/user', userController)
app.use('/post',postController)
app.use('/comment', commentController)

//connect server
app.listen(process.env.PORT, () => console.log('Server connected successfully'))

