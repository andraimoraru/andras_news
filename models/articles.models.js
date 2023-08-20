const db = require('../db/connection');
const format = require('pg-format');

const readArticlesById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {   
        return rows[0];
    });
};

const selectCommentsByArticleId = (article_id) => {
    return db.query(     
        `SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at 
        DESC;`, [article_id])
    .then(({ rows }) => {
        return rows;
    });
};

module.exports = {readArticlesById, selectCommentsByArticleId};