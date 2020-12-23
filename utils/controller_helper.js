const _ = require('lodash');
const schemas = require('../models/schema');


const setData = (schema, data) => {
    _.each(data, (value, index) => {
        if (index === 'stocks') {
            value = JSON.parse(value);
        }
        if (value) {
            schema[index] = value
        }
    });
    return schema;
};

const getProfileData = (userData, stockData) => {
    let context = {};
    let myStock = userData.stocks;
    var myStockobj = myStock.reduce((obj, stock) => (obj[stock.code] = stock, obj), {});
    _.each(stockData, stock => {
        if (myStockobj[stock.code]) {
            myStockobj[stock.code].currentPrice = stock.price;
            delete stock.id;
        }
    });
    myStockobj = Object.entries(myStockobj).map((e) => (e[1]));
    myStockobj.sort((a, b) => (a.quantity > b.quantity) ? -1 : ((b.quantity > a.quantity) ? 1 : 0));
    context.profile = {
        name: userData.name,
        stock: myStockobj
    };
    return context;
};

const modifyData = (user, data) => {
    let stocks = user.stocks || [];
    const type = _.get(data, 'type', '');
    const code = _.get(data, 'code', '');
    if (type === 'buy') {
        let context = {
            name: _.get(data, 'name', ''),
            code: code,
            quantity: _.get(data, 'quantity', ''),
            buyingPrice: parseFloat(_.get(data, 'buyingPrice', ''))
        };
        stocks.push(context);
    }
    if (type === 'sell') {
        _.remove(stocks, (stock) => {
            return stock.code === code;
        })
    }
    user.stocks = stocks;
};

const checkDuplicate = async (data, type)=>{
    let isDuplicate = false;
    try {
        if(type === 'STOCK'){
            const stock = await schemas[type].find({code: data.code});
            if(!_.isEmpty(stock)){
                isDuplicate = true
            }
        }
        if (type === 'USER'){
            const user = await schemas[type].find({email: data.email});
            if(!_.isEmpty(user)){
                isDuplicate = true
            }
        }
    }catch (err) {
        console.error("Error while checking deduplication. Error", err)
    }
    return isDuplicate
};

module.exports = {
    setData: setData,
    getProfileData: getProfileData,
    modifyData: modifyData,
    checkDuplicate: checkDuplicate
};
