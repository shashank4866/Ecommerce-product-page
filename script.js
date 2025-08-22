 let cartItemCount = 0;


function addtocart(data){
    ++cartItemCount;
    
    document.querySelector(".item-count").innerHTML = cartItemCount;
    addItemToCart(data)
}

let cartItems = [];
let div=document.createElement("div");
function addItemToCart(data) {
    // check if already in cart
    let exists = cartItems.some(item => item.id === data.id);
    
    if (!exists) {
        cartItems.push(data);
    }

    console.log("Cart:", cartItems);
     div.innerHTML="";
   let total_amount = Math.floor(cartItems.reduce((acc, ele) => acc + ele.price, 0))*91;
     console.log("working");
    cartItems.forEach(ele=>{
       
    div.setAttribute("class","slider-cart");
    let childs=document.createElement("div");
    childs.setAttribute("class","cart-item-container")
    childs.innerHTML=`
    <div>
        <img src="${ele.thumbnail}" class="cart-img">
    <p style="color:#fff">${ele.title }</p>
    `
    div.append(childs)
    
    })
    let priceDetails=document.querySelector("div");
    priceDetails.innerHTML=`
    <p>₹${Math.floor(total_amount)}</p>
    <button onclick="payDetails(${total_amount})" style="padding:10px; color:#fff;background-color:green;border:none;width:100%;">pay</button>
    `
    div.append(priceDetails)
    document.body.append(div)
}

document.querySelector(".cart-view").addEventListener("click",(e)=>{
    e.stopPropagation()
    document.querySelector(".slider-cart").style.display="flex";
});


let payForm=document.createElement("div");
payForm.setAttribute("class","formPay")
function payDetails(amount){
    payForm.innerHTML=`
    <h2>Payment Form</h2>
    <div class="amount-display">
      Total Amount: ₹<span id="totalAmount">${amount}</span>
    </div>

    <form id="paymentForm">
      <div class="form-group">
        <label for="cardName">Card Holder Name</label>
        <input type="text" id="cardName" placeholder="Enter name on card" required>
      </div>

      <div class="form-group">
        <label for="cardNumber">Card Number</label>
        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="16" required>
      </div>

      <div class="form-group">
        <label for="expiry">Expiry Date</label>
        <input type="text" id="expiry" placeholder="MM/YY" required>
      </div>

      <div class="form-group">
        <label for="cvv">CVV</label>
        <input type="password" id="cvv" placeholder="***" maxlength="3" required>
      </div>

      <button type="submit" class="pay-btn">Pay Now</button>
    </form>

    `
    document.body.append(payForm)
}








fetch("https://dummyjson.com/products?limit=20")
.then(res=>res.json())
.then(data=>{
    
    let productsData = data.products;
    console.log(productsData);
    let productscontainer = document.querySelector(".products-container");
   productsData.forEach(element => {
    let div = document.createElement("div");
    div.setAttribute("class", "card");

   div.innerHTML = `
    <img src="${element.thumbnail}">
    <div class="card-btns-title">
        <p>${element.title}</p>
        <div class="price-ratings">
            <b>₹${Math.floor(element.price * 91)}</b>
            <b id="rating">⭐${element.rating}</b>
        </div>
        <button class="add-to-cart" onclick='addtocart(${JSON.stringify(element)})'>Add to cart</button>
        <button onclick='display(${JSON.stringify(element)})'>View</button>
    </div>
`;


    productscontainer.append(div);
});
     
});

function display(data){
   let popupData=data;
    let popup=document.createElement("div");
   popup.setAttribute("class","popup");

   let popupchild=document.createElement("div");
   popupchild.setAttribute("class","popupchild");

//    popupdata

popupchild.innerHTML = `
  <img src="${data.thumbnail}" style="border:1px solid #fff;border-radius:20px;height:30%;margin-top:100px">
  <p class="popup-title">${data.title} - ${data.category}</p>
  <div class="popup-price">
      <b>₹${Math.floor(data.price*91)}</b> <b>⭐${data.rating}</b>
  </div>
  <p style="border-top:2px solid gray">${data.description}</p>
  <div class="reviews">
      ${data.reviews.map(ele => `
        <div class="review-item">
          <span class="profile">
            <b>${ele.reviewerName}</b> <i>${ele.date}</i> 
            <span>
              ${"⭐".repeat(Math.floor(ele.rating)) 
              + (ele.rating % 1 >= 0.5 ? "✨" : "") 
              + "☆".repeat(5 - Math.floor(ele.rating) - (ele.rating % 1 >= 0.5 ? 1 : 0))}
            </span>
          </span> 
          ${ele.comment}
        </div>
      `).join("")}
  </div>
  <button class="add-to-cart" onclick='addtocart(${JSON.stringify(data)})'>add to cart</button>
`;



   let cnlbutton=document.createElement("button");
   cnlbutton.innerText="X";
   cnlbutton.setAttribute("class","cnlbtn")
   popup.append(popupchild);
   popup.append(cnlbutton)
   document.body.append(popup)
   document.querySelector(".cnlbtn").addEventListener("click",()=>{
    document.body.removeChild(popup)
    console.log("cliked");
   })
}

