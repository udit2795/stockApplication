const _ = require('lodash');

const schemas = require('../models/schema');
const controllerHelper = require('../utils/controller_helper');


const addData = (req, res) => {
    const data = req.body;
    const type = _.get(data, 'type', '').toUpperCase();
    let schema = new schemas[type]();
    schema = controllerHelper.setData(schema, data);
    schema.save((err, saveObj) => {
        if (err) {
            console.error("addData:: Error in saving data. Error::", err);
            res.send('Error in saving data. Error::', err);
        } else {
            console.debug('data saved', saveObj);
            res.send('data saved');
        }
    })
};


const getDashboard = async (req, res) => {
    try {
        const userData = await schemas.USER.findOne({email: req.user}).lean();
        const stockData = await schemas.STOCK.find();
        let context = controllerHelper.getProfileData(userData, stockData);
        res.render('dashboard', {data: context});
    } catch (err) {
        console.error("Unable to fetch data. Error::", err);
        res.send("Unable to fetch data. Error::", err);
    }
};

const buySellStock = async (req, res) => {
    const data = req.body;
    const email = _.get(data, 'email', '');
    try {
        const userData = await schemas.USER.findOne({email: email});
        controllerHelper.modifyData(userData, data);
        userData.markModified('stocks');
        userData.save((err, saveObj) => {
            if (err) {
                res.send('error', err);
            } else {
                console.log('data saved', saveObj);
                res.send('data saved');
            }
        });
    } catch (err) {
        console.error("Error while updating data. Error::", err);
        res.send("Error while updating data. Error::", err);
    }
};


module.exports = {
    addData: addData,
    getDashboard: getDashboard,
    buySellStock: buySellStock
};
