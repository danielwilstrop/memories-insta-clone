const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const authRoutes = require('./routes/auth.js')
const postRoutes = require('./routes/post.js')
const userRoutes = require('./routes/user')
const path = require('path')
const cors = require('cors')

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true,  useUnifiedTopology: true })

//Test mongo connection
// mongoose.connection.on('connected', () => {
//     console.log('connected!')
// })
// mongoose.connection.on('error', () => {
//     console.log('mongo connection error')
// })

require('./models/user')
require('./models/post')

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')))

    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
}

app.use(cors())
app.use(express.json())
app.use(authRoutes)
app.use(postRoutes)
app.use(userRoutes)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})