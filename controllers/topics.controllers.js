const {readTopics} = require('../models/topics.models')

const getTopics = (request, response, next) => {
    readTopics()
    .then((topics) => {
        response.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
    };

module.exports = {getTopics};