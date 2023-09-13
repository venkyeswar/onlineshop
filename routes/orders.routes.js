const express=require('express');
const orderController=require('../controllers/orders.controller');

const router=express.Router();

router.post('/',orderController.addOrder);

router.get('/',orderController.getOrders);

router.get('/success',orderController.getSuccess);
router.get('/failure',orderController.getFailure);

module.exports=router;