const { faker } = require('@faker-js/faker');
const { MongoClient, ServerApiVersion } = require('mongodb');

function randomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

const base_ID = 251983451;

CustomPKFactory = {}
CustomPKFactory.prototype = new Object();
CustomPKFactory.count = base_ID; // Base student ID, lowest ID will be count + 1
CustomPKFactory.createPk = () => ++CustomPKFactory.count ;    

const post_options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
}
const user_options = {
        ...post_options,
        pkFactory: CustomPKFactory,
};

/**
 * @param  {number} n - Number of records to be generated
 */
async function seedDB(n) {
    const uri = `mongodb+srv://juanDB:${process.env.DB_PASS}@cluster0.cwp8w.mongodb.net/?retryWrites=true&w=majority`;


    const client = new MongoClient(uri, user_options);
    client.connect(); // callback version in boilerplate deprecated

    const db = client.db('Cluster0');
    const user_col = db.collection('users');
    await user_col.deleteMany({}); // clear collection

    for(let i = 1; i <= n; i++){
        await user_col.insertOne({ name: faker.name.fullName() })
    }

    client.close();

    /* I need a new client because the other one had CustomPKFactory generating 
    * custom IDs based on student numbers.
    * As one user (e.g. a student number) can make multiple posts, I'll let mongodb handle the _id portion of this collection
    */
    const p_client = new MongoClient(uri, post_options);
    p_client.connect();

    const p_col = p_client.db('Cluster0').collection('posts');
    await p_col.deleteMany({}); 


    for(let i = 1; i <= n; i++) {
        k = randomFromInterval(base_ID, base_ID + n); // student posting

        await p_col.insertOne({
            uid: k,
            text: faker.lorem.sentence(3),
            date: faker.date.past(),
        })
    }
    p_client.close();

}

seedDB(5);