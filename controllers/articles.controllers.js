const {readArticlesById} = require('../models/articles.models');

const getArticles = (request, response,next) => {
    const {article_id} = request.params;
    readArticlesById(article_id)
    .then((article) => {
        response.status(200).send(article)
    });

};
module.exports = {getArticles};