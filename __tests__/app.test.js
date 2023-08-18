const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    return connection.end();
});

beforeEach(() => {
    return seed(data);
});

describe('app', () => {
    
    describe('/api/healthcheck', () => {
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

    describe('/api/topics', () => {
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

    describe('/api', () => {
        test('200: responds with an object with all the endpoints available described', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                const endpoints = body;
                for (let key in endpoints){
                    if (key !== 'GET /api'){
                        expect(key).toContain('GET /api');
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


    describe('/api/articles', () => {
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

    });
    
    describe('/api/articles/:article_id', () => {
        test('200 : responds with an article object with all the given properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const properties = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
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
                expect(msg).toBe('Invalid id');
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


    describe(('Path is incorrect'), () => {
        test('404 : returns an error message if path is incorrect', () => {
            return request(app)
            .get('/api/anything')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Not found');
            });
        });
    });

});
