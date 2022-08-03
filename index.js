async function initialize(oldDb,newDb) {    
    const mongoose = require('mongoose');
    const db = await  mongoose.createConnection(oldDb,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db2 = await mongoose.createConnection(newDb,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db.once('open', () => {
        console.log('Connected to old database');
       

    })
    async function getCollectionList() {
        let oldDbCollectionList = []
        let collections =  await db.db.collections()
        collections.forEach(async (collection, index) => {
            oldDbCollectionList.push(collection.collectionName);
            
        });
        
        return oldDbCollectionList
    }
    

    db2.once('open',async () => {
        let oldDbCollectionList = await getCollectionList();
        oldDbCollectionList.forEach(async (collectionName) => {
            // check if the collection exists in the new database
            let dbExists = await db2.db.collections()
            let newDbCollectionList = []
            dbExists.forEach(data => {
                newDbCollectionList.push(data.collectionName)
            })
            console.log(newDbCollectionList)
            if (!newDbCollectionList.includes(collectionName)) {
                db2.db.createCollection(collectionName)
            }
            const newDbCollection = await db2.collection(collectionName);
            const oldDbCollection = await db.collection(collectionName);
            
            let theMaxId = await newDbCollection.findOne({}, { sort: { _id: -1 } })
            if (!theMaxId) {
                
                let oldtonewData = await oldDbCollection.find({}).toArray();
                newDbCollection.insertMany(oldtonewData)

            }
            else {
                theMaxId = theMaxId._id;
                console.log(theMaxId)
                
                let oldtonewData = await oldDbCollection.find({ _id: { $gt: theMaxId._id } }).toArray();
                
                if (oldtonewData.length) {
                    await newDbCollection.insertMany(oldtonewData)
                    console.log(oldtonewData)
                }
                console.log(await oldDbCollection.find().toArray())
                console.log(await newDbCollection.find().toArray())
            }   
            
        })
    })
}


initialize('mongodb://localhost:27017/test','mongodb://localhost:27017/new');




