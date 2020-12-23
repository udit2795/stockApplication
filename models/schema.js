const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    phone: Number,
    stocks: [{
        name: String,
        code: String,
        quantity: Number,
        buyingPrice: Number
    }]
});

const stockSchema = new mongoose.Schema({
    name: String,
    code: String,
    price: String,
    high: Number,
    low: Number
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next()
    } catch (e) {
        next(e)
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (e) {
        console.error("Error while validating password.", e);
        throw new Error("Unable to validate password");
    }
};

const USER = mongoose.model('user', userSchema);
const STOCK = mongoose.model('stock', stockSchema);

module.exports = {
    USER: USER,
    STOCK: STOCK
};

