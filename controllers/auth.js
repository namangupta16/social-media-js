const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jsw = require("jsonwebtoken")

authController.post('/register', async(req, res) => {
    try{
        const isExisting = await User.findOne({email: req.body.email})

        if(isExisting){
            return res.status(500).json({msg: "Email is already used."})
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({...req.body,password: hashedPassword})

        const {password, ...others} = newUser._doc
        const token = jsw.sign({id: newUser._id}, process.env.JWT_SECRET,{expiresIn: '4h'})

        return res.status(201).json({user: others, token})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

authController.post("/login", async(req,res) => {
    try {

        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(500).json({msg: 'Wrong Credentials. Try again'})
        }

        const comparePass = await bcrypt.compare(req.body.password, user.$assertPopulated.password)
        if(!comparePass){
            return res.status(500).json({msg: 'Wrong Credentials. Try again'})
        }
        const {password, ...others} = user._doc
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '4h'})
        return res.status(200).json({user: others, token})


    } catch (error){
        return res.status(500).json(error.message)

        }
    
})

module.exports = authController