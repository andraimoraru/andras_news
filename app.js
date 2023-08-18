const express = require("express");
const {getHealthCheck} = require('./controllers/healthCheck.controllers')
const {getApi} = require("./controllers/api.controllers")
const {getTopics} = require('./controllers/topics.controllers');
const {getAllArticles, getArticles} = require('./controllers/articles.controllers')
const { handle400s, handleCustomErrors } = require("./controllers/errors.controllers");
const app = express();

app.get('/api', getApi);

app.get('/api/healthcheck', getHealthCheck);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticles)

app.get('/api/articles', getAllArticles)

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send({ msg : 'Internal Server Error'})
});

app.use((_, response) => {
    response.status(404).send({ msg : 'Not found'})
});

module.exports = app;




