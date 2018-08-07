'use strict';

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  knex
    .select('notes.id', 'title', 'content')
    .from('notes')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('notes.id', 'asc')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('id', 'title', 'content')
    .from('notes')
    .where({ id: id })
    .then(results => {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  knex('notes')
    .where({ id: id })
    .update(updateObj)
    .returning(['id', 'title', 'content'])
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .then(item => {
      if (item) {
        res
          .location(`http://${req.headers.host}/notes/${item.id}`)
          .status(201)
          .json(item);
      }
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({ id: id })
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
