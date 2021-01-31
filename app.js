import express, { urlencoded, json } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import exphbs from 'express-handlebars';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

import hbsHelpers from './helpers/hbs.js';

import passportConfig from './config/passport.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from './config/db.js';

import router from './routes/index.js';
import auth from './routes/auth.js';
import stories from './routes/stories.js';

dotenv.config({ path: './config/config.env' });

passportConfig(passport);

// Connect to DB
connectDB();

const app = express();

// Body parser
app.use(urlencoded({ extended: false }));
app.use(json());

// Method override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logger
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = hbsHelpers;

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// MongoStore
const MongoStore = connectMongo(session);

// Session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', router);
app.use('/auth', auth);
app.use('/stories', stories);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
