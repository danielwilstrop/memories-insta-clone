const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in to do that!"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error){
            return res.status(401).json({ error: "You must be logged in to do that!"})
        }

        const { _id } = payload
        User.findById(_id)
        .then((data) => {
            req.user = data
            next()
        }) 
    })
}