
// check if the db exists 
// add the db if it doesn't exist
// if the db exists, check if the collection exists
// if the db does not exists, create db and add collections
// if the collection exists, check if the collection is empty
// if the collection is empty, add the data

async function initialize(oldDb,newDb) {    
    const mongoose = require('mongoose');
    
    let db = await new Promise(res => {
        const db =  mongoose.createConnection(oldDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db.myDbList = [] // containes the mongo connections
        db.on('open',async () => {
            console.log( await db.db.listCollections().toArray() )
            console.log("connected to db")
            let list = await db.db.admin().listDatabases()
            // console.log(list.databases)
            for (var dbName of list.databases) {
                if (dbName.name == "test" || dbName.name == "admin" || dbName.name == "local")    {
                    continue
                }
                else {
                    db.myDbList.push(dbName.name)
                }
                
            }
            console.log(db.myDbList)
        })
        setTimeout(() => {
            res(db)
        }, 2000);
    })
    let db2 = await new Promise(res => {
        const db =  mongoose.createConnection(newDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db.myDbList = [] // containes the mongo connections
        db.dbCollection = [] // containes the mongo collections
        db.on('open', async () => {
            console.log("connected to db2")
            let list = await db.db.admin().listDatabases()
            
            for (var dbName of list.databases) {
                if (dbName.name == "test" || dbName.name == "admin" || dbName.name == "local") {
                    continue
                }
                else {
                    db.myDbList.push(dbName.name)

                }

            }
            console.log(db.myDbList)
        }
        )
        setTimeout(() => {
            res(db)
        }, 5000);
    })
    db2.dbConnectionList = []
    // initializes the old db 
    for (var dbName of db.myDbList) {

        
        if (db2.myDbList.includes(dbName)) {
            console.log('db already exists')
        }
        else {
        //    let init = await mongoose.createConnection(newDb + "/" + dbName, {
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true,
        //         })
        //     db2.dbConnectionList.push(init)
            let collectionList = await db.db.useDb(dbName).listCollections().toArray()
            console.log(collectionList)
            
        }
        



        // let collectionList = await dbName.db.collections()

        // for (var collection of collectionList) {
        //     console.log(collection.collectionName)
        // }
        
    }

    
       
    
}


initialize('mongodb+srv://dbUser:sanket2904@cluster0.qy3jg.mongodb.net/','mongodb+srv://sanket:sanket2904@cluster0.nehwqpi.mongodb.net/');






    // let db2 = await new Promise (res => {
    //     const db2 =  mongoose.createConnection(newDb, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
        
        
        
    //     setTimeout(() => {
    //         db2.once('open', () => {
    //             console.log('Connected to new database');
    //         })
    //         res(db2)
    //     }, 3000);
    // })
    
    // let oldDbCollectionList = await getCollectionList();
   
    // for(var name of oldDbCollectionList) {
    //     console.log(name)
    //     let dbExists = await db2.db.collections()
    //     let newDbCollectionList = []
    //     dbExists.forEach(data => {
    //         newDbCollectionList.push(data.collectionName)
    //     })
    //     console.log(newDbCollectionList)
    //     if (!newDbCollectionList.includes(name)) {
    //         db2.db.createCollection(name)
    //     }
    //     const newDbCollection = await db2.collection(name);
    //     const oldDbCollection = await db.collection(name);

    //     let theMaxId = await newDbCollection.findOne({}, { sort: { _id: -1 } })
    //     if (!theMaxId) {

    //         let oldtonewData = await oldDbCollection.find({}).toArray();
    //         console.log(oldtonewData  + "76")
    //         // newDbCollection.insertMany(oldtonewData)

    //     }
    //     else {
    //         theMaxId = theMaxId._id;
    //         console.log(theMaxId)

    //         let oldtonewData = await oldDbCollection.find({ _id: { $gt: theMaxId._id } }).toArray();

    //         if (oldtonewData.length) {
    //             // await newDbCollection.insertMany(oldtonewData)
    //             console.log(oldtonewData)
    //         }
    //         console.log(await oldDbCollection.find().toArray())
    //         console.log(await newDbCollection.find().toArray())
    //     }

    // }
    
    // // oldDbCollectionList.forEach(async (collectionName) => {
    // //     // check if the collection exists in the new database
    // //     console.log(collectionName)
    // //     let dbExists = await db2.db.collections()
    // //     let newDbCollectionList = []
    // //     dbExists.forEach(data => {
    // //         newDbCollectionList.push(data.collectionName)
    // //     })
    // //     console.log(newDbCollectionList)
    // //     if (!newDbCollectionList.includes(collectionName)) {
    // //         db2.db.createCollection(collectionName)
    // //     }
    // //     const newDbCollection = await db2.collection(collectionName);
    // //     const oldDbCollection = await db.collection(collectionName);

    // //     let theMaxId = await newDbCollection.findOne({}, { sort: { _id: -1 } })
    // //     if (!theMaxId) {

    // //         let oldtonewData = await oldDbCollection.find({}).toArray();
    // //         newDbCollection.insertMany(oldtonewData)

    // //     }
    // //     else {
    // //         theMaxId = theMaxId._id;
    // //         console.log(theMaxId)

    // //         let oldtonewData = await oldDbCollection.find({ _id: { $gt: theMaxId._id } }).toArray();

    // //         if (oldtonewData.length) {
    // //             await newDbCollection.insertMany(oldtonewData)
    // //             console.log(oldtonewData)
    // //         }
    // //         console.log(await oldDbCollection.find().toArray())
    // //         console.log(await newDbCollection.find().toArray())
    // //     }

    // // })