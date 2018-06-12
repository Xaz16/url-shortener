'use strict';

const {Command} = require('@adonisjs/ace');
const Database = use('Database');
const Logger = use('Logger')
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

    Logger.info('ClearOldEntry finished. \n Entries with these ids are cleared: %s', JSON.stringify(shouldBeDeleted))

  }
}

module.exports = ClearOldEntry;
