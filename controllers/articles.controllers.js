const {readArticlesById} = require('../models/articles.models');

const getArticles = (request, response,next) => {
    const {article_id} = request.params;
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
module.exports = {getArticles};