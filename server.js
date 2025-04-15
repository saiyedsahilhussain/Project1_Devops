require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')

// 🛠 Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL)
const connection = mongoose.connection

connection.once('open', () => {
    console.log('Database connected...')
})

connection.on('error', (err) => {
    console.log('Database connection failed:', err)
})

// 💾 Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// 📣 Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// 🧠 Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

// 🛂 Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// ✨ Flash messages
app.use(flash())

// 🎨 Static assets & body parsing
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 🌐 Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// 🧩 Templating engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// 📦 Routes
require('./routes/web')(app)
app.use((req, res) => {
    res.status(404).render('errors/404')
})

// 🚀 Start server
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// 🔌 Socket.io
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

// 📡 Socket events
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
