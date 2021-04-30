const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/user')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/signup', (req, res) => {
    const {name, email, password, confirmPassword, pic } = req.body
    if(!name || !email || !password) {
        return res.status(422).json({ error: 'Please ensure you have entered a name, email and password' })
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ error: 'Passwords do not match' })
    }

    if (password.length < 8) {
        return res.status(422).json({ error: 'Password must be at least 8 charachters' })
    }

    User.findOne({ email:email })
    .then((saveduser) => {
        if (saveduser){
            return res.status(422).json({ error: 'Email address is already in use' }) 
        }

        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                name,
                email,
                password: hashedpassword,
                followers: [],
                following: [],
                pic
            })
            user.save()
            .then((user) => {
                User.findByIdAndUpdate(user._id,{
                    $push:{following:user._id}
                },{
                    new:true
                },(err,result)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                })
                res.json({ message: "Account Created Successfully"})
            })
            .catch(error => {
                return res.status(422).json({ error: error }) 
            })
        })
        })
    .catch(error => {
        console.log(error)
    })
})

router.post('/signin', (req,res) => {
    const { email, password } = req.body
    res.json({ data: 'connected '})
    if(!email || !password){
        res.status(422).json({ error: "Please enter log-in details"})
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser){
                return res.status(422).json({ error: "Invalid email or Password"})
            }
            bcrypt.compare(password, savedUser.password)
            .then( match => {
                if (match){
                    // res.json({ message: "logged in!" })
                    const token = jwt.sign({ _id:savedUser._id }, process.env.JWT_SECRET)
                    const { _id, name, email, followers, following, pic } = savedUser
                    res.json({ token, user: { _id, name, email, followers, following, pic }})
                } else {
                    return res.status(422).json({ error: "Incorrect Password"})
                }
            })
            .catch(error => {
                console.log(error)
            })
        })
})

module.exports = router