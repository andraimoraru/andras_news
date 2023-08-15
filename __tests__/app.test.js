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
        test('404 : returns an error message if path is incorrect', () => {
            return request(app)
            .get('/api/topics123')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Bad Request');
            });
        });
    });
    describe('/api/articles/:article_id', () => {
        test('200 : responds with an article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                console.log(response.body);
                const articleTitle = 'Living in the shadow of a great man'
                expect(response.body.title).toEqual(articleTitle);
            });
        });
    });

});
