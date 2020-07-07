const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations'); //using operations file based node module

const url = "mongodb://localhost:27017/";
const  dbname = 'conFusion';

MongoClient.connect(url).then((client) => {
    console.log('Connected correctly to server');
    const db = client.db(dbname);
    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "dishes")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");

        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
                            
            return db.dropCollection("dishes");
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));

//USING PROMISES TO AVOID CALLBACK HELL

//USING FILE BASED NODE MODULE
// MongoClient.connect(url,(err,client)=>{     //2nd parameter is a callback function

//     assert.equal(err,null);
//     console.log('Connected correctly to server');
    
//     const db = client.db(dbname);
//     dboper.insertDocument(db, { name: "Test2", description: "Test2"},"dishes", (result) => {
            
//         console.log("Insert Document:\n", result.ops);
//         dboper.findDocuments(db, "dishes", (docs) => {
//             console.log("Found Documents:\n", docs);
//             dboper.updateDocument(db, { name: "Vadonut" },{ description: "Updated Test" }, "dishes",(result) => {
//                 console.log("Updated Document:\n", result.result);
//                 dboper.findDocuments(db, "dishes", (docs) => {
//                     console.log("Found Updated Documents:\n", docs);    
//                     db.dropCollection("dishes", (result) => {
//                         console.log("Dropped Collection: ", result);
//                         client.close();
//                     });
//                 });
//             });
//         });
//     });

//Without USING FILE BASED NODE MODULE    
    // const collection = db.collection('dishes');
    
    // collection.insertOne({"name":"Uthapizza","description":"test"},(err,result)=>{   //2nd parameter is a callback function
    
    //     assert.equal(err,null);
    //     console.log('After insert:\n');
    //     console.log(result.ops);
    //     //ops property: tells how many operations have been carried out
       
    //     collection.find({}).toArray((err,docs)=>{   //parameter is a callback function
    //         assert.equal(err,null);
    //         console.log('Found:\n');
    //         console.log(docs)
           
    //         db.dropCollection('dishes',(err,result)=>{   //2nd parameter is a callback function
    //             assert.equal(err,null);
    //             client.close();  //closing connection to db
    //         });
        
    //     });

    // });
// });