const AppError = require('./../utils/appError');

handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`

    return new AppError(message,400)
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
    }else if(process.env.NODE_ENV = 'production'){
        let error = {...err};

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        sendErrorProd(error,res);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}