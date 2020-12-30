require('dotenv').config();

const morgan =  require('morgan');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));
app.use('/static', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

const recipesRouter = require('./routes/recipes');
app.use('/recipes', recipesRouter);

app.listen(process.env.PORT || 3000, () => console.log('server started'));