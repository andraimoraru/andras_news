const db = require('../db/connection');
const format = require('pg-format');

const readArticlesById = (article_id) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
    if (rows.length === 0){
         Promise.reject({status: 404, msg : 'Not found'});
    }
    return rows[0];
    });
};

module.exports = {readArticlesById};