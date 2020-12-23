const schemas = require('../models/schema');
const _ = require('lodash');


const updatePrice = async (io) => {
    try {
        const stocks = await schemas.STOCK.find();
        _.each(stocks, stock => {
            stock.price = parseFloat((Math.random() * _.get(stock, 'price', 2)).toFixed(2)) + 1;
            stock.save((err, saveObj) => {
                if (err) {
                    console.error("addData:: Error in saving data. Error::", err);
                } else {
                    io.sockets.emit('price-change', {code: saveObj.code, price: saveObj.price});
                }
            });
        })
    } catch (err) {
        console.error("Error while updating price via cron. Error::", err);
    }
};
module.exports = {
    updatePrice: updatePrice,
};
