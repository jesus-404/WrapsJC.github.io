// Imports
const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('./databaseConnection');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports.saveNewUser =  async function(req, res, next) {

    const { email, password, street, city, state, zip, phone } = req.body;

    try {
        await client.connect();
        // Connect to the admin database and send a ping
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Connect to the database
        const db0 = client.db("WrapsJC");
        console.log("db0" + db0.toString());

        // Grab the users collection
        const usersCollection =  db0.collection('users');
        console.log("collection is "+ usersCollection.collectionName);
        console.log(" # documents in it " + await usersCollection.countDocuments());

        // Check if the email already exists in the collection
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            res.redirect(`/createAccount?emailInUse=true`);
            return;
        }

        // Insert the new user
        await usersCollection.insertOne({
            "email": email,
            "password": password,
            "street": street,
            "city": city,
            "state": state,
            "zip": zip,
            "phone": phone
        });
        console.log(" # documents now = " + await usersCollection.countDocuments());
        console.log("NEW user Data  " + email);

        const loginPrompt = 'Account created successfully! Please sign in.';
        res.redirect(`/account?loginPrompt=${encodeURIComponent(loginPrompt)}`);

    } catch (error) {
        console.error('Error saving user: ', error);
        res.status(500).send('Error saving user: ', error)
    } finally {
        await client.close();
    }
};

/**
 * Checks if credentials match user in database
 * @param req
 * @param res
 * @return Promise<void>
 */
module.exports.userLogin = async function(req, res) {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        const usersCollection =  db0.collection('users');
        console.log("collection is "+ usersCollection.collectionName);
        console.log(" # documents in it " + await usersCollection.countDocuments());

        const { email, password } = req.body;

        const matchingUser = await usersCollection.findOne({ email });

        if (matchingUser) {
            if (matchingUser.password === password) {
                res.redirect(`/account?loginSuccess=true&loginEmail=${encodeURIComponent(email)}`);
                return;
            }
        }
        res.redirect(`/account?loginFailed=true`);
    } catch (error) {
        console.error('Error authenticating user: ', error);
        res.status(500).send('Error authenticating user: ' + error)
    } finally {
        await client.close();
    }
};