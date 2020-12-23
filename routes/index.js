const router = require('express').Router();
const passport = require('passport');
const io = require('../server');



const controller = require('../controller/controller');
const authenticate = require('../utils/auth')

router.get('/', (req, res) => {
    res.render('index.html');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
    async (req, res) => {
        // If this function gets called, authentication was successful.
        res.redirect('/dashboard');
    });

router.post('/addUser', controller.addData);
router.post('/buySellStock', controller.buySellStock);
router.get('/dashboard', authenticate.authenticate, controller.getDashboard);
// router.get('/logout', async (req, res) => {
//     const socketId = req.session.socketId;
//     console.log("===>>> io",io());
//     if (socketId && io.of("/").connected[socketId]) {
//         console.log(`forcefully closing socket ${socketId}`);
//         io.sockets.connected[socketId].disconnect(true);
//     }
//     req.logout();
//     res.cookie("connect.sid", "", { expires: new Date() });
//     res.redirect('/');
// });

module.exports = router;
