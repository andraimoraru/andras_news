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
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg : 'Article not found'});
        };
        return rows;
    });
};



module.exports = {readArticlesById, selectCommentsByArticleId};