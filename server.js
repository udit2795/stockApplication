const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cron = require('node-cron');
const http = require('http');
const _ = require('lodash');


const Strategy = require('./utils/validation');
const routers = require('./routes/index');
const updateCron = require('./utils/UpdateCron');
const initIO = require('./utils/ioConnection');


const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.set('layouts', 'layouts/layout');
app.use(express.static(`${__dirname}/public`));

const sessionMiddleware = session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routers);

app.get('/logout', async (req, res) => {
    const socketId = req.session.socketId;
    if (socketId && _.get(io.of("/"), ['connected', socketId])) {
        console.log(`forcefully closing socket ${socketId}`);
        io.sockets.connected[socketId].disconnect(true);
    }
    req.logout();
    res.cookie("connect.sid", "", {expires: new Date()});
    res.redirect('/');
});

passport.use(Strategy);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// wrapping passport with io
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
    next()
});
// initializing io

mongoose.connect('mongodb+srv://udit:sockFinance@cluster0.c9fsy.mongodb.net/user?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log('connected to db');
    initIO.init(io);
    cron.schedule('*/10 * * * * *', async () => {
        await updateCron.updatePrice(io);
    });
}).on('error', (err) => {
    console.log("Error in connecting DB. Error::", err)
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
    console.log(`listening on port ${port}`)
});

module.exports.io = io;

