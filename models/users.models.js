const db = require('../db/connection');

const readAllUsers = () => {
    return db.query('SELECT * FROM users;')
    .then(({rows}) => {
        return rows;
    });
};

module.exports = {readAllUsers};