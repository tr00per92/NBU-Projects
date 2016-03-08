var mongoose = require('mongoose');

module.exports = mongoose.model('School', new mongoose.Schema({
    Name: String,
    Address: String,
    Town: String,
    Email: String
}));
