const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//const db = mongoose.connect()
const app = express();

//map global to get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://henrybarnacle:henrybarnacle@ds139919.mlab.com:39919/vidjot', { 
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

//method override middleware
app.use(methodOverride('_method'));

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
//idea index page
app.get('/ideas', (req,res) => {
	Idea.find({}).sort({date: 'desc'}).then(ideas => {
	res.render('ideas/index', {
		ideas: ideas
	});
	});
});

//add idea form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		res.render('ideas/edit', {
			idea: idea
		});
	});
});



//edit idea process
app.put('/ideas/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		//new values
		idea.title = req.body.title,
		idea.details = req.body.details

		idea.save().then(idea =>{
			res.redirect('/ideas');
		})
		});
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
		const newUser ={
			title: req.body.title,
			details: req.body.details
		}
		new Idea(newUser).save().then( idea => {
			res.redirect('/ideas');
		});
	}

});

//Edit form process


const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

