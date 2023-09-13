const db=require('../data/database');
const bcrypt=require('bcryptjs');
const mongodb=require('mongodb');

class User{
    constructor(userData) {
        this.email = userData.email;
        this.password = userData.password;
        this.fullname = userData.fullname;
       this.address={
        street:userData.street,
        postalCode:userData.postal,
        city:userData.city,
       }
    }
    static async findById(userId){
        const uid=new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({_id:uid},{projection:{password:0}});

    }

    async getUserWithSameEmail(){

        
        return db.getDb().collection('users').findOne({email:this.email});
    }

   async existsAlready(){
       const existingUser=await this.getUserWithSameEmail();
       if(existingUser){
        return true;
       }
       return false;
    }

    async signup(){
        const hashedPassword=await bcrypt.hash(this.password,12);
        db.getDb().collection('users').insertOne({
            email:this.email,
            password:hashedPassword,
            name:this.fullname,
            address:this.address,
        });

    }

    hasMatchingPassword(hashedPassword){
      return   bcrypt.compare(this.password,hashedPassword);
    }
}

module.exports=User;