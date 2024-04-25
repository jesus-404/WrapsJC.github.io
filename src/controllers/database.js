// Imports
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const { uri } = require('./databaseConnection');
const Cart = require('../models/cart')

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

module.exports.addToCart = async (req, res, next) => {
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("db0" + db0.toString());

        const productsCollection = db0.collection('products');
        console.log("collection is " + productsCollection.collectionName);
        console.log(" # documents in it " + await productsCollection.countDocuments());
        console.log(" # documents now = " + await productsCollection.countDocuments());

        let cart = new Cart(req.session.cart ? req.session.cart : {});

        try {
            const product = await productsCollection.findOne(new ObjectId(req.params.id));
            if (product) {
                console.log('product with id ' + (await product)._id + ' found');
                cart.add(product, (await product)._id);
                req.session.cart = cart;
                // need to update cart icon to show item added.
                res.redirect('/products');
            }
        } catch(error) {
            res.status(404).send('Product not found.');
        }
    } catch (error) {
        console.error('Error adding to cart: ' + error);
        res.status(500).send('Error adding to cart: ' + error)
    } finally {
        await client.close();
    }
}

module.exports.getProducts = async function(req, res, next) {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        const productsCollection =  db0.collection('products');
        console.log("collection is "+ productsCollection.collectionName);
        console.log(" # documents in it " + await productsCollection.countDocuments());

        return await productsCollection.find().toArray();

    } catch (error) {
        console.error('Error getting products: ' + error);
        res.status(500).send('Error getting products: ' + error)
    } finally {
        await client.close();
    }
};

module.exports.getProduct = async function(req, res, next) {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("got shopping site");
        console.log("db0" + db0.toString());

        const productsCollection =  db0.collection('products');
        console.log("collection is "+ productsCollection.collectionName);
        console.log(" # documents in it " + await productsCollection.countDocuments());

        const product = await productsCollection.findOne(new ObjectId(req.query.prod));
        console.log('Found product with id:' + product._id + '\n name: ' + product.name);
        return await productsCollection.findOne(new ObjectId(req.query.prod));

    } catch (error) {
        console.error('Error getting product: ' + error);
        res.status(500).send('Error getting product: ' + error)
    } finally {
        await client.close();
    }
};