require('dotenv').config();

const morgan =  require('morgan');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const server = require('http').createServer(app);
const options = {
  path: '/socket.io/',
  cors: {
    origin: 'http://planner.bluewolf.pl/',
    methods: ['GET', 'POST']
  }
};
const io = require('socket.io')(server, options);
let webSocket;

io.on('connection', (socket) => {
  webSocket = socket;
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const addSocketMiddleware = (req, res, next) => {
  req.socket = webSocket;
  next();
};

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
app.use(addSocketMiddleware);
app.use('/recipes', recipesRouter);

server.listen(process.env.PORT || 3000, () => console.log('server started'));