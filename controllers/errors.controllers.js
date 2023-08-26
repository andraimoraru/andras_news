const handle400s = (err, request, response, next) => {  
    if (err.code === '22P02' || err.code === '42703'){
        response.status(400).send({ msg : 'Invalid Request'});
    } else {
        next(err);
    };

};

const handleCustomErrors = ((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg : err.msg});
    } else {
        next(err);
    };
    
});

module.exports = {handle400s,handleCustomErrors}