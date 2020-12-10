
const func = {
  initialiseTables: async function (db) {
    await db.schema.hasTable('records').then(async (exists) => {
      if (!exists) {
        await db.schema
          .createTable('records', (table) => {
            table.increments();
            table.string('uuid');
            table.string('question');
            table.string('answer');
            table.string('user_id');
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table records');
          })
          .catch((e) => {
            console.error(e)
          })
      }
    })


    await db.schema.hasTable('users').then(async (exists) => {
      if (!exists) {
        await db.schema
          .createTable('users', (table) => {
            table.increments();
            table.uuid('uuid');
            table.string('email');
            table.string('username');
            table.string('password');
            table.string('roles');
            table.timestamps(true, true);
          })
          .then(async () => {
            console.log('created table users');
          })
          .catch((e) => {
            console.error(e)
          })
      }
    })
  }
}

module.exports = func