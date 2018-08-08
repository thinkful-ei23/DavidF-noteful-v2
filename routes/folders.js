'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

//GET all folders
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

//GET folder by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .first('id', 'name')
    .from('folders')
    .where({ id: id })
    .then(results => res.json(results))
    .catch(err => next(err));
});

//PUT update a folder
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where({ id: id })
    .update(updateObj)
    .returning(['id', 'name'])
    .then(results => res.json(results))
    .catch(err => next(err));
});

//POST (insert) a folder
router.post('/', (req, res, next) => {
  const { name } = req.body;

  const newFolder = { name };

  if (!newFolder.name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert(newFolder)
    .then(folder => {
      if (folder) {
        res
          .location(`http://${req.headers.host}/folders/${folder.id}`)
          .status(201)
          .json(folder);
      }
    });
});

//Delete a folder
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .where({ id: id })
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;
