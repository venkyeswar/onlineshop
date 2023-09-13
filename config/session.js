
const expressSession=require('express-session');
const mongoDbStore=require('connect-mongodb-session');


function createSessionStore(session){
    const MongoDbStore=mongoDbStore(expressSession);
    const store=new MongoDbStore({
        uri:'mongodb://0.0.0.0',
        database:'online-shop',
        collection:'sessions',
    });
    return store;

}

function createSessionConfig(){
    return {
         secret:'super-secret',
         resave:false,
         saveUninitialized:false,
         store:createSessionStore(),
         cookie:{
            maxAge:2**24*60*60*1000
         }
    };
}


module.exports=createSessionConfig;