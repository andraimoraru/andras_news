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
