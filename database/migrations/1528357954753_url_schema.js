'use strict';

const Schema = use('Schema');

class UrlSchema extends Schema {
  up() {
    this.create('urls', (table) => {
      table.increments();
      table.string('original').unique();
      table.string('short');
      table.integer('usage').notNull().defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('urls');
  }
}

module.exports = UrlSchema;
