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
                        expect(endpoints[key]).toHaveProperty("exampleResponse");                      expect(key.description).not.toBe(null);
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

    describe(('Path is incorrect'), () => {
        test('404 : returns an error message if path is incorrect', () => {
            return request(app)
            .get('/api/topics123')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Not found');
            });
        });
    });
});
