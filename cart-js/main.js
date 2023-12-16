let iconCard = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let quantitySpan = document.querySelector(".quantity span");
let listProducts = [];
let carts = [];
iconCard.addEventListener("click", () => {
    body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
    body.classList.toggle("showCart");
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = "";
    if (listProducts.length > 0) {
        listProducts.forEach((product) => {
            let newProduct = document.createElement("div");
            newProduct.classList.add("item");
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = ` 
             <img src="${product.img}" alt="" />
             <h2>${product.name}</h2>
             <div class="price">${product.prise}$</div>
             <button class="addcart">add to cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};
listProductHTML.addEventListener("click", (event) => {
    let posisionclick = event.target;
    if (posisionclick.classList.contains("addcart")) {
        let product_id = posisionclick.parentElement.dataset.id;
        addToCart(product_id);
    }
});
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [
            {
                product_id: product_id,
                quantity: 1,
            },
        ];
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1,
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};
const addCartToMemory = () => {
    localStorage.setItem("cart", JSON.stringify(carts));
};
const addCartToHTML = () => {
    listCartHTML.innerHTML = "";
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach((cart) => {
            totalQuantity = totalQuantity + cart.quantity;
            let newcart = document.createElement("div");
            newcart.classList.add("item");
            newcart.dataset.id = cart.product_id;
            let posisionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[posisionProduct];
            newcart.innerHTML = ` 
        <div class="img">
        <img src="${info.img}" alt="" />
        </div>

        <div class="name">name:${info.name}</div>
        <div class="totalPrice">${info.prise}$</div>
        <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
        </div>`;
            listCartHTML.appendChild(newcart);
        });
    }
    document.querySelector(".icon-cart span").innerText = totalQuantity;
};
listCartHTML.addEventListener("click", (event) => {
    let posisionclick = event.target;
    if (posisionclick.classList.contains("minus") || posisionclick.classList.contains("plus")) {
        let product_id = posisionclick.parentElement.parentElement.dataset.id;
        let type = "minus";
        if (posisionclick.classList.contains("plus")) {
            type = "plus";
        }
        changeQuantity(product_id, type);
    }
});
const changeQuantity = (product_id, type) => {
    let posisionitemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (posisionitemInCart >= 0) {
        switch (type) {
            case "plus":
                carts[posisionitemInCart].quantity += 1;
                break;
            default:
                let valuechange = carts[posisionitemInCart].quantity - 1;
                if (valuechange > 0) {
                    carts[posisionitemInCart].quantity = valuechange;
                } else {
                    carts.splice(posisionitemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
};

const initApp = () => {
    // get data from json
    fetch("product.json")
        .then((Response) => Response.json())
        .then((data) => {
            listProducts = data;
            addDataToHTML();
            // get carts from memory
            if (localStorage.getItem("cart")) {
                carts = JSON.parse(localStorage.getItem("cart"));
                addCartToHTML();
            }
        });
};
initApp();
