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

router.post('/addData', controller.addData);
router.post('/buySellStock', controller.buySellStock);
router.get('/dashboard', authenticate.authenticate, controller.getDashboard);

module.exports = router;
