const fs = require("fs/promises");

const getApi = (request, response, next) => {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((data) => {
        const endpoints = JSON.parse(data);
        response.status(200).send(endpoints);
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = {getApi}
