 let product_display=document.querySelector(".product-display");
 let main=document.querySelector("main");
 let input=document.querySelector("input");
 let addToCart_container=document.querySelector(".addToCart-conatiner");
 let cart_icon=document.querySelector(".cart-icon");
 let cart_closeBtn=document.querySelector(".cart-close");
 let item_count_icon=document.querySelector(".cart-count");
 let searchclose=document.querySelector(".search-close");
 let category=document.querySelector("#category");
 let resultslist=document.querySelector(".results-list")
 let searcheditemval=document.querySelector(".searched-items");
 let loader=document.querySelector(".loader");
 let skip=0;
 let limit=10;

 let searchInput=document.querySelector("#searchInput-div");
 searchclose.addEventListener("click",()=>{
  document.querySelector(".searchPage").style.display="none"
 })

 


 searchInput.addEventListener("click",()=>{
  document.querySelector(".searchPage").style.display="block"
 })


let cart_items=[];
//  todo cart count
let cart_count=0;

//  todo indian currency
 let INR_RUPEE=91;


//  todo total items
let total_items_value=0;
// todo total price
let total_price_value=0;


//  todo dolor to rupee coverter
 let rupeeConverter=(dolor)=>Math.floor(dolor*INR_RUPEE);

//todo  ratings giver function
 let ratings=(ratings)=> '⭐'.repeat(Math.floor(ratings));

//  todo main function this function will get the data from api
 async function load(){
  let res=await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  let data=await res.json();
  let product_data=data.products || [];
  
   // Step 1: Extract names only
    const names = product_data.map(cat => cat.category);

    // Step 2: Remove duplicates using Set
    const uniqueNames = [...new Set(names)];

    // Step 3: Add to dropdown
    uniqueNames.forEach(name => {
      const option = document.createElement("option");
      option.value = name.toLowerCase().replace(/\s+/g, "-"); // safe value
      option.textContent = name;
      category.appendChild(option);
    });


  //todo render the products based on input 
  function render(list){
   list.forEach(element => {
     let cards=document.createElement("div");
    cards.setAttribute("class","cards");
    cards.innerHTML=`
    <div class="product-image">
    <img src=${element.thumbnail} alt=${element.title}>
        </div>
        <div class="product-details">
            <p>${element.title}</p>
            <div class=price-ratings> 
             <b>${ratings(element.rating)}</b> <p>₹${rupeeConverter(element.price)}</p>
            </div>
            <div class="card-buttons">
            <button class="add-to-cart">Add to Cart</button>
            <button class="view"> view</button>
            </div>
      </div>
    `
    const [addBtn, viewBtn] = cards.querySelectorAll('button');
          addBtn.addEventListener('click', ()=> addToCart(element));
          viewBtn.addEventListener('click', ()=> showProduct(element));
    product_display.append(cards);
   });

   


  }

  //todo filter
  category.addEventListener("click",()=>{
    let val=category.value;
      let filterdProduct=product_data.filter(item=>item.category==val)
      product_display.innerHTML = "";
      render(filterdProduct)
      if(val=="All")render(product_data)
  })

  //todo input handler
   input.addEventListener("keyup", (e) => {
  let val = e.target.value.toLowerCase().trim();
  let inputFilterd = product_data.filter(ele => ele.title.toLowerCase().includes(val)||ele.category.toLowerCase().includes(val));
  searcheditemval.innerHTML="seach items";
  if (val.length > 0) {
    if (inputFilterd.length > 0) {
      sercheditems(inputFilterd);
    } else {
      searcheditemval.innerHTML = "No products found";
    }
  } 
});

function sercheditems(items){
  searcheditemval.innerHTML="";
  items.forEach(ele=>{
    let li=document.createElement("li");
    li.setAttribute("class","list-item")
    li.innerHTML=`
    <img src=${ele.thumbnail} alt=${ele.title}/>
    <p>${ele.title}</p>
    `
    searcheditemval.append(li)
  })
  console.log(items);
}
//   // }

 
  render(product_data);
}



// todo diaplaying prroduct details complaetly in new page
// function showProduct(item) {
//   let product_view_modal = document.createElement("section");
//   product_view_modal.setAttribute("class", "product-view-modal");
//   let modal_content = document.createElement("div");
//   modal_content.setAttribute("class", "modal-content");
//   modal_content.innerHTML = `
//     <span class="material-symbols-outlined close-button">arrow_back</span>
//     <div class="product-details">
//       <img src="${item.thumbnail}" alt="${item.title}" class="product-image">
      
//       <div class="product-info">
//         <h2 class="product-name">${item.title}</h2>
//          <p class="product-price">₹${rupeeConverter(item.price)}</p>
//         <p class="product-description">${item.description}</p>
       

//          <div class="reviews">
//           ${item.reviews.length ? item.reviews.map(r => `
//             <div class="review">
//               <header><span>${r.reviewerName || 'User'}</span> <span>${(r.date||'').toString().slice(0,10)}</span></header>
//               <div class="rating">${ratings(r.rating || 0)}</div>
//               <div>${r.comment || ''}</div>
//             </div>
//           `).join('') : '<em style="color:#b8c6cf">No reviews yet.</em>'}
//         </div>
        
//         <button class="add-to-cart" id="add-to-cart-singlepage">Add to Cart</button>
//       </div>
//     </div>
//   `;
//   product_view_modal.append(modal_content);
//   main.append(product_view_modal);

//   // Attach event listener after adding to DOM
//   document.querySelector("#add-to-cart-singlepage").addEventListener("click",()=>addToCart(item))
//   product_view_modal.querySelector(".close-button").addEventListener("click", hideProduct);
// }


// todo diaplaying prroduct details complaetly in new page
function showProduct(item) {
  console.log(item);
  let product_view_modal = document.createElement("section");
  product_view_modal.setAttribute("class", "product-view-modal");

  let modal_content = document.createElement("div");
  modal_content.setAttribute("class", "modal-content");

  modal_content.innerHTML = `
    <span class="material-symbols-outlined close-button">arrow_back</span>
    <div class="product-details">
      <!-- Main Product Image -->
      <img src="${item.thumbnail}" alt="${item.title}" class="product-image" id="mainImage">

      <div class="product-info">
        <h2 class="product-name">${item.title}</h2>
        <p class="product-price">₹${rupeeConverter(item.price)}</p>
        <p class="product-description">${item.description}</p>

        <!-- Thumbnails -->
        <div class="thumbnails">
          ${item.images.map(img => `
            <img src="${img}" class="thumbnail" alt="${item.title}">
          `).join('')}
        </div>

        <div class="reviews">
          ${item.reviews.length ? item.reviews.map(r => `
            <div class="review">
              <header><span>${r.reviewerName || 'User'}</span> 
              <span>${(r.date||'').toString().slice(0,10)}</span></header>
              <div class="rating">${ratings(r.rating || 0)}</div>
              <div>${r.comment || ''}</div>
            </div>
          `).join('') : '<em style="color:#b8c6cf">No reviews yet.</em>'}
        </div>
        
        <button class="add-to-cart" id="add-to-cart-singlepage">Add to Cart</button>
      </div>
    </div>
  `;

  product_view_modal.append(modal_content);
  main.append(product_view_modal);

  // Attach events
  document.querySelector("#add-to-cart-singlepage")
          .addEventListener("click",()=>addToCart(item));
  product_view_modal.querySelector(".close-button")
          .addEventListener("click", hideProduct);

  // Thumbnail click handler -> change main image
  const mainImage = product_view_modal.querySelector("#mainImage");
  const thumbnails = product_view_modal.querySelectorAll(".thumbnail");
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      // Optional: highlight active thumbnail
      thumbnails.forEach(t => t.classList.remove("active-thumb"));
      thumb.classList.add("active-thumb");
    });
  });
}


// todo hide the complete product details 
function hideProduct() {
  const modal = document.querySelector(".product-view-modal");
  if (modal) modal.remove();
}



// todo adding item to cart
function addToCart(item) {
  item_count_icon.innerHTML=++cart_count;
  
  // Push only if it's a single object
  if (item && !Array.isArray(item)) {
    cart_items.push({ ...item, productId: Date.now() });
  }
  item_count_icon.classList.add("float-anim");
  


  renderCart();
  setTimeout(()=>{
    item_count_icon.classList.remove("float-anim")
  },200)
}

function renderCart() {
// todo payment and checkout
  let total_amount=document.querySelector(".total-amount");
  let total_items=document.querySelector(".total-items");
  total_items_value=cart_items.length;
  total_amount_value=cart_items.reduce((acc,ele)=>{
    return acc+rupeeConverter(ele.price)
  },0)
  total_items.innerHTML=`Total Amount: ${total_amount_value}`;
  total_amount.innerHTML=`Total Items: ${total_items_value}`
  
  let cart = document.querySelector(".cart-items");
  cart.innerHTML = ""; // clear old UI

  cart_items.forEach(element => {
    let carts_item = document.createElement("div");
    carts_item.innerHTML = `
      <div class="cart-item">
        <div class="image-title">
          <img src=${element.thumbnail} alt=${element.title}>
          <p>${element.title}</p>
        </div>
        <div class="remove-btn">
          <button class="remove_btn">Remove</button>
        </div>
      </div>
    `;

    cart.append(carts_item);

    let [removebtn] = carts_item.querySelectorAll("button");
    removebtn.addEventListener("click", () => deleteItem(element.productId));
  });
}

function deleteItem(id) {
  // update the global cart_items array
  cart_items = cart_items.filter(ele => ele.productId !== id);

  // re-render UI
  renderCart();
}



cart_icon.addEventListener("click",(e)=>{
  addToCart_container.style.display="block";
})

cart_closeBtn.addEventListener("click",()=>{
    addToCart_container.style.display="none";
})



// todo checkout

let checkout=document.querySelector(".checkout-btn");
checkout.addEventListener("click",()=>{
 if(cart_items.length>0){
   payForm()
 }
 else{
  alert("please add items to cart")
 }
})

// todo pay form

function payForm(){

  let formContainer=document.createElement("div");
  formContainer.setAttribute("class","formContainer")
  formContainer.innerHTML=`
  <form>
  <input type="text" placeholder="enter a card holder name" required>

  <input type="text" min="16" max="16" placeholder="enter a card number"  required >

  <input type="text" placeholder="enter a expiry date"  required>

<button class="pay">Pay</button>
  </form>
  `
  main.append(formContainer)
  document.querySelector(".pay").addEventListener("click",(e)=>{
    e.preventDefault(e)
    showPaymentSuccess()

  })
}

function showPaymentSuccess() {
  cart_items=[];
  total_items_value=0;
  total_price_value=0;
  cart_count=0;
  main.removeChild(document.querySelector(".formContainer"))
  renderCart()
  let successBox = document.getElementById("paymentSuccess");
  successBox.style.display = "flex";

  // Auto close after 2 sec
  setTimeout(() => {
    successBox.style.display = "none";
  }, 2000);
}



// todo scroll
 window.addEventListener("scroll", () => {
  loader.style.display="block"

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setTimeout(()=>{
          skip += limit; // move to next batch
        load()
        loader.style.display="none"
        },1000)
      }
    });


// payForm()


// todo loading to run or execuet load function

load()

