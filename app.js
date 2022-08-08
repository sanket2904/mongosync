
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
let oldDb = "mongodb+srv://dbUser:sanket2904@cluster0.qy3jg.mongodb.net"
let newDb = "mongodb+srv://sanket:sanket2904@cluster0.nehwqpi.mongodb.net"
const db = mongoose.createConnection(oldDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
);

const db2 = mongoose.createConnection(newDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
);

let dbList1 = new Promise(res => {
    db.on("open", async () => {
        let dbList = await db.db.admin().listDatabases();
        res(dbList.databases)
        db.close()
    })
})


let dbList2 = new Promise(res => {
    db2.on("open", async () => {
        let dbList = await db2.db.admin().listDatabases();
        res(dbList.databases)
        db2.close()
    })
})


setInterval(() => {
    Promise.all([dbList1, dbList2]).then(async (dbList) => {
        let dbList1 = dbList[0].map(db => {
            if (db.name == "admin" || db.name == "local" || db.name == "test") {
                return null
            }
            else {
                return db.name
            }
        })
        let dbList2 = dbList[1].map(db => {
            if (db.name == "admin" || db.name == "local" || db.name == "test") {
                return null
            }
            else {
                return db.name
            }
        })


        for (var db of dbList1) {

            if (db != null) {

                if (dbList2.includes(db) && db != null) {
                    // first process is to check compare the collections in the old and new db 
                    let db1 = mongoose.createConnection(oldDb + "/" + db, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    });
                    let db2 = mongoose.createConnection(newDb + "/" + db, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    });
                    let db1Collection = new Promise((res, rej) => {
                        let data = []
                        db1.on("open", async () => {
                            let dbCollection = await db1.db.listCollections().toArray();
                            // for (var collection of dbCollection) {
                            //     data.push(collection.name)
                            // }
                            res(dbCollection)
                        })



                    })

                    let db2Collection = new Promise((res, rej) => {
                        let data = []
                        db2.on("open", async () => {
                            let dbCollection = await db2.db.listCollections().toArray();
                            res(dbCollection)

                        })





                    })

                    Promise.all([db1Collection, db2Collection]).then(async (dbCollection) => {

                        let db1Collection = dbCollection[0].map(collection => {
                            return collection.name
                        }
                        )
                        let db2Collection = dbCollection[1].map(collection => {
                            return collection.name
                        }
                        )
                        console.log(db1Collection)
                        const diff = db1Collection.length > db2Collection.length ? db1Collection.filter(e => !db2Collection.includes(e)) : db2Collection.filter(e => !db1Collection.includes(e))

                        if (diff.length > 0) {
                            for (var collectionDiff of diff) {
                                let coldb1 = db1.db.collection(collectionDiff)
                                let coldb2 = db2.db.collection(collectionDiff)
                                try {
                                    let coldb1Data = await coldb1.find({}).limit(10).toArray()

                                    console.log(coldb1Data)
                                } catch (error) {
                                    console.log(error)
                                }

                            }
                        }
                        else {  // as the difference is null we will loop throuh each collection and compare the collections
                            for (var collection of dbCollection[0]) {
                                let coldb1 = db1.db.collection(collection.name)
                                let coldb2 = db2.db.collection(collection.name)
                                try {
                                    let theMaxId = await coldb2.findOne({}, { sort: { _id: -1 } })
                                    if (theMaxId) {
                                        let coldb1Data = await coldb1.find({ _id: { $gt: theMaxId._id } }).toArray()

                                        if (coldb1Data.length > 0) {

                                            let data = await coldb2.insertMany(coldb1Data)
                                            console.log(data)
                                            console.log(collection.name)
                                        }
                                        else {
                                            console.log(collection.name)
                                            setTimeout(async () => {
                                                if (coldb1Data.length > 0) {
                                                    let data = await coldb2.insertMany(coldb1Data)
                                                    console.log(data)


                                                }
                                                else {
                                                    
                                                    setTimeout(async () => {
                                                        if (coldb1Data.length > 0) {
                                                            let data = await coldb2.insertMany(coldb1Data)
                                                            console.log(data)


                                                        }
                                                        else {
                                                            
                                                            
                                                            setTimeout(async () => {
                                                                if (coldb1Data.length > 0) {
                                                                    let data = await coldb2.insertMany(coldb1Data)
                                                                    console.log(data)
                                                                }
                                                                else {
                                                                    setTimeout(async () => {
                                                                        if (coldb1Data.length > 0) {
                                                                            let data = await coldb2.insertMany(coldb1Data)
                                                                            console.log(data)
                                                                        }
                                                                        else {
                                                                            setTimeout(async () => {
                                                                                if (coldb1Data.length > 0) {
                                                                                    let data = await coldb2.insertMany(coldb1Data)
                                                                                    console.log(data)
                                                                                }
                                                                                else {
                                                                                    console.log("addedd")
                                                                                }

                                                                            }, 5000);
                                                                        }

                                                                    }, 5000);
                                                                }

                                                            }, 5000);
                                                        }
                                                    }, 5000);
                                                }
                                            }, 5000);
                                        }


                                    }


                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        }

                    })

                }
                else {
                    let db1 = await mongoose.createConnection(oldDb + "/" + db.name, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    });
                    let collectionList = await new Promise(res => {

                        db1.on('open', async () => {

                            let collectionList = await db1.db.listCollections().toArray()

                            res(collectionList)
                        })
                    })



                    // setTimeout(() => {
                    let init = mongoose.createConnection(newDb + "/" + db.name, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    })
                    init.on('open', async () => {
                        for (var collectionName of collectionList) {
                            let collection = await init.db.collection(collectionName.name)

                            let data = await db1.db.collection(collectionName.name).find().toArray()
                            collection.insertMany(data)

                        }
                    })


                    // }, 500);
                    setTimeout(() => {
                        db1.close()
                        init.close()
                    }, 5000);



                }
            }
        }


    })
}, 1000*60);