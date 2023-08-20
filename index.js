const express = require('express');

const app = express();
const PORT = 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors())

// Replace 'your-mongodb-connection-string' with your actual MongoDB connection string

// Middleware to parse JSON in request body
app.use(express.json());


app.get('/', (req, res) => {


    res.send("Hello Digilabs")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `${process.env.DB_URL}`;

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
        const database = client.db("lockstock");
        const heading = database.collection("header")
        const image = database.collection("image")
        const email = database.collection("email")
      


        app.post ('/header', async (req, res) => {
            const body = req.body;
            const count = await heading.countDocuments(); 
            if (count > 0) {
              // update the existing document
              const result = await heading.updateOne({}, {$set: {header: body.header}});
              res.send(result);
            }
            else {
              // insert a new document
              const result = await heading.insertOne({header: body.header});
              res.send(result);
            }
          });


          
        app.get ('/header', async (req, res) => {


            const result = await heading.findOne({});

            res.send(result)








        })
        app.post('/image', async (req, res) => {
            const imageURL = req.body;
            
            try {
              const count = await image.countDocuments();
              if (count > 0) {
                // Update the existing document
                const result = await image.updateOne({}, { $set: imageURL });
                res.send(result);
              } else {
                // Insert a new document
                const result = await image.insertOne(imageURL);
                res.send(result);
              }
            } catch (error) {
              console.error(error);
              res.status(500).send('Error occurred');
            }
          });
          
        
        app.get('/image', async (req, res) => {
            try {
                const result = await image.findOne({});
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send('Error occurred');
            }
        });

        app.post ('/emails', async (req, res) => { 



            const body = req.body


            const result = await email.insertOne(body);

            res.send(result);

        })

        app.get ('/emails', async (req, res) => { 


            const result = await email.find().toArray()

            res.send(result)
        })
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});