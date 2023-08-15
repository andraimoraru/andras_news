const db = require('../db/connection');
const format = require('pg-format');

const readTopics = (path) => {
  
    if (path === '/api/topics'){
        return db.query("SELECT * FROM topics")
        .then(({ rows }) => {
            return rows;
        });
    } else {
        return Promise.reject({status: 404, msg : 'Bad Request'});
    };
};

module.exports = {readTopics};