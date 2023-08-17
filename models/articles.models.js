const db = require('../db/connection');
const format = require('pg-format');

const readArticlesById = (article_id, next) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {   
        return rows[0];
    })
    .catch((err) => {
        next(err);
    });
};

const readArticles = (query, next) => {
    const acceptedValues = ['author', 'topic']
    const queryValue = [];

    if (query['author']){
        queryValue.push('author')
    } else if (query['topic']){
        queryValue.push('topic')
    } else {
        queryValue.push('created_at')
    }

    let baseQuery = `SELECT 
        articles.author,
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.comment_id)::INTEGER as comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.${queryValue[0]} 
        DESC;`;

    if (Object.keys(query).length === 0) {
    } else if (query.hasOwnProperty('sort_by') && 
                queryValue.includes(query.sort_by)) {
    } else {
        return Promise.reject({status: 400, msg : 'Bad Request'})
    };

    return db.query(baseQuery)
    .then(({ rows }) => {
        return rows;
    })
    .catch((err) => {
        next(err);
    });

};

module.exports = {readArticles, readArticlesById};