const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const password = 'd53Ns9ZKwG5LyHV'

const uri = "mongodb+srv://organicUser:d53Ns9ZKwG5LyHV@cluster0.jos17.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
    const collection = client.db("tasks").collection("todos");

    app.get("/todos", (req, res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get("/todo/:id", (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.post("/addTodo", (req, res) => {
       const todo = req.body;
       collection.insertOne(todo)
       .then(result => {
           console.log('data added successfully');
           res.redirect('/')
       })
    })

    app.patch("/update/:id", (req, res) => {
        collection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {todo: req.body.todo}
        }
        )
        
        .then(result => {
            res.send(result.matchedCount > 0)
        })
    })

    app.delete("/delete/:id", (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
           res.send(result.deletedCount > 0)
        })
    })

});


app.listen(3000)