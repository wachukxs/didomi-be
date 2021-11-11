const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('postgres://btlnnbzltngela:19ed81ac999fb00a7137bb59a314a4fb2e087b8ad26a46ccb0280572059a46cb@ec2-52-5-247-46.compute-1.amazonaws.com:5432/dc46f9g2hh8hud') // Example for postgres
const sequelize = new Sequelize({
    dialect: 'sqlite',
    ssl: false,
    logging: (...opts) => console.log(opts, '\n\n'), // can really customize
    dialectOptions: { // https://stackoverflow.com/a/64960461/9259701
        ssl: {
          require: true, // This will help you. But you will see new error
          rejectUnauthorized: false // This line will fix new error
        }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    hooks: {
      
    },
    storage: 'database.sqlite'
}); // how do we catch global db errors


sequelize.authenticate().then((e) => {
    console.log('made db connection from sequelize');
    // sequelize.close() // after retrying ?
}).catch((err) => {
    console.error('oopsy error connecting to db with Sequelize', err)
})

// sequelize.sync({ alter: true })

sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
  console.log('\n\n\n// Tables in database');
  console.log(tableObj);
})
.catch((err) => {
  console.log('showAllSchemas ERROR',err);
})

sequelize.getQueryInterface().showAllTables().then((_tables) => {
  console.log('\n\n\n\n all the tables', _tables, _tables.length, `total`);
}).catch(err => {
  console.error('err getting all tables', err);
})

sequelize.getQueryInterface().describeTable({
  tableName: 'CorpMembers'
}).then((_data) => {
  console.log('\n\n\n\n CorpMembers table', _data);
}).catch(err => {
  console.error('err describing CorpMembers table', err);
})



module.exports = {
  sequelize,
}

