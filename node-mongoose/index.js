const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log('Connected Correctly to server');
    
// create method can directly be used to create and save in the db as shown
    Dishes.create({
        name: 'Uthapizza',
        description: 'Test'
    })
    .then((dish) => {
        console.log(dish);
        
        return Dishes.find({}).exec();
    })
    .then((dishes) => {
        console.log(dishes);

        return Dishes.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
    
// A way to create a new Dish and save in the db
    // var newDish = new Dishes({
    //     name: 'Uthappizza',
    //     description: 'test'
    // });

    // newDish.save()   //saves the newDish and returns a Promise 
    //     .then((dish)=>{
    //         console.log(dish);
    //         return Dishes.find({}).exec() //executes find query on Dishes collecion created by mongoose and returns a Promise..hence nested then
    //     })
    //     .then((dishes)=>{
    //         console.log(dishes);
    //         return Dishes.remove({});
    //     })
    //     .then(()=>{
    //         return mongoose.connection.close();
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     });
});