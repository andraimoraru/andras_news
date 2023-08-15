const express = require("express");
const {getHealthCheck} = require('./controllers/healthCheck.controllers')
const {getApi} = require("./controllers/api.controllers")
const {getTopics} = require('./controllers/topics.controllers');
const { handle400s, handleCustomErrors } = require("./controllers/errors.controllers");
const app = express();

app.get('/api', getApi);

app.get('/api/healthcheck', getHealthCheck);

app.get('/api/topics', getTopics);

app.use((_, response) => {
    response.status(404).send({ msg : 'Not found'})
});

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, request, response, next) => {
    response.status(500).send({ msg : 'Internal Server Error'})
});


module.exports = app;




