const {readApi} = require('../models/api.models');

const getApi = (request, response, next) => {
    readApi()
    .then((data) => {
        const endpoints = JSON.parse(data);
        response.status(200).send(endpoints);
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = {getApi}