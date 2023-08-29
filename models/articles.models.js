const db = require('../db/connection');
const format = require('pg-format');

const readArticlesById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {   
        return rows[0];
    });
};

const readArticles = ({topic, sort_by= 'created_at', order='desc'}) => {
    const values =[];
    let query = `SELECT 
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
    ON articles.article_id = comments.article_id`

    if (topic){
        query += ` WHERE articles.topic = $1`;
                values.push(topic);
    }

    query += ` GROUP BY articles.article_id `
    
    const sortby = [
        'title',
        'topic',
        'author',
        'created_at'
    ]

    sortby.includes(sort_by) ? '' : sort_by = 'created_at'
    order == 'asc' || order == 'desc' ? '' : order = 'desc'

    query += `ORDER BY ${sort_by} ${order.toUpperCase()};`

    return db.query(query, values)
    .then(({ rows }) => {
        return rows;
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

const insertCommentsByArticleId = (article_id, username, body) => {
    return db.query(
        `INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;`,
        [article_id, username, body])
    .then(({ rows }) => {
        return rows[0];
    });

};

const updateArticleVotes = (article_id, inc_votes) => {
 

    const queryString = 
        `UPDATE articles
        SET votes = votes + ${inc_votes}
        WHERE article_id = ${article_id}
        RETURNING *;`
   
    return db.query(queryString)
    .then(result => {
        return result.rows[0];
    });
};

const deleteCommentById = (comment_id) => {
    return db.query(
        `DELETE 
        FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [comment_id])
        .then(res => {
            return res.rowCount
        })
};





module.exports = {readArticles, readArticlesById, selectCommentsByArticleId, insertCommentsByArticleId, updateArticleVotes, deleteCommentById};


