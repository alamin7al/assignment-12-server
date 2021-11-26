const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');


require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const app = express();
const port =process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ow5x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect()
        const database = client.db('cycle_list')
        const cycleCollection = database.collection('cycle')
        const userCollection = database.collection('users')
        const revewCollection = database.collection('revew')
        const emailCollection = database.collection('emailuser')
        console.log('h');
        //all cycle data
        app.get('/cycle', async (req, res) => {
            const user = cycleCollection.find({})

            const result = await user.toArray()
            res.send(result)
        })

        app.post('/cycle', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await cycleCollection.insertOne(service);
            // console.log(result);
            res.send(result)

        })



        //data find single
        app.get('/single/:id', async (req, res) => {

            const user = req.params.id
            const quarry = { _id: ObjectId(user) }
            const result = await cycleCollection.findOne(quarry)
            res.send(result)
        })



        //order
        app.post('/orderplace', async (req, res) => {
            const order = req.body
            const result = await userCollection.insertOne(order)
            res.send(result)

        })
        app.get('/orderplace', async (req, res) => {
            const id = userCollection.find({})
            const result = await id.toArray()
            res.send(result)

        })
        //order delet
        app.delete('/orderdelet/:id', async (req, res) => {
            const id = req.params.id
            const quarry = { _id: ObjectId(id) }
            const deleteData = await userCollection.deleteOne(quarry)
            res.send(deleteData)

        })
        //revew
        app.get('/revew', async (req, res) => {
            const id = revewCollection.find({})

            const result = await id.toArray()
            res.send(result)

        })
        app.post('/revew', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);

            const result = await revewCollection.insertOne(service);
            // console.log(result);
            res.send(result)

        })

        app.post('/emailuser', async (req, res) => {
            const useData = req.body
            const result = await emailCollection.insertOne(useData)
            res.json(result)
        })

        app.put('/emailuser', async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await emailCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.put('/emailuser/admin', async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await emailCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        app.get('/emailuser/:email', async (req, res) => {
            const email = req.params.email
            // console.log(email);
            const query = { email: email }
            const user = await emailCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.send({ admin: isAdmin })
        })

        app.delete('/manageorder/:id', async (req, res) => {
            const id = req.params.id
            const quarry = { _id: ObjectId(id) }
           
            const deleting = await userCollection.deleteOne(quarry)
            res.send(deleting)
          
        })



    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port, () => {
    console.log('Runningg Server on port', port);
})
//m3Ny8UQlkzF69teR//doctor