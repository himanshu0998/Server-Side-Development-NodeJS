//File based node module for server operations which will be further used in index.js

const assert = require('assert');

//creating and exporting insertDocument function
exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    // coll.insert returns a Promise, so to avoid callback hell directly return;
    return coll.insert(document);
    // coll.insert(document, (err,result)=>{
    //     assert.equal(err,null);
    //     console.log("Inserted: "+ result.result.n + " into the collection " + collection);
    //     callback(result);
    // });
};

exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    //Directly returning the promise
    return coll.find({}).toArray();
    // coll.find({}).toArray((err,docs)=>{
    //     assert.equal(err,null);
    //     callback(docs);
    // });
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    //Directly returning the promise
    return coll.deleteOne(document);
    // coll.deleteOne(document, (err,result)=>{
    //     assert.equal(err,null);
    //     console.log("Removed the document ",document);
    //     callback(result);
    // });
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    //Directly returning the promise
    return coll.updateOne(document, { $set: update}, null);
    // coll.updateOne(document, { $set: update}, null, (err,result) => {
    //     assert.equal(err,null);
    //     console.log("Update the document with: ", update);
    //     callback(result);
    // });
};