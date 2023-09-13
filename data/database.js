const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;
let mongodbUrl="mongodb+srv://venkyeswar:7112001746@cluster0.qpo13la.mongodb.net/?retryWrites=true&w=majority"


if(process.env.MONGODB_URL){
    mongodbUrl=process.env.MONGODB_URL;
}
let database;

async function connectToDatabase(){

 const client=await MongoClient.connect(mongodbUrl);
 database=client.db('online-shop');

}

function getDb(){
    if(!database){
        throw new Error("database is not connected");
    }
    return database;
}


module.exports={
    connectToDatabase:connectToDatabase,
    getDb:getDb,
}
