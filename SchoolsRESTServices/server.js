var app = require('express')(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    SchoolsController = require('./controllers/schoolsController'),
    port = process.env.PORT || 3002;

mongoose.connect('mongodb://schoolsUser:schools@ds055935.mongolab.com:55935/bg-schools');

app.get('/', function (req, res) { res.send('Working.'); });

app.use(cors());

app.get('/api/towns', SchoolsController.getTowns);

app.get('/api/schools/:town?', SchoolsController.getSchools);

app.use(bodyParser.json({ type: '*/*' }));

app.post('/api/schools/add', SchoolsController.addSchool);

app.listen(port, function () { console.log('Server running on port ' + port); });
