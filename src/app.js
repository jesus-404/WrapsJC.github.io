// Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routes
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const productsRouter = require('./routes/products');
const contactsRouter = require('./routes/contacts');
const accountRouter = require('./routes/account');
const createAccountRouter = require('./routes/createAccount');
const itemRouter = require('./routes/item');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Paths
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/products', productsRouter);
app.use('/contacts', contactsRouter);
app.use('/account', accountRouter);
app.use('/createAccount', createAccountRouter);
app.use('/item', itemRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
