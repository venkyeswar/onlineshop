 

const cartItemUpdateFormElement=document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement=document.getElementById('cart-total-price');

const cartBadgeElements=document.querySelectorAll('.nav-items .badge');

async function updateCartItem(event){
    event.preventDefault();
    
    let response;
    const form=event.target;
    const productId=form.dataset.productid;
    const csrfToken=form.dataset.csrf;
    const quantity=form.firstElementChild.value;

    
    const cartItemTotalPriceElement=form.parentElement.querySelector('.cart-item-price');

 
 

    try{
      response=await fetch('/cart/items',{
            method:'PATCH',
            body:JSON.stringify({
                productId:productId,
                quantity:quantity,
                _csrf:csrfToken,
            }),
            headers:{
                'Content-Type':'application/json',
            }
        });
    }catch(error){
        alert("Somthing went wrong !")

        return;
    }
    if(!response.ok){
        alert("Something went Wrong");
        return;
    }

    const responseData=await response.json();
    
    cartItemTotalPriceElement.textContent=responseData.updatedCartData.updatedItemPrice;

    cartTotalPriceElement.textContent=responseData.updatedCartData.newTotalPrice;
for(const cartBadgeElement of cartBadgeElements){
    cartBadgeElement.textContent=responseData.updatedCartData.newTotalQuantity;
}
}

for(const formElement of cartItemUpdateFormElement){
    formElement.addEventListener('submit',updateCartItem);
}