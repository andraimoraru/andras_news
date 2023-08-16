const db = require('../db/connection');
const format = require('pg-format');

const readTopics = () => {
  
    return db.query("SELECT * FROM topics")
        .then(({ rows }) => {
            return rows;
        });
  
};

module.exports = {readTopics};