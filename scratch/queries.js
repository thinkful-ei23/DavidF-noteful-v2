'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });
const id = 1003;
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .where({ id: id })
//   .then(results => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const updateObj = {
  title: 'Am I Updating?',
  content: 'Hooray I updated!'
};

// const id = 9999;

knex('notes')
  .where({ id: id })
  .update(updateObj)
  .returning(['id', 'title', 'content'])
  .then(results => {
    console.log(results);
  })
  .catch(err => {
    console.log(err);
  });

// const newItem = {
//   title: 'Something about Mary',
//   content: 'A comedy'
// };

// knex('notes')
//   .insert(newItem)
//   .then(item => {
//     if (item) {
//       console.log(item);
//     }
//   });
