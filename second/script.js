 //todo  DOM Elements
    let product_display = document.querySelector(".product-display");
    let main = document.querySelector("main");
    let input = document.querySelector("#searchInput");
    let addToCart_container = document.querySelector(".addToCart-conatiner");
    let cart_icon = document.querySelector(".cart-icon");
    let cart_closeBtn = document.querySelector(".cart-close");
    let item_count_icon = document.querySelector(".cart-count");
    let searchclose = document.querySelector(".search-close");
    let category = document.querySelector("#category");
    let searcheditemval = document.querySelector(".searched-items");
    let loader = document.querySelector(".loader");
    let searchPage = document.querySelector(".searchPage");
    let searchInputDiv = document.querySelector("#searchInput-div");
    let delivery_info_close=document.querySelector(".delivery-info-close");
    let delivery_icon=document.querySelector(".delivery-icon");
    let delivery_info=document.querySelector(".delivery-info");

    let delivery_item_container=document.querySelector(".delivery-item-container");
    let skip = 0;
    let limit = 10;

    //todo Cart and product data
    
    let cart_items = JSON.parse(localStorage.getItem("cart-item")) || [];

    // todo delivery
    let delivery=JSON.parse(localStorage.getItem("items-delivery"))||[];

    document.addEventListener("DOMContentLoaded",()=>{
        localStorage.setItem("cart-item", JSON.stringify(cart_items));
        localStorage.setItem("items-delivery",JSON.stringify(delivery));
        console.log(delivery);
        console.log(cart_items);
        cartcountsetter()
        renderCart()
    })


    

   
    let cart_count = cart_items.reduce((acc,ele)=>{
        return acc+ele.itemQuantity;
    },0);
    let INR_RUPEE = 91;
    // let total_items_value = 0;
    // let total_price_value = 0;
    let total_amount_value=0;

    // Event Listeners
    searchclose.addEventListener("click", () => {
        searchPage.classList.remove("active");
    });

    searchInputDiv.addEventListener("click", () => {
        searchPage.classList.add("active");
        input.focus();
    });

    cart_icon.addEventListener("click", (e) => {
        addToCart_container.classList.add("active");
    });

    cart_closeBtn.addEventListener("click", () => {
        addToCart_container.classList.remove("active");
    });

    delivery_icon.addEventListener("click",()=>{
        delivery_info.classList.add("active")
    })
    delivery_info_close.addEventListener("click",()=>{
        delivery_info.classList.remove("active");
    })

    // Utility Functions
    let rupeeConverter = (dolor) => Math.floor(dolor * INR_RUPEE);
    let ratings = (ratings) => '⭐'.repeat(Math.floor(ratings));

    // Main function to load products
    async function load() {
        let res = await fetch(`https://dummyjson.com/products?limit=5&skip=${skip}`);
        let data = await res.json();
        let product_data = data.products || [];
        
        // Add categories to dropdown
        const names = product_data.map(cat => cat.category);
        const uniqueNames = [...new Set(names)];
        uniqueNames.forEach(name => {
            const option = document.createElement("option");
            option.value = name.toLowerCase().replace(/\s+/g, "-");
            option.textContent = name;
            category.appendChild(option);
        });

        // Render products
        function render(list) {
            product_display.innerHTML = "";
            list.forEach(element => {
                let cards = document.createElement("div");
                cards.setAttribute("class", "cards");
                cards.innerHTML = `
                    <div class="product-image">
                        <img src=${element.thumbnail} alt=${element.title} loading="lazy">
                    </div>
                    <div class="product-details">
                        <p>${element.title}</p>
                        <div class="price-ratings"> 
                            <b>${ratings(element.rating)}</b> <p>₹${rupeeConverter(element.price)}</p>
                            </div>
                        <div class="card-buttons">
                          
                            <button class="add-to-cart">Add to Cart</button>
                           
                            <button class="view">View</button>
                        </div>
                    </div>
                `;
                const [addBtn, viewBtn] = cards.querySelectorAll('button');
                addBtn.addEventListener('click', function (){
                    this.innerHTML="Go To Cart"
                     addToCart_container.classList.add("active");
                     addToCart(element)
                    });
                viewBtn.addEventListener('click', () => showProduct(element));
               
                product_display.append(cards);
            });
        }

        // Category filter
        category.addEventListener("change", () => {
            let val = category.value;
            let filterdProduct = product_data.filter(item => item.category === val)
            product_display.innerHTML = "";
            render(filterdProduct)
            if (val == "All") render(product_data)
        });

        // Search functionality
        let debounceTimer;
        input.addEventListener("keyup", (e) => {
            clearTimeout(debounceTimer);

            debounceTimer=setTimeout(()=>{
            let val = e.target.value.toLowerCase().trim();
            let inputFilterd = product_data.filter(ele => 
                ele.title.toLowerCase().includes(val) || ele.category.toLowerCase().includes(val));
            
            if (val.length > 0) {
                if (inputFilterd.length > 0) {
                    sercheditems(inputFilterd);
                } else {
                    searcheditemval.innerHTML = "<li class='info-text'>No products found</li>";
                }
            } else {
                searcheditemval.innerHTML = "<li class='info-text'>Start typing to search</li>";
            }
            },400) //todo delay 300ms
        });

        function sercheditems(items) {
            searcheditemval.innerHTML = "";
            items.forEach(ele => {
                let li = document.createElement("li");
                li.setAttribute("class", "list-item")
                li.innerHTML = `
                    <img src=${ele.thumbnail} alt=${ele.title} loading="lazy"/>
                    <p>${ele.title}</p>
                `;
                li.addEventListener("click", () => {
                    showProduct(ele);
                    searchPage.classList.remove("active");
                });
                searcheditemval.append(li)
            });
        }

        // Initial render
        render(product_data);
    }

    // Product detail view
    function showProduct(item) {
        let product_view_modal = document.createElement("section");
        product_view_modal.setAttribute("class", "product-view-modal");

        let modal_content = document.createElement("div");
        modal_content.setAttribute("class", "modal-content");

        modal_content.innerHTML = `
            <span class="material-symbols-outlined close-button">arrow_back</span>
            <div class="view-product-details">
                <div class="view-img">
                    <img src="${item.thumbnail}" alt="${item.title}" class="product-image" id="mainImage">
                </div>
                <div class="product-info">
                    <h2 class="product-name">${item.title}</h2>
                    <p class="product-price">₹${rupeeConverter(item.price)}</p>
                    <p class="product-description">${item.description}</p>

                    <div class="thumbnails">
                        ${item.images.map(img => `
                            <img src="${img}" class="thumbnail" alt="${item.title}">
                        `).join('')}
                    </div>
                    
                    <h2>Reviews</h2>
                    <div class="reviews">
                        ${item.reviews && item.reviews.length ? item.reviews.map(r => `
                            <div class="review">
                                <header>
                                    <span>${r.reviewerName || 'User'}</span> 
                                    <span>${(r.date||'').toString().slice(0,10)}</span>
                                </header>
                                <div class="rating">${ratings(r.rating || 0)}</div>
                                <div>${r.comment || ''}</div>
                            </div>
                        `).join('') : '<p style="color:#b8c6cf">No reviews yet.</p>'}
                    </div>
                    
                    <button class="add-to-cart" id="add-to-cart-singlepage">Add to Cart</button>
                </div>
            </div>
        `;

        
        product_view_modal.append(modal_content);
        main.append(product_view_modal);

       

        // Event listeners for product view
        document.querySelector("#add-to-cart-singlepage")
                .addEventListener("click", () => {
                    addToCart(item)
                    notification_function(item.title)
                });
        product_view_modal.querySelector(".close-button")
                .addEventListener("click", hideProduct);

        // Thumbnail functionality
        const mainImage = product_view_modal.querySelector("#mainImage");
        const thumbnails = product_view_modal.querySelectorAll(".thumbnail");
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener("click", () => {
                mainImage.src = thumb.src;
                thumbnails.forEach(t => t.classList.remove("active-thumb"));
                thumb.classList.add("active-thumb");
            });
        });
    }

    function hideProduct() {
        const modal = document.querySelector(".product-view-modal");
        if (modal) modal.remove();
    }

    // Cart functionality
    function addToCart(item) {
        // if(item==undefined)return
        
        let existing = cart_items.find(ele => ele.id === item.id);
        if (existing) {
            console.log("alredy there");
            notification_function(item.title,false) 
        }
        else{
            cart_items.push({ ...item, productId: Date.now(),itemQuantity:1});
            notification_function(item.title,true) 
        }
        // console.log();
        localStorage.setItem("cart-item", JSON.stringify(cart_items));
       cartcountsetter()
        
        renderCart();
    }

 function renderCart() {
    let total_amount = document.querySelector(".total-amount");
    let total_items = document.querySelector(".total-items");
    let total_quantity = document.querySelector(".total-quantity");
    let cart = document.querySelector(".cart-items");

    // Handle empty cart
    // if (cart_items.length === 0) {
    //     cart.innerHTML = "<p>Your cart is empty</p>";
    //     total_items.innerHTML = "Items: 0";
    //     total_amount.innerHTML = "Total: ₹0";
    //     total_quantity.innerHTML = "Quantity: 0";
    //     return;
    // }

    // Calculate totals
    let total_quantity_value = cart_items.reduce((acc, ele) => acc + ele.itemQuantity, 0);
    let total_items_value = cart_items.length;
     total_amount_value = cart_items.reduce((acc, ele) => {
        return acc + (rupeeConverter(ele.price) * ele.itemQuantity);
    }, 0);

    // Update totals in UI
    total_items.innerHTML = `Items: ${total_items_value}`;
    total_amount.innerHTML = `Total: ₹${total_amount_value}`;
    total_quantity.innerHTML = `Quantity: ${total_quantity_value}`;

    // Render cart items
    cart.innerHTML = "";
    cart_items.forEach(element => {
        let carts_item = document.createElement("div");
        carts_item.classList.add("cart-item");
        carts_item.innerHTML = `
            <div class="image-title">
                <img src=${element.thumbnail} alt=${element.title} loading="lazy">
                <p class="cart-item-title">${element.title}</p>
            </div>
            <div class="quantity">
                <span class="decrement">-</span> 
                <span class="value">${element.itemQuantity}</span> 
                <span class="increment">+</span>
            </div>
            <div class="remove-btn">
                <button class="remove_btn">Remove</button>
            </div>
        `;

        // Quantity controls
        const decrement = carts_item.querySelector(".decrement");
        const value = carts_item.querySelector(".value");
        const increment = carts_item.querySelector(".increment");

        let [cart_item]=carts_item.querySelectorAll(".image-title")
        cart_item.addEventListener("click",()=>{
            showProduct(element)
        })

        decrement.addEventListener("click", () => {
            if (element.itemQuantity > 1) {
                element.itemQuantity--;
            } else {
                element.itemQuantity = 0;
                // Optionally remove the item if quantity hits 0
                cart_items = cart_items.filter(item => item.id !== element.id);
            }
            localStorage.setItem("cart-item", JSON.stringify(cart_items));
            renderCart();
        });

        increment.addEventListener("click", () => {
            element.itemQuantity++;
            localStorage.setItem("cart-item", JSON.stringify(cart_items));
            renderCart();
        });

        // Remove button
        let removebtn = carts_item.querySelector(".remove_btn");
        removebtn.addEventListener("click", () => {
            cart_items = cart_items.filter(item => item.id !== element.id);
            localStorage.setItem("cart-item", JSON.stringify(cart_items));
            renderCart();
        });

        cart.append(carts_item);
    });
}


    function deleteItem(id) {
        cart_items = cart_items.filter(ele => ele.productId !== id);
        cart_count = cart_items.length;
        item_count_icon.innerHTML = cart_count;
        localStorage.setItem("cart",JSON.stringify(cart_items))
        renderCart();
    }

    // Checkout functionality
    let checkout = document.querySelector(".checkout-btn");
    checkout.addEventListener("click", () => {
        if (cart_items.length > 0) {
            payForm();
        } else {
            alert("Please add items to cart");
        }
    });

    function payForm() {

        total_price_value=cart_items.reduce((acc,ele)=>acc+rupeeConverter(ele.price),0)
        console.log(total_price_value);
        let formContainer = document.createElement("div");
        formContainer.setAttribute("class", "formContainer");
        formContainer.innerHTML = `
            <form>
                <input type="text" placeholder="Card holder name" required>
                <input type="text" min="16" max="16" placeholder="Card number" required>
                <input type="text" placeholder="Expiry date" required>
                <input type="text" placeholder="CVV" required>
                <button class="pay">Pay ₹${total_amount_value}</button>
            </form>
        `;
        main.append(formContainer);
        
        document.querySelector(".pay").addEventListener("click", (e) => {
            e.preventDefault();
   
            showPaymentSuccess();
        });
    }

    function showPaymentSuccess() {
        orderDetails(cart_items)
        cart_items = [];
        total_items_value = 0;
        total_price_value = 0;
        cart_count = 0;
        item_count_icon.innerHTML = "0";
        
        if (document.querySelector(".formContainer")) {
            main.removeChild(document.querySelector(".formContainer"));
        }
        localStorage.setItem("cart-item",JSON.stringify(cart_items))
        renderCart();
        
        let successBox = document.getElementById("paymentSuccess");
        successBox.style.display = "flex";

        setTimeout(() => {
            successBox.style.display = "none";
            addToCart_container.classList.remove("active");
        }, 2000);

        delivery_info.classList.add("active")
    }


    function orderDetails(item){
        console.log(item);

        delivery=[...delivery,...item]
        console.log(delivery);
        // delivery=[];
        // console.log(delivery);
        // console.log("del");
        // console.log(delivery);
        // console.log("del");
        localStorage.setItem("items-delivery",JSON.stringify(delivery))
        delivery.forEach(ele=>{
            let div=document.createElement("div");
            div.setAttribute("class","delivery")
            div.innerHTML=`
            <h1 class="delivery-title">${ele.title}</h1>

            <div class="order-anim">
                        <span class="material-symbols-outlined ">check</span>

            <div></div>
                        <span class="material-symbols-outlined ">check</span>

            <div></div>
                        <span class="material-symbols-outlined ">check</span>

            <div></div>
                        <span class="material-symbols-outlined">check</span>

            </div>
            `;
            let delivery_icons=document.createElement("div");
            delivery_icons.setAttribute("class","delivery-icons");
            delivery_icons.innerHTML=`
            <div>
            <span class="material-symbols-outlined">assignment_turned_in</span>
            </div>
             <div>
            <span class="material-symbols-outlined">orders</span>
            </div>
             <div>
            <span class="material-symbols-outlined"><span class="material-symbols-outlined">delivery_truck_speed</span></span>
            </div>
             <div>
            <span class="material-symbols-outlined">home</span>
            </div>
            `
            delivery_item_container.append(div)
            delivery_item_container.append(delivery_icons)
        })
        // let orderDetails_conatiner=document.createElement("div");
        // orderDetails_conatiner.setAttribute("class","orderDetails_conatiner")
        // delivery.forEach(ele=>{
        //     let orderdItem=document.createElement("div");
        //     orderdItem.setAttribute("class","orderdItem");
        //     // orderdItem.innerHTML=`
        //     // <p>${ele.title}</p>
        //     // `
        //     console.log("a");
        //     orderDetails_conatiner.append(orderdItem)
        // })
        // delivery_info.append(orderDetails)
      
    }
    // orderDetails(delivery)

    function cartcountsetter(){
         item_count_icon.innerHTML = cart_items.length;
        item_count_icon.classList.add("float-anim");
        setTimeout(() => {
            item_count_icon.classList.remove("float-anim")
        }, 200);
    }

    function notification_function(itemName,sataus){

        let notify=document.createElement("div");
        notify.setAttribute("class","notify")
        if(status){
            notify.innerHTML=itemName+"added to cart";
        }
        else{
            notify.innerHTML=itemName+" is already in cart";
        }
        document.body.append(notify)
        console.log("done");
        setTimeout(()=>{
            notify.remove()
        },2000)
    }

    // notification_function()
    // Initialize
    load();


    // let arr=[{name:"shashi"},{name:"shashank"}]
    // let arr2=[{name:"rahul"},{name:"shambu"}]

    // let arr3=[...arr,...arr2]
    // console.log(arr3);