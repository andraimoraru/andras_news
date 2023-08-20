const {readArticlesById, selectCommentsByArticleId} = require('../models/articles.models');

const getArticles = (request, response,next) => {
    
    const {article_id} = request.params;
    if (article_id === undefined) {
        return response.status(404).send({status: 404, msg : 'Not found'});
    };
    readArticlesById(article_id, next)
    .then((article) => {
        if (!article) {
            return response.status(404).send({status: 404, msg : 'Not found'});
        } else {
            return response.status(200).send(article)
        };      
    })
    .catch((err) => {
        next(err);
    });
};

const getCommentsByArticleId = (request, response, next) => {

    let { article_id } = request.params;
    article_id = +article_id
    if (article_id > 0) {
        readArticlesById(article_id).then(res => {
            if (res === undefined) {
                return response.status(404).send({status: 404, msg: 'Not found'})
            }
        })
    } else {
        return response.status(400).send({status: 400, msg: 'Invalid id'})
    }

    selectCommentsByArticleId(article_id, next)
    .then((comments) => {    
        return response.status(200).send(comments);      
    })
    .catch((err) => {
        next(err);
    })

};

module.exports = {getArticles, getCommentsByArticleId};