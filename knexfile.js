'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
