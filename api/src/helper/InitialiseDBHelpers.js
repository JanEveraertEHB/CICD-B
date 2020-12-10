
const func = {
  initialiseTables: async function (db) {
    await db.schema.hasTable('records').then(async (exists) => {
      if (!exists) {
        await db.schema
          .createTable('records', (table) => {
            table.increments().primary();
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
            // console.error(e)
          })
      }

    })


    await db.schema.hasTable('users').then(async (exists) => {
      if (!exists) {
        await db.schema
          .createTable('users', (table) => {
            table.increments().primary();
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
            // console.error(e)
          })
      }
      // db.schema.raw("ALTER SEQUENCE seq RESTART WITH (SELECT (max(id) + 1) FROM users);")
    })
  }
}

module.exports = func