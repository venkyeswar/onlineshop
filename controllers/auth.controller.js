const User=require('../models/user.model');
const authUtil=require('../util/authentication');
const validation=require('../util/validation');
const sessionFlash=require('../util/session-flash');
const session = require('express-session');
 



function getSignUp(req,res){
    let sessionData=sessionFlash.getSessionData(req);
 
    if(!sessionData){
        sessionData={
            email:'',
            confirmEmail:'',
            password:'',
            fullname:'',
            street:'',
            postal:'',
            city:''
        }
    }
 

    res.render('customer/auth/signup',{inputData:sessionData});
}

async function signup(req,res,next){
    
    const enteredData={
        email:req.body.email,
        confirmEmail:req.body.Cemail,
        password:req.body.password,
        fullname:req.body.fullname,
        street:req.body.street,
        postal:req.body.postal,
        city:req.body.city
    }
     

    if(!validation.userDetailsAreValid(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    ) || !validation.emailsConfirmed(req.body.email, req.body.Cemail)
    ){
        sessionFlash.flashDataToSession(req,{
            errorMessage:'please check the inputs',
            ...enteredData,
        },function(){
            res.redirect('/signup');
        })
         
        return ;
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city,
    });
    
    




try{
    const existsAlready=await user.existsAlready();
    
    if(existsAlready){
        sessionFlash.flashDataToSession(req,{
            errorMessage:'User exits already ! try login instead!!',
            ...enteredData,
        },function(){
            res.redirect('/signup');
        })
      
        return;
    }

await user.signup();
}catch(error){
    next(error);
    return;
}
res.redirect('/login');

}

function getLogin(req,res){
    let sessionData=sessionFlash.getSessionData(req);
     

    if(!sessionData){
        sessionData={
            email:'',
            password:'',
        };
    }
    
   res.render('customer/auth/login', {inputData:sessionData});
}


async function login(req,res,next){
    const user=new User({
        email:req.body.email,
        password:req.body.password});

    let existingUser;
    try{
      existingUser=await user.getUserWithSameEmail();
    }catch(error){
        next(error);
        return;
    }

    const sessionErrorData={
        errorMessage:"Invalid Credentials - Please check Once",
        email:req.body.email,
        password:req.body.password,
    };
    if(!existingUser){
        sessionFlash.flashDataToSession(req,sessionErrorData,function(){
             
            res.redirect('/login');
        });

       
        return;
    }

    const passwordIsCorrect=await user.hasMatchingPassword(existingUser.password);

    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req,sessionErrorData,function(){
            res.redirect('/login');
    });
    return;
}

    authUtil.createUserSession(req,existingUser,function(){
        res.redirect('/');
    })
}

function logout(req,res){
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports={
    getSignUp:getSignUp,
    getLogin:getLogin,
    signup:signup,
    login:login,
    logout:logout,
}