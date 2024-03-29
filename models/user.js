const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    sandi: {
        type: String,
        required: true
    },
    penyakit: []
});

module.exports = mongoose.model('User', userSchema);