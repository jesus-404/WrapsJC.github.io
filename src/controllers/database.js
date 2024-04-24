// Imports
const { MongoClient, ServerApiVersion } = require('mongodb');
var { uri } = require('./databaseConnection');

// SETP 1: Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports.saveNewCustomer =  async function(req, res, next) {

    const { email, password, street, city, state, zip, phone } = req.body;

    try {
        await client.connect();
        // Connect to the admin database and send a ping
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Connect to the database
        const db0 = client.db("WrapsJC");
        console.log("db0" + db0.toString());

        // Grab the customers collection
        const customersCollection =  db0.collection('customers');
        console.log("collection is "+ customersCollection.collectionName);
        console.log(" # documents in it " + await customersCollection.countDocuments());

        // Check if the email already exists in the collection
        const existingCustomer = await customersCollection.findOne({ email });
        if (existingCustomer) {
            console.log('Email already exists');
            res.status(400).send('email already exists');
            return;
        }

        // Insert the new customer
        await customersCollection.insertOne({
            "email": email,
            "password": password,
            "street": street,
            "city": city,
            "state": state,
            "zip": zip,
            "phone": phone
        });
        console.log(" # documents now = " + await customersCollection.countDocuments());
        console.log("NEW Customer Data  " + email);

        res.status(200).send("Welcome, " + email + "<br/> Please <a href='/account'>Sign In</a>");

    } catch (error) {
        console.error('Error saving user: ', error);
        res.status(500).send('Error saving user: ', error)
    } finally {
        await client.close();
    }
};
module.exports.viewCustomers = async (req, res) => {
    try {
        let customers = await GetCustomersFromMongoDB();
        console.log(customers); // Log the customers array
        res.render("list", { title: "Customer List", customers: customers });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**
 * Checks if credentials match customer in database
 * @param req
 * @param res
 * @return Promise<void>
 */
module.exports.customerLogin = async function(req, res) {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        const customersCollection =  db0.collection('customers');
        console.log("collection is "+ customersCollection.collectionName);
        console.log(" # documents in it " + await customersCollection.countDocuments());

        const { email, password } = req.body;

        const matchingCustomer = await customersCollection.findOne({ email });

        if (matchingCustomer) {
            if (matchingCustomer.password === password) {
                return res.status(200).send("Login successful");
            }
        }
        res.status(401).send('wrong email and/or password');
    } catch (error) {
        console.error('Error authenticating user: ', error);
        res.status(500).send('Error authenticating user: ' + error)
    } finally {
        await client.close();
    }
};
async function GetCustomersFromMongoDB() {
    try {

        //STEP A: Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        //STEP B:  Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        //STEP C: connect to the database "shoppingsite"
        var db0 = client.db("shoppingsite"); //client.db("shoppingsite");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        //STEP D: grab the customers collection
        var customersCollection =  db0.collection('customers');
        console.log("collection is "+ customersCollection.collectionName);
        console.log(" # documents in it " + await customersCollection.countDocuments());

        //STEP E: return the first 10 customer's names from the database
        return await customersCollection.find().limit(10).toArray();

    } finally {
    // STEP F: Ensures that the client will close when you finish/error
    await client.close();
    }
}