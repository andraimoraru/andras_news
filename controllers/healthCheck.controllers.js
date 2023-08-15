const getHealthCheck = (request, response, next) => {
    return response.status(200).send({ msg: 'Server is running'});
    };

module.exports = {getHealthCheck};