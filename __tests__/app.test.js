const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { toBeTrue } = require("jest-extended");

afterAll(() => {
    return connection.end();
});

beforeEach(() => {
    return seed(data);
});

describe('app', () => {
    
    describe('GET /api/healthcheck', () => {
        test('200 : responds with a status of 200', () => {
            return request(app)
            .get('/api/healthcheck')
            .expect(200)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('Server is running')
            });
        });
    });

    describe('GET /api/topics', () => {
        test('200 : responds with an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const { topics } = response.body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug', expect.any(String));
                    expect(topic).toHaveProperty('description', expect.any(String));
                });
            });
        });
    });

    describe('GET /api', () => {
        test('200: responds with an object with all the endpoints available described', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                const endpoints = body;
                for (let key in endpoints){
                    if (key !== 'GET /api'){
                        expect(endpoints[key]).toHaveProperty("description");
                        expect(endpoints[key]).toHaveProperty("queries");
                        expect(endpoints[key]).toHaveProperty("exampleResponse");                      
                        expect(key.description).not.toBe(null);
                        expect(key.queries).not.toBe(null);
                        expect(key.exampleResponse).not.toBe(null);
                        expect(key.description).toBe(expect.any.String);
                        expect(key.queries).toBe(expect.any.Array);
                        expect(key.exampleResponse).toBe(expect.toHaveProperty);
                        };
                    };
                });
            });
        });


    describe('GET /api/articles', () => {
        test('200 : responds with an array of articles objects with given properties', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const { articles } = body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(13);
                articles.forEach((article) => {
                    expect(article).toHaveProperty('title', expect.any(String));
                    expect(article).toHaveProperty('article_id', expect.any(Number));
                    expect(article).toHaveProperty('topic', expect.any(String));
                    expect(article).toHaveProperty('author', expect.any(String));
                    expect(article).toHaveProperty('created_at', expect.any(String));
                    expect(article).toHaveProperty('votes', expect.any(Number));
                    expect(article).toHaveProperty('article_img_url', expect.any(String));
                    expect(article).toHaveProperty('comment_count', expect.any(Number));
                    expect(article).not.toHaveProperty('body');
                });
            });
        });

        test('200 : articles should be sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const { articles } = body;
                expect(articles).toBeSortedBy('created_at', { descending: true });
            });
        });

        test('200 : articles should be filtered by topic', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {          
                const { articles } = body;
                expect(articles).toBeSortedBy('created_at', { descending: true });
                expect(articles.every(article => article.topic === 'mitch')).toBe(true);
            });
        });


        test('200 : articles should be sorted by a given title', () => {
            return request(app)
            .get('/api/articles?topic=mitch&sort_by=title&order=asc')
            .expect(200)
            .then(({body}) => {          
                const { articles } = body;
                expect(articles.every(article => article.topic === 'mitch')).toBe(true);
                expect(articles).toBeSortedBy('title', { descending: false });
            });
        });

        test('200 : articles should be sorted by given queries', () => {
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then(({body}) => {          
                const { articles } = body;
                expect(articles).toBeSortedBy('title', { descending: true });
            });
        });

    });
    
  
    describe('GET /api/articles/:article_id', () => {
        test('200 : responds with an article object with all the given properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const properties = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count']
                properties.forEach((property) => {
                    expect(response.body).toHaveProperty(property);
                });
                
            });
        });

        test('200 : responds with the correct article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('title', expect.any(String));
                expect(response.body).toHaveProperty('article_id', expect.any(Number));
                expect(response.body).toHaveProperty('topic', expect.any(String));
                expect(response.body).toHaveProperty('body', expect.any(String));
                expect(response.body).toHaveProperty('created_at', expect.any(String));
                expect(response.body).toHaveProperty('votes', expect.any(Number));
                expect(response.body).toHaveProperty('article_img_url', expect.any(String));
            });
        });


        test('200 : responds with the correct article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                expect(response.body.title).toEqual('Living in the shadow of a great man');
                expect(response.body.article_id).toEqual(1);
                expect(response.body.topic).toEqual('mitch');
                expect(response.body.author).toEqual('butter_bridge');
                expect(response.body.body).toEqual('I find this existence challenging');
                expect(response.body.created_at).toEqual('2020-07-09T20:11:00.000Z');
                expect(response.body.votes).toEqual(100);
                expect(response.body.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            });
        });

        test('400 : returns an error message if id is invalid', () => {
            return request(app)
            .get('/api/articles/banana')
            .expect(400)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Invalid Request');
            });
        });

        test('404 : returns an error message if id is not found', () => {
            return request(app)
            .get('/api/articles/900')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Not found');
            });
        });

    });

  
    describe('GET /api/articles/:article_id/comments', () => {
        test('returns an array of comments for valid article_id, ordered by date descending',() => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                const comments = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11);
                expect(comments).toBeSortedBy('created_at', { descending: true });
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id');
                    expect(comment).toHaveProperty('article_id');
                    expect(comment).toHaveProperty('author');
                    expect(comment).toHaveProperty('body');
                    expect(comment).toHaveProperty('created_at');
                    expect(comment).toHaveProperty('votes');
                })
            }); 
        });
      
        test('200: returns an empty array for valid article_id with no comments',() => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual([])
            }); 
        });
      
        test('400: returns an error message for an invalid article_id type',() => {
            return request(app)
            .get('/api/articles/cat/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid id')
            }); 
        });
      
        test('404: returns an error message for a non-existent article_id',() => {
            return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not found')
            }); 
        });
    });

    describe(('POST /api/articles/:article_id/comments'), () => {
        test('201 : returns the posted comment', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({username: 'butter_bridge', body : 'This is a comment'})
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: "butter_bridge",
                    body: 'This is a comment',
                    article_id: 1,
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                });
            });
        });

        test('400: if article_id is not a number', () => {
            return request(app)
            .post('/api/articles/banana/comments')
            .send({username: 'butter_bridge', body : 'This is a comment'})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid id');
            });
        });

        test('404: if article_id does not exist', () => {
            return request(app)
            .post('/api/articles/999/comments')
            .send({username: 'butter_bridge', body : 'This is a comment'})
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not found');
            });
        });

        test('400: if required properties are missing', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({body : 'This is a comment'})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid entry');
            });
        });
        test('400: if user does not exist', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({username: 'nobody', body : 'This is a comment'})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid username');
            });
        });


    });


    describe(('PATCH /api/articles/:article_id'), () => {
        test('200 : increments vote by 1', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(101);
            });
        });

        test('200 : decrements vote by 100', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({body}) => {
                expect(body.article.votes).toBe(0);
            });
        });

        test('400 : if inc_votes is not provided', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid Request');
            });
        });

        test('404 : if article_id does not exist', ()=> {
            return request(app)
            .patch('/api/articles/999')
            .send({ inc_votes: 100})
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Article not found');
            });
        });
    });


    describe('DELETE /api/comments/:comment_id', () => {
        test('204 : successfully deletes a comment by its comment_id', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
        });

        test('400 : invalid comment_id', () => {
            return request(app)
            .delete('/api/comments/banana')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid Request')
            });
        });

        test('404 : comment_id not found', () => {
            return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('comment_id not found')
            });
        });
    });


    describe(('GET /api/users'), () => {
        test('200 : responds with the users object', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const { users } = response.body;
                expect(users).toBeInstanceOf(Array);
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String));
                    expect(user).toHaveProperty('name', expect.any(String));
                    expect(user).toHaveProperty('avatar_url', expect.any(String));
                });
            });
        });
    });

    describe(('Path is incorrect'), () => {
        test('404 : returns an error message if path is incorrect', () => {
            return request(app)
            .get('/api/anything')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Bad Request');
            });
        });
    });  
});
