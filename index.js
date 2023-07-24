const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khwex9e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const collegeCollection = client.db('College_Bookings').collection('colleges')

        const collegeAddmissionCollection = client.db('College_Bookings').collection('addmission')

        const reviewCollection = client.db('College_Bookings').collection('review')

        app.get('/colleges', async (req, res) => {
            const cursor = collegeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // ?specific data read
        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(query)
            res.send(result)
        })
        app.get('/addmission', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await collegeAddmissionCollection.find().toArray()
            res.send(result)
        })

        // submit college
        app.post('/addmission', async (req, res) => {
            const newCollege = req.body
            console.log(newCollege);
            const result = await collegeAddmissionCollection.insertOne(newCollege)
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/review', async (req, res) => {
            const newReviews = req.body
            const result = await reviewCollection.insertOne(newReviews)
            res.send(result)

        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // ???eta comment krte hbe
        // await client.close();
    }
}
run().catch(console.dir);













app.get('/', (req, res) => {
    res.send('College running')

})

app.listen(port, () => {
    console.log(`College server is running on Port ${port}`);
})