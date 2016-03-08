var School = require('../models/school');

module.exports = {
    getTowns: function (req, res) {
        School.find().distinct('Town', function (err, towns) {
            if (!err) {
                res.json(towns);
            } else {
                res.status(500).json({ error: 'Something went wrong.' });
            }
        })
    },
    getSchools: function (req, res) {
        var town = req.params['town'],
            query = town ? { 'Town': town } : undefined;

        School.find(query, function (err, schools) {
            if (!err) {
                res.json(schools);
            } else {
                res.status(500).json({ error: 'Something went wrong.' });
            }
        });
    },
    addSchool: function (req, res) {
        new School(req.body).save(function (err, school) {
            if (!err) {
                res.json(school._id);
            } else {
                res.status(500).json({ error: 'Something went wrong.' });
            }
        });
    }
};
