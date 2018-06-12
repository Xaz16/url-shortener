'use strict';

const {Command} = require('@adonisjs/ace');
const Database = use('Database');

class ClearOldEntry extends Command {
  static get signature() {
    return 'clear:old:entry';
  }

  static get description() {
    return 'Delete all URLs that were created 15 days ago';
  }

  async handle() {
    const today = new Date().getTime();
    const entries = await Database.table('urls').select('*');

    const shouldBeDeleted = entries.filter(item => {
      const itemDate = new Date(item.created_at).getTime();
      return today - itemDate >= 1.296e+9;
    }).map(item => item.id);

    await Database
      .table('urls')
      .whereIn('id', shouldBeDeleted)
      .delete();

    Database.close();
  }
}

module.exports = ClearOldEntry;
