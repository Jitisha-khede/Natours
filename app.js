const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controller/errorController');
const AppError =  require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1)MIDDLEWARES
//app.use is used to create middleware function
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});

//2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

//3) ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

//4) START SERVER
module.exports = app;