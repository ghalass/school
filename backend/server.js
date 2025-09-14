require('dotenv').config()

const express = require('express')

const path = require('path')

const cookieParser = require('cookie-parser')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const prisma = require("./prismaClient");

const userRoutes = require('./routes/user')

// express app
const app = express()

const PORT = process.env.PORT || 5000;
const URL = process.env.URL || 'http://localhost';

// Enable CORS
app.use(cors(corsOptions));
app.use(cookieParser())

// allow json data
app.use(express.json())

// import static files
app.use('/', express.static(path.join(__dirname, "public")))

app.use(async (req, res, next) => {
    console.log(req.method, req.path);
    next();
})

// routes
app.use('/', require('./routes/root'))

app.use('/user', userRoutes)

// 404 route
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "./views/404.html"))
    } else if (req.accepts('json')) {
        res.json({ message: "404 Not Found" })
    } else {
        res.type('txt').send("404 Not Found")
    }
})

// PRISMA & RUN SERVER
prisma
    .$connect()
    .then(() => {
        // listen for requests
        app.listen(PORT, () => {
            console.log(`Connected to DB & listening on ${URL}:${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });

