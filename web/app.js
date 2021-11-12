const express = require('express');
const cors = require('cors') // or https://stackoverflow.com/a/68971146/9259701
const app = express();
const session = require('express-session');
const Knex = require('knex');
const morgan = require('morgan');
const KnexSessionStore = require('connect-session-knex')(session);
const dotenv = require('dotenv');
dotenv.config();
// set before using routes
app.use(cors())
app.use(express.json());

// session store
const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: "./database/database.sqlite3"
    },
    useNullAsDefault: true
});

const knexSessionStore = new KnexSessionStore({
    knex,
    sidfieldname: 'sessionId',
    createtable: true,
    tablename: 'Sessions'
})

let expressSessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: knexSessionStore,
    cookie: {
        httpOnly: true,
        key: 'didomiFe',
        // sameSite: 'strict', // https://github.com/expressjs/session/issues/660#issuecomment-514384297
        // domain: 'http://localhost:8997/',
        // path: '',
    },
    proxy: true, // if you do SSL outside of node.
}

let morganFormat = 'tiny'
if (app.get('env') === 'production') { // process.env.NODE_ENV
    app.set('trust proxy', 1) // trust first proxy
    expressSessionOptions.cookie.secure = true;
    morganFormat = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
}

// set morgan to log info about our requests for development use.
app.use(morgan(morganFormat))

app.use(session(expressSessionOptions));

// routes
let userRoutes = require('../controllers/userController')
let eventRoutes = require('../controllers/eventController')

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

module.exports = app