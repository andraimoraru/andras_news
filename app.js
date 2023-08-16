const express = require("express");
const {getHealthCheck} = require('../be-nc-news/controllers/healthCheck.controllers')
const {getTopics} = require('../be-nc-news/controllers/topics.controllers');
const { handle400s, handleCustomErrors } = require("./controllers/errors.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const app = express();

app.get('/api/healthcheck', getHealthCheck);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticles)

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
    response.status(500).send({ msg : 'Internal Server Error'})
});

app.use((_, response) => {
    response.status(404).send({ msg : 'Bad Request'})
});

module.exports = app;




