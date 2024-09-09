const AppError = require('./../utils/appError');

handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`

    return new AppError(message,400)
}

handleDuplicateFields = err => {
    const field = Object.keys(err.keyValue)[0]; // Get the field name (e.g., "name")
    const value = err.keyValue[field]; 
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value`;

    return new AppError(message,400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);    
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message,400);
}

sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
};

sendErrorProd = (err,res) => {
    //operational error
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    //programming or other error: don't leak details to user
    else{
        //1) log to console
        console.error('ERROR 💥', err);

        //2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        })
    }
};

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = {
            ...err,
            name: err.name,
            message: err.message,
            stack: err.stack,
        };

        console.log(error);

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFields(error);
        if(error.name === 'ValidationError') {console.log('ValidationError'); error = handleValidationErrorDB(error);}
        sendErrorProd(error,res);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })

    next();
}