const express=require('express');
const cartController=require('../controllers/cart.controller');

const router=express.Router();

router.post('/items',cartController.addCartItem);

router.get('/',cartController.getCart);

router.patch('/items',cartController.updateCartItem);

module.exports=router;