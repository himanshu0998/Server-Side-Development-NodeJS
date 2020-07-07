const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017/";
const  dbname = 'conFusion';

MongoClient.connect(url,(err,client)=>{     //2nd parameter is a callback function

    assert.equal(err,null);
    console.log('Connected correctly to server');
    
    const db = client.db(dbname);
    const collection = db.collection('dishes');
    
    collection.insertOne({"name":"Uthapizza","description":"test"},(err,result)=>{   //2nd parameter is a callback function
    
        assert.equal(err,null);
        console.log('After insert:\n');
        console.log(result.ops);
        //ops property: tells how many operations have been carried out
       
        collection.find({}).toArray((err,docs)=>{   //2nd parameter is a callback function
            assert.equal(err,null);
            console.log('Found:\n');
            console.log(docs)
           
            db.dropCollection('dishes',(err,result)=>{   //2nd parameter is a callback function
                assert.equal(err,null);
                client.close();  //closing connection to db
            });
        
        });

    });
});