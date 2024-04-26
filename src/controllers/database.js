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
                res.redirect('/shopping_cart');
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

module.exports.placeOrder =  async function(req, res, next) {
    // Get form data
    const { firstName, lastName, address, country, city, state, zip, fullName, cardNumber, cardExpire, cardCVV } = req.body;

    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("db0" + db0.toString());

        const billingCollection =  db0.collection('billing');
        console.log("collection is "+ billingCollection.collectionName);
        console.log(" # documents in it " + await billingCollection.countDocuments());

        // Insert the billing information
        const resultBilling = await billingCollection.insertOne({
            "fullName": fullName,
            "cardNumber": cardNumber,
            "cardExpire": cardExpire,
            "cardCVV": cardCVV
        });
        console.log(" # documents now = " + await billingCollection.countDocuments());

        const shippingCollection =  db0.collection('shipping');
        console.log("collection is "+ shippingCollection.collectionName);
        console.log(" # documents in it " + await shippingCollection.countDocuments());

        // Insert the shipping address
        const resultShipping = await shippingCollection.insertOne({
            "firstName": firstName,
            "lastName": lastName,
            "address": address,
            "country": country,
            "city": city,
            "state": state,
            "zip": zip,
        });
        console.log(" # documents now = " + await shippingCollection.countDocuments());

        const ordersCollection =  db0.collection('orders');
        console.log("collection is "+ ordersCollection.collectionName);
        console.log(" # documents in it " + await ordersCollection.countDocuments());

        // Access session cart info
        const cart = new Cart(req.session.cart);

        // Insert new order
        const resultOrder = await ordersCollection.insertOne({
            "billingID": resultBilling.insertedId,
            "shippingID": resultShipping.insertedId,
            "cart": cart
        });
        console.log(" # documents now = " + await ordersCollection.countDocuments());
        // clear cart session
        req.session.destroy();

        // redirect to order summary
        res.redirect(`/storeOrder/${resultOrder.insertedId.toString()}`);
    } catch (error) {
        console.error('Error placing order: ', error);
        res.status(500).send('Error placing order: ', error)
    } finally {
        await client.close();
    }
};

module.exports.getOrder =  async function(req, res, next) {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db0 = client.db("WrapsJC");
        console.log("db0" + db0.toString());

        const ordersCollection =  db0.collection('orders');
        console.log("collection is "+ ordersCollection.collectionName);
        console.log(" # documents in it " + await ordersCollection.countDocuments());

        // Get order from DB using url ID
        const order = await ordersCollection.findOne(new ObjectId(req.params.id));
        if (order) {
            console.log('order' + order);
            const cartData = order.cart
            const cart = new Cart(cartData);
            res.render('storeOrder', { products:cart.toArray(), totalPrice: cart.totalPrice, totalQuantity: cart.totalQuantity });
        } else {
            console.log('order not found');
         res.redirect('/');
        }
    } catch (error) {
        console.error('Error getting order: ', error);
    } finally {
        await client.close();
    }
};