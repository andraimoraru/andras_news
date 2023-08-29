
const {readArticlesById, readArticles, selectCommentsByArticleId, insertCommentsByArticleId, updateArticleVotes, deleteCommentById} = require('../models/articles.models');
const {readAllUsers} = require('../models/users.models');

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


const getAllArticles = (request, response, next) => {
    const  query = request.query;
    readArticles(query)
    .then((articles) => {
        return response.status(200).send({articles});
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
                return response.status(404).send({status: 404, msg: 'Not found'});
            };
        });
    } else {
        return response.status(400).send({status: 400, msg: 'Invalid id'});
    }
    selectCommentsByArticleId(article_id, next)
    .then((comments) => {    
        return response.status(200).send(comments);      
    })
    .catch((err) => {
        next(err);
    })

};

const postCommentsByArticleId = (request, response, next) => {
    let { article_id } = request.params;  
    const { username, body } = request.body; 
    article_id = +article_id;
    if (username === undefined) return response.status(400).send({status: 400, msg: 'Invalid entry'});   
    if (article_id > 0) {
        readArticlesById(article_id).then(res => {         
            if (res === undefined) {
                return response.status(404).send({status: 404, msg: 'Not found'});
            };
        });
    } else {
        return response.status(400).send({status: 400, msg: 'Invalid id'});
    }
    readAllUsers().then((res) => {
        const users = [];
        res.map((user) => {
            users.push(user.username);
        });
        if (!users.includes(username)) return response.status(400).send({status: 400, msg: 'Invalid username'});
    });
    insertCommentsByArticleId( article_id, username, body)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((err) => {
        next(err);
    })

};

const patchArticleVotes = (request, response, next) => {

    const { article_id } = request.params;
    let { inc_votes } = request.body;
    inc_votes = +inc_votes;

    if (article_id > 0) {
        readArticlesById(article_id)
        .then(res => {    
            if (res === undefined) {
                return response.status(404).send({status: 404, msg: 'Article not found'});
            } else {
                updateArticleVotes(article_id, inc_votes)
                .then((article) => {
                    response.status(200).send({ article });
                })
                .catch((err) => {
                    next(err);
                });
            }
        })
        .catch((err) => {
            next(err);
        })
    } else {
        return response.status(400).send({status: 400, msg: 'Invalid id'});
    }
    
};

const removeCommentById = (request, response, next)=> {

    let { comment_id } = request.params;
    
    comment_id = parseInt(comment_id)
    
    if(comment_id > 0) {

    } else {
        return response.status(400)
        .send({msg: 'Invalid Request'})
    };

    deleteCommentById(comment_id)
    .then((res) => {
        if (res === 0) {
            return response.status(404)
            .send({msg: 'comment_id not found'})
        } 
        return response.status(204).send()
    })
    .catch((err) => {
        next(err);
    });

}


module.exports = {getAllArticles, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleVotes, removeCommentById};

