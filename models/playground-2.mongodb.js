// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

/*
// Create a new document in the collection.
db.getCollection('customers').insertOne({

});
*/

db.getCollection('orders').find({},
    {
        "streetAddress": 1,
        "city": 1,
        "country": 1,
        "email": 1,
        "name": 1,
        "postalCode": 1,
    }
).skip(100).sort({"name":1})

db.getCollection('customers').insertMany(
    {}
)