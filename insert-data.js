const { MongoClient } = require('mongodb');

// Replace the following with your Atlas connection string
const url = 'mongodb+srv://marudka:W447LM5Si7p2dQt@cluster0.6f0v3.mongodb.net/planner?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
const client = new MongoClient(url);

// The database to use
const dbName = 'planner';

async function run() {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use the collection 'recipes'
    const col = db.collection('recipes');

    // Construct a document
    let recipeDocument = {
      'name': 'Nuggetsy z boczniaka',
      'description': 'Some description',
      'ingredients': [{ 'name': 'boczniaki', 'unit': 'gram', 'value': '500'}, { 'name': 'platki kukurydziane', 'unit': 'gram', 'value': '200'}],
      'images': ['nuggetsy-z-boczniaka-timestamp'],
      'added': new Date(2020, 11, 30),
      'days': [{
        'date': new Date(2020, 11, 30),
        'ingredients': [{ 'name': 'ziemiaki', 'unit': 'gram', 'value': '1000'}]
      }]
    };

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(recipeDocument);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log(myDoc);

  } catch (err) {
    console.log(err.stack);
  }

  finally {
    await client.close();
  }
}

run().catch(console.dir);