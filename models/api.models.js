const db = require('../db/connection');
const fs = require("fs/promises");

const readApi = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((data) => {
        return data;
    });
};

module.exports = {readApi};