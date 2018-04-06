const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
//map global to get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { 
	useMongoClient: true
})
.then(() =>  console.log('MongoDB connected...'))
.catch(err => console.log(err));

//load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


//index route
app.get('/', (req, res) => {
	const title = 'Welcome!!!';
	res.render('index', {
		title: title
	});
});
//about route
app.get('/about', (req, res) => {
	res.render('about');
});

//add idea route
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

//process form
app.post('/ideas', (req, res) => {
	let errors = [];
	if(!req.body.title) {
		errors.push({text:'Please add a title'})
	}
	if(!req.body.details) {
		errors.push({text:'Please add details'})
	}
	if(errors.length > 0 ) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		res.send('passed');
	}

});

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

