const _ = require('lodash');

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

module.exports = {
    setData: setData,
    getProfileData: getProfileData,
    modifyData: modifyData
};
