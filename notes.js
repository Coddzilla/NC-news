/*


idealy: before each test we want new data to test since we need to make sure that 

rollback() -> latest() -> seed()
--------
// psql 
// \c 
// seleect * from ...
--------

READ DOCTUMENTATION

-------- knexfile.js--------
create knex file with the configuration - environment:

#test environment. 

- put in our baseConfig: 
  -client
  -migrations: {
    directory:'path to migrations'
  }
  -seeds: 'path to seeds'

customConfigs: {
  development: {
    connection: {
      database: 'name of database',

    }
  }
  test: {
    connection: {
      database: 'name of test database
    }
  }
}

module.exports = {...baseConfig, ...customConfig[ENV]}

-----package.json----

change file 

-----terminal---- 

in terminal: npm run make-migratiion -- create_table_name
creates migration file
---migration file  ----

// up function - updates/create party table
// down function - drop the table
- Look at schema builder to see how to write these functions
- For up: Set one as the primary (string) to make a column and always put .notNullable() onto each section - this ensures that people actually fill in all of the table.
- For down: use dropTable 

--package.json--
in scripts: migrate-latest : "knex migrate:latest" - runs the up funct
(need to run psql -f... before runnning this - only need to write this once)

-- in terminal ---
npm run make-migratiion -- create_second_table_name
creates second migration file

--- second migration table ---
make the functions for the second table 

- Look at schema builder to see how to write these functions
- For up: Set one as the primary (string) to make a column and always put .notNullable() onto each section - this ensures that people actually fill in all of the table.
- If need to refernce anthoer table... do .references(table.columnToReference)
- use increments if need to have an automated id incrementing number (same as serial)
- For down: use dropTable

--package.json--
in scripts: "migrate-rollback": "knex migrate:rollback"

--- make a seeds directory and a seed file in this  ---
require in data
make a seed function that: 
- batch inserts or inserts
connection.insert(data).into('table_name').then(() => {
  connection.insert(data2).into('table_2_name')
})

--package.json--
in scripts: "seed-db": "npm run migrate-rollback && npm run migrate-latest && knex seed:run"

---------------------------------------
any extra functionality put into the utils folder to get out of the way...

----- spec -------
// change env to test 
// require app 
// requite request off supertest 
// require expect off chai 
// require connection from db/connection

---connection.js---
//require knex 
// require configuration 
// invoke knex with configuration export out coonection 

----- spec -------

//have a describe for each url and an it block for each type of request/query
use mocha hook beforeEach <--- executes before every it block


beforeEach(() => {
return createConnection.migrate
.rollback()
.then(() => {return createConnection.migrate.latest()})
.then(()=> {return connection.seed.run()}) //can use implicit return 
});

after(() => connection.destroy());

describe('/api', () => {
  describe('', () => {
    it('get 200 and and responds with array of party objects')
    //not going to check length since this will change over different tests
    return request.length('/api/parties')
    .expect(200)
    //this returns a promise 
    .then(({ body }) => { // destructure the body
expect((body.parties)).to.be.an(array)
expect(body.parties[0]).to.contain.keys('party', 'founded');
    })
  });
});

----- normal ---
set up controllers and routes 

--controller --
require connection
require fetchFunction from model  <- make this
exports.getFunction = () => {
  fetchFunct().then()
}

--- spec ---

describe('/mps/:mp_id', () => {
  it('get 200 and mp object', () => {
    return request.get('/api/mps/1')
    .expect(200)
    .then(({body}) => {
      expect(body.mp.name).to.equal('...')
      expect(body.mp.mp_id).to.equal(1)
    })
  })
})


-- models 
// require connection
// make fetchFunct = () => {
//   // return connection.seleect('*')
//   .from('')
//   .where()
}

-- controller --
getFunct to call fetchFunc with a then and a catch. The thing that fetchFunc is called with comes from the req.params or req.query
will need to destructure if you want a single element of an array since it always gives the element as an array

-- spec -- 
test for the errors 

it("get 404 when non-existant mp", () => {
  return request.get("/api/mps/90000000000000").expect(404);
});
it('Get 400 when invalid', () => {
  return request.get('/api/mps/bananas').expect(400)
})


-- controller ---
//need to change up tge controller function to deal with the fact that knex sends an empty array if the mp doesn't exist. This is when the mp is undefined. i.e

if (!mp) return Prmise.reject({ status: 404, message: "mp not found" });

This passes it to the next func

-- in app need to make sure to put the app.use(err, req,res,next) etc

-- error file --
make a folder with a file for errors 
make a handle404 function and require this into the app.js to be used
// in the 404 fucn check if it is 404 and if not then go to the 'next' error hndling function 

in 400 func - put an object called errorCodes = {
  '22P02' " invalid input syntax"
}
*/
// const process.env.NODE_ENV = 'test';
