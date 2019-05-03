//v 4.0 save / parseUrlData array via cookies
//v 4.0 read cookie on load and display

//v4.1 parseUrlData values via URL
function parseUrlData(name) {
    let url = window.location.search;
    let num = url.search(name);
    let namel = name.length;
    let frontlength = namel + num + 1;
    let front = url.substring(0, frontlength);
    url = url.replace(front, "");
    num = url.search("&");
    if (num >= 0) return url.substr(0, num);
    if (num < 0) return url;
}

function passList() {
    let getshorturl = 0;
    let login = "o_3iokgmm945";
    let api_key = "R_f2f3c9387a374e3fc6bf4b1ec2c945c4";
    let long_url = "https://127.0.0.1/rvclist/index.html?list=" + shoppingList;
    try {
        $.getJSON(
            "https://api-ssl.bitly.com/v3/shorten?callback=?",
            {
                "format": "json",
                "apiKey": api_key,
                "login": login,
                "longUrl": long_url
            },
            function (response) {
                getshorturl = 1;
                document.getElementById("sharelist").innerHTML = 'Share List:\n' + response.data.url;
                copyToClipboard(response.data.url);
            });
    } catch (err) {
        document.getElementById("sharelist").innerHTML = 'Share List:\n' + long_url;
        copyToClipboard(long_url);
    }
}

function share() {
    passList();
}

function copyToClipboard(text) {
    window.prompt("Copy & Share List!", text);
}

window.onload = function () {
    populateShoppingListOnLoad();
    displayShoppinglist();
    clearFocus();
};

function readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function formatCookie(str) {
    if (str === null || str === '')
        return false;
    str = str.toString();
    str = str.replace(/%20/g, " ");
    str = str.replace(/%21/g, "!");
    str = str.replace(/%24/g, "$");
    str = str.replace(/%7C/g, " | ");
    return str.replace(/[^\x20-\x7E]/g, '');
}

function saveCookie() {
    deleteCookie('konkollist');
    let date = new Date();
    date.setTime(date.getTime() + Number(365) * 3600 * 1000);
    document.cookie = 'konkollist' + "=" + escape(shoppingList.join(',')) + "; path=/;expires = " + date.toGMTString();
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function populateShoppingListOnLoad() {
    shoppingList = [];
    addToCart = [];
    let y = readCookie('konkollist');
    y = formatCookie(y);

    let geturllistvalue = parseUrlData("list");
    if (geturllistvalue) {
        geturllistvalue = formatCookie(geturllistvalue);
        geturllistvalue = geturllistvalue.split(',');
        shoppingList = geturllistvalue;
    } else if (y) {
        y = y.split('%2C');
        shoppingList = y;
    }
}


let myItems = {
    name: "",
    price: ""
};
let shoppingList = [];
let addToCart = [];

function changeShoppinglist(position) {
    let arrays = shoppingList[position];
    arrays = arrays.split(",");
    let e1 = arrays[0];
    let e2 = arrays[1];
    let ReplacedAmount = e2.replace(/\$/g, '');
    let eitem = prompt("Please enter new item", e1);
    let ecost = prompt("Please enter your name", ReplacedAmount);
    shoppingList[position] = eitem + "," + '$' + ecost;
    displayShoppinglist();
    displayShoppingCart();
    saveCookie();
}

function changeShoppingCart(position) {
    document.getElementById("MyCart").innerHTML = shoppingList[position];
    let arrays = addToCart[position];
    arrays = arrays.split(",");
    let e1 = arrays[0];
    let e2 = arrays[1];
    let replacedAmount = e2.replace(/\$/g, '');
    let eitem = prompt("Please enter new item", e1);
    let ecost = prompt("Please enter your name", replacedAmount);
    addToCart[position] = eitem + "," + '$' + ecost;
    displayShoppinglist();
    displayShoppingCart();
    saveCookie();
}

function addBackToShoppingList(item, num) {
    deleteShoppingCart(num);
    shoppingList.push(item);
    displayShoppinglist();
    displayShoppingCart();
    clearFocus();
    saveCookie();
}

function addToShopCart(item, num) {
    document.getElementById("sharelist").innerHTML = ' ';
    deleteShoppinglists(num);
    addToCart.push(item);
    //display shoppingList
    displayShoppinglist();
//v3.1 display displayShoppingCart() 
    displayShoppingCart();
    //Clear
    clearFocus();
    //v 4.0 save cookie
    saveCookie();
}

function addShoppingList(item) {
    if (item != "") {
        document.getElementById("sharelist").innerHTML = ' ';
        shoppingList.push(item);
        displayShoppinglist();
        displayShoppingCart();
        clearFocus();
        saveCookie();
    } else {
        alert("Item Description Required: Please enter now :)");
        clearFocus();
    }
}

function clearFocus() {
    document.getElementById("item").value = "";
    document.getElementById("item").focus();
}

function displayShoppinglist() {
    document.getElementById("MyList").innerHTML = '';
    let theList = "";
    let theRow = "";
    let arrayLength = shoppingList.length;
    for (let i = 0; i < shoppingList.length; i++) {
        let btnDelete = ' <input class="button" id="remove" name="delete" type="button" value="Remove" onclick="deleteShoppinglists(' + i + ')" />';
        let btnUpdate = ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppinglist(' + i + ')" />';
        let arrays = shoppingList[i];
        arrays = "'" + arrays + "'";
        let btnAddCart = '<input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="addToShopCart(' + arrays + ',' + i + ')" />';
        let btnShareList = '<input class="button" id="shares" name="shares" type="submit" value="Share Shopping List" onclick="share()" />';
        theRow = '<li>' + shoppingList[i] + btnDelete + ' ' + btnAddCart + '</li>';
        theList += theRow;
    }
    if (arrayLength > 0) {
        document.getElementById("MyList").innerHTML = '<ul>' + theList + '</ul>';
        document.getElementById("btnSubmit").innerHTML = btnSubmit;
    } else {
        document.getElementById("MyList").innerHTML = ' ';
        document.getElementById("btnSubmit").innerHTML = ' ';
        document.getElementById("sharelist").innerHTML = ' ';
    }
}

function displayShoppingCart() {
    document.getElementById("MyCart").innerHTML = '';
    let theList = "";
    let theRow = "";
    let length = addToCart.length;
    for (let i = 0; i < length; i++) {
        let btnDelete = ' <input class="button" id="remove" name="delete" type="button" value="Remove" onclick="deleteShoppingCart(' + i + ')" />';
        let btnUpdate = ' <input class="button" name="edit" type="button" value="Edit Item" onclick="changeShoppingCart(' + i + ')" />';
        let arrays = addToCart[i];
        arrays = "'" + arrays + "'";
        let btnAddList = '<input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="addBackToShoppingList(' + arrays + ',' + i + ')" checked="checked"/>';
        theRow = "<li>" + addToCart[i] + btnDelete + ' ' + ' ' + btnAddList + '</li>';
        theList += theRow;
    }
    if (length > 0) {
        document.getElementById("labels").innerHTML = 'Purchased the item(s)!';
        document.getElementById("MyCart").innerHTML = '<ul>' + theList + '</ul>';
    } else {
        document.getElementById("labels").innerHTML = '';
        document.getElementById("MyCart").innerHTML = '';
    }
}

function deleteShoppinglists(position) {
    document.getElementById("sharelist").innerHTML = ' ';
    shoppingList.splice(position, 1);
    displayShoppinglist();
    displayShoppingCart();
    saveCookie();
}

function deleteShoppingCart(position) {
    document.getElementById("sharelist").innerHTML = ' ';
    addToCart.splice(position, 1);
    displayShoppinglist();
    displayShoppingCart();
}



