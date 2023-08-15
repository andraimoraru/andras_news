const {readTopics} = require('../models/topics.models')

const getTopics = (request, response, next) => {
    const path = request.originalUrl;
    readTopics(path)
    .then((topics) => {
        response.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
    };

module.exports = {getTopics};