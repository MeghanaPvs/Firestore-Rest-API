const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin= require("firebase-admin");




//var admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  //add databse URL if needed
});



const express = require("express");

const app = express();
const db=admin.firestore();

const cors = require("cors");
app.use(cors({origin:true}));

//Routes

app.get('/hello-world',(req,res) => {

    return res.status(200).send('Hello World!!!');
});


//Create //Post

app.post('/api/create',(req,res) => {

    (async()=>{
        try{

            await db.collection('products').doc('/' +req.body.id+ '/')
            .create({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price
            })
            return res.status(200).send();

        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});



//Read //Get
//i.e. Read a specific product based on Id 
app.get('/api/read/:id',(req,res) => {

    (async()=>{
        try{

           const document = db.collection('products').doc(req.params.id);
           let product=await document.get();
           let response=product.data();
            return res.status(200).send(response);

        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});

//Read All Products


app.get('/api/read',(req,res) => {

    (async()=>{
        try{
            let query = db.collection('products');
            let response = []; //Creating a response

            await query.get().then( querySnapshot => {
                let docs=querySnapshot.docs; //This is the result of the query
                //Result of query stored in "docs"

                //Iterarating through all the documents in collection
                for(let doc of docs)
                {
                    //Array of list parameters
                    const selectedItem = {
                          id:doc.id,
                          name: doc.data().name,
                          description: doc.data().description,
                          price: doc.data().price
                    };
                    response.push(selectedItem);
                }
                return response; //i.e each "then" should return a value
            });
            return res.status(200).send(response);

        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


//Update //Put

//update based on id

app.put('/api/update/:id',(req,res) => {

    (async()=>{
        try{

            const document = db.collection('products').doc(req.params.id);
            await document.update({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price 
            });
            return res.status(200).send();

        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


//Delete

app.delete('/api/delete/:id',(req,res) => {

    (async()=>{
        try{

            const document = db.collection('products').doc(req.params.id);
            
            await document.delete();
            return res.status(200).send();

        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


//Export the API to Firebase Cloud Functions

exports.app=functions.https.onRequest(app);
//Run the app whenever it has a new request
