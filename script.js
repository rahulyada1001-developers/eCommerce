// Code for navbar toggler
const navbar = document.querySelector(".navbar-toggler-icon");
const crossicon = document.querySelector(".crossicon");
const toggler = document.querySelector(".navbar-toggler")

toggler.addEventListener("click", () => {
    const isOpen = toggler.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        crossicon.style.display = "block";
        navbar.style.display = "none";
    }

    else {
        crossicon.style.display = "none"
        navbar.style.display = "block"
    }
});

// Code for scroll navabar static

window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768)
        return;

    const navbar = document.querySelector(".navvbar");
    const triggerpoint = window.innerHeight * 0.15;
    const scrolled = window.scrollY;

    if (scrolled > triggerpoint) {
        navbar.style.position = "fixed";
        navbar.style.backgroundColor = "white";
        navbar.style.top = "0";
        navbar.style.height = "10%"
        navbar.style.width = "100%"
        navbar.style.marginBottom = "0px";
        navbar.style.transition = "0.5s";
    }
    else {
        navbar.style.backgroundColor = "transparent";
        navbar.style.position = "absolute";
        navbar.style.top = "50px";
        navbar.style.transition = "0.5s";
    }
});

// Code for small screen navabr 

function resetNavbarForMobile() {
    const navbar = document.querySelector(".navvbar");

    if (window.innerWidth <= 992) {
        navbar.style.position = "";
        navbar.style.backgroundColor = "";
        navbar.style.top = "";
        navbar.style.height = "";
        navbar.style.width = "";
        navbar.style.marginBottom = "";
        navbar.style.transition = "";

        navbar.classList.add("mobile-fixed");
    } else {
        navbar.classList.remove("mobile-fixed");
    }
}

window.addEventListener("resize", resetNavbarForMobile);
resetNavbarForMobile();

// Code for displaying product by fetching from json file..

const productContainer = document.querySelector(".productContainer");
const productList = document.querySelector("#product-list");
let selectedProduct = null;        //Declare globally for adding to cart

async function showProduct() {
    const response = await fetch("product.json");
    const product = await response.json();
    // console.log(product);
    displayProducts(product);
}

function displayProducts(products) {
    products.forEach(items => {

        const clone = productContainer.cloneNode(true);
        clone.style.display = "block";

        clone.querySelector(".disimage").src = items.image;
        clone.querySelector("#name").textContent = items.name;
        clone.querySelector("#price").textContent = `₹ ${items.price}`;

        // For wishlist
        const heart = clone.querySelector(".heart-icon");
        const wishpopup = document.querySelector("#wishpopup");
        const wishbtn = document.querySelector(".wishbtn");

        heart.addEventListener("click", () => {
            heart.classList.toggle("active");

            if (heart.classList.contains("active")) {
                heart.classList.replace("bi-heart", "bi-heart-fill");
                wishpopup.style.display = "flex";
                wishpopup.querySelector("#proname").textContent = items.name;

                const timer = setTimeout(() => {
                    wishpopup.style.display = "none";
                }, 5000);

                wishbtn.addEventListener("click", () => {
                    wishpopup.style.display = "none";
                    clearTimeout(timer);
                }, { once: true });

            }
            else {
                heart.classList.replace("bi-heart-fill", "bi-heart");
            }
        });


        // Code for displaying product for overview
        const overimage = document.querySelector(".overimage");
        const openview = clone.querySelectorAll(".openview");
        const closeview = document.querySelector(".closeview");
        const backblur = document.querySelector(".backblur");
        const viewname = document.querySelector(".viewname");
        const viewprice = document.querySelector(".viewprice");

        openview.forEach((view) => {
            view.addEventListener("click", () => {
                backblur.style.display = "flex";
                overimage.src = items.image;
                viewname.textContent = items.name;
                viewprice.textContent = `₹ ${items.price}`;

                selectedProduct = items;        // As soon as product display selected items also display. 
            });
        });
        closeview.addEventListener("click", () => {
            backblur.style.display = "none";
        });

        // Cart option overview

        const cartoverview = document.querySelector(".cartoption");
        const cartopen = document.querySelector(".cartopen");
        const closecart = document.querySelector(".closecart");

        cartopen.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            cartoverview.style.display = "flex";
        });
        closecart.addEventListener("click", () => {
            cartoverview.style.display = "none";
        });

        productList.appendChild(clone);

        // Code for product overview.... this code must be written in this function

        clone.querySelectorAll(".adj").forEach((card) => {
            const proview = card.querySelector(".proview");

            card.addEventListener("mouseenter", () => {
                proview.style.display = "block";
                proview.style.transition = "transform 0.6s ease"
            });
            card.addEventListener("mouseleave", () => {
                proview.style.display = "none";
            });
        });
    });

    // Code for increment and decrement product quantity..

    const increment = document.querySelector(".increment");
    const decrement = document.querySelector(".decrement");
    const quantext = document.querySelector(".size");
    let quantity = 1;

    increment.addEventListener("click", () => {
        quantity++;
        quantext.textContent = quantity;
    });
    decrement.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            quantext.textContent = quantity;
        }
    });
}

showProduct();

// Code for saving product to local storage..

document.querySelector(".cartbtn").addEventListener("click", (event) => {
    if (!selectedProduct)
        return;
    let quantity = Number(document.querySelector(".size").textContent);
    getProductFromLS(selectedProduct, quantity);
    loadcart();
    // console.log(selectedProduct, quantity);

});

// This function is just for setting product info into local storage..

function getProductFromLS(product, quantity) {
    // alert("Clicked..");
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    let price = Number(product.price);
    let totalprice = price * quantity;
    const existing = cartProducts.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
        existing.totalprice += totalprice;
    }
    else {
        cartProducts.push({
            image: product.image,
            id: product.id,
            name: product.name,
            quantity: quantity,
            price: price,
            totalprice: totalprice
        });
    }
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    // console.log(existing.name);

    console.log(cartProducts.length);

    let cartnumber = document.querySelector(".cartopen");
    return cartnumber.innerHTML = `<span class="position-absolute top-0 start-25 translate-middle badge rounded-pill "style="background-color: #717fe0;">${cartProducts.length}</span>`;

}

// Displaying product details from local storage into cart page...

document.addEventListener("DOMContentLoaded", loadcart);

function loadcart() {
    const cartContainer = document.querySelector(".cart-items");
    const total = document.querySelector("#GrandTotal");
    const totalitems=document.querySelector(".totalitems");
    const totalit=document.querySelector(".totalit");

    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    totalitems.textContent=cartProducts.length;
    totalit.textContent=cartProducts.length;
    
    cartContainer.innerHTML = "";
    let grandTotal = 0;

    cartProducts.forEach(item => {
        grandTotal += item.totalprice;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
                <div class="cart-row container">
                    <img src="${item.image}"   width="70">
                    <span class="productname playfair-display">${item.name}</span>
                    <span class="productprice playfair-display">₹${item.price}</span>
                    <span class="productquantity playfair-display">Qty: ${item.quantity}</span>
                    
                    <button onclick="removeItem(${item.id})">❌</button>
                </div>
                <hr>
        `;
        cartContainer.appendChild(cartItem);
    });
    total.textContent = `₹${grandTotal}`;
}

// Fuction to remove items from cart

function removeItem(id) {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    cartProducts = cartProducts.filter(item => item.id !== id);

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    loadcart(); // re-render
}
