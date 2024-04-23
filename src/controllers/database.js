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

/* STEP 2: Controller function to save New customer data to the collection customers. */
module.exports.saveNewCustomer =  function(req, res, next) {

    //step 2.1 Read in the incomming form data for the customer: name, email
    //expecting data variable called name --retrieve value using body-parser
    var body = JSON.stringify(req.body);  //if wanted entire body as JSON
    var params = JSON.stringify(req.params);//if wanted parameters
    var value_name = req.body.name;  //retrieve the data associated with name
    var value_email = req.body.email;  //retrieve the data associated with email


    console.log("NEW Customer Data  " + value_name + "  email: " + value_email);

    //step 2.2 Call the function defined below that will connect to your MongDB collection and create a new customer
    saveCustomerToMongoDB(value_name, value_email);

    //step 2.3 Send a response welcoming the new user
    res.send("Welcome,  " + value_name + "</br> We will reach you at: " + value_email);
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
 * This is the main function save to your definde MongoClient defined at the top
 * which connects to your database here defined as "shoppingsite" and in it will access
 * the collection "customers" to create a new Customer with the name and email
 * @param req
 * @param res
 * @param email
 * @param pass
 * @param street
 * @param city
 * @param state
 * @param zip
 * @param phone
 * @return Promise<void>
 */
module.exports.saveCustomerToMongoDB = async function(req, res, email, pass, street, city, state, zip, phone) {
    try {
        // Connect the client
        await client.connect();
        // Connect to the admin database and send a ping
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Connect to the database
        var db0 = client.db("WrapsJC");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        // Grab the customers collection
        var customersCollection =  db0.collection('customers');
        console.log("collection is "+ customersCollection.collectionName);
        console.log(" # documents in it " + await customersCollection.countDocuments());

        // Check if the email already exists in the collection
        const existingCustomer = await customersCollection.findOne({ email });
        if (existingCustomer) {
            console.log('Email already exists.');
            res.status(400).send('email already exists.');
        }

        // Insert the new customer
        await customersCollection.insertOne({
            "email": email,
            "password": pass,
            "street": street,
            "city": city,
            "state": state,
            "zip": zip,
            "phone": phone
        });
        console.log(" # documents now = " + await customersCollection.countDocuments());
        res.status(200);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: error.message })
    } finally {
    // Close client
    await client.close();
    }
}

/**
 * Checks if credentials match customer in database
 * @param req
 * @param res
 * @param email
 * @param pass
 */
module.exports.customerLogin = async function(req, res, email, pass) {
    await client.connect();
    // Connect to the admin database and send a ping
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Connect to the database
    var db0 = client.db("WrapsJC");
    console.log("got shopping site");
    console.log("db0" + db0.toString());

    // Grab the customers collection
    var customersCollection =  db0.collection('customers');
    console.log("collection is "+ customersCollection.collectionName);
    console.log(" # documents in it " + await customersCollection.countDocuments());

    const matchingCustomer = await customersCollection.findOne({ email });

    if (matchingCustomer) {
        if (matchingCustomer.password === pass) {
            return res.status(200);
        }
    }
    res.status(401).send('wrong email and/or password');
}
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