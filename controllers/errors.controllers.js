const handle400s = (err, request, response, next) => {  
    if (err.status === 404 ){
        response.status(404).send({ msg : 'Bad Request'});
    } else {
        next(err);
    };
};

const handleCustomErrors = ((err, request, response, next) => {

    if (err.status && err.message) {
        response.status(err.status).send({msg : err.msg});
    } else {
        next(err);
    };
    
});

module.exports = {handle400s,handleCustomErrors}