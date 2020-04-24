//=======  Create a Multi step form                   - Done
//=======  Add Form Validation                        - Done 
//=======  Add Tab                                    - Done
//=======  fetch country from api                     - Done
//=======  store data in local storage                - Done
//=======  show data in a table                       - Done
//=======  show unique country in select box in table - 
//=======  filter data based on country in table 


//  variables for forms
var currentTab = 0;
var tabs = document.getElementsByClassName("single__tab");
var prev = document.getElementById("prev");
var next = document.getElementById("next");
var regiForm = document.getElementById("regiForm");
var indicators = document.getElementsByClassName("step");
var menu = document.getElementsByClassName("menu_item");

// variables for from validation
var fName = document.getElementById("fName");
var lName = document.getElementById("lName");
var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var tel = document.getElementById("tel");
var date = document.getElementById("date");
var country = document.getElementById("country");
var tableCountry = document.getElementById("tCountry");
var table = document.getElementById("tdata");
let valid = true;
let con = [];
let users =  getStorage();
let singleValue = {};
let filturedUsers = users;
let separateCountry = filturedUsers.map((country) => country.country);
let uniqueCountry = ["all", ...new Set(separateCountry)]
console.log(filturedUsers);

function handleChange(event){
    let value = event.target.value;
    let temp = filturedUsers.filter((item) => item.country === value);
    // console.log(temp);
    
    filturedUsers = temp;
    return filturedUsers;
    

}
console.log(filturedUsers);
// show data in table 
filturedUsers.map((item, index) => {
    // console.log(item);
    
    table.innerHTML += `
    <tr>
        <th scope="row">${index}</th>
        <td>${item.fName}</td>
        <td>${item.lName}</td>
        <td>${item.email}</td>
        <td>${item.username}</td>
        <td>${item.password}</td>
        <td>${item.country}</td>
        <td>${item.tel}</td>
        <td>${item.date}</td>
    </tr>
    `;
})

// show error in inpu in not valid 
function showError(input) {
    input.classList.add("error");
}

// show unique country in select 
uniqueCountry.map((item, index) => {
    tableCountry.innerHTML += `
        <option value="${item.toLowerCase()}" onchange="handleChange(event)">${item}</option>
    `;
})


// Check email is valid
function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(input.value.trim())) {
        // showError(input);
        alert("your email is not Valid");
        valid = false;
    }else{
        valid = true
    }
}

// load countries
async function loadCountries() {
    let dat = await fetch('https://restcountries.eu/rest/v2/all');
    let data = await dat.json();
    
    con = [...data];
    
    // con.map(item => {
    //     country.innerHTML += `<option value="${item.name.toLowerCase()}">${item.name}</option>`;
    // })

    con.forEach( (item, index) => {
        country.innerHTML += `<option value="${item.name.toLowerCase()}">${item.name}</option>`;
    } );
    
}
loadCountries();

// form validation 
function validateForm(currentTab) {
    let y = tabs[currentTab].getElementsByTagName("input");
    
    for (let i = 0; i < y.length; i++) {
        if(y[i].value == ""){
            showError(y[i]);
            valid = false;
        }else{
            valid = true;
        }
        if(y[i].id == "email" && y[i].value != ""){
            checkEmail(y[i]);
            
        }
    }

    if(valid){
        indicators[currentTab].className += " finish";
        menu[currentTab].className += " finish";
    }
    return valid;
}

// show first tab
showTab(currentTab);
function showTab(currentTab) {
    tabs[currentTab].style.display = "block";
    buttonDecorate(currentTab);
    inicatorDecoration(currentTab);
}

// store value 
function storeValue(currentTab) {
    var x =  tabs[currentTab].getElementsByTagName("input");
    var y =  tabs[currentTab].getElementsByTagName("select");
    
    // console.log(y);
    
    for (let index = 0; index < x.length; index++) {
        let name = x[index].id;
        let val = x[index].value;
        singleValue[`${name}`] = val;
        // console.log(`name is ${name}. value is ${val}`);
        
        
        
    }
    for (let index = 0; index < y.length; index++) {
        let name = y[index].id;
        let val = y[index].value;
        singleValue[`${name}`] = val;
    }

}

// button decorated 
function buttonDecorate(currentTab) {
    currentTab == 0 ? prev.style.display = "none" : prev.style.display = "inline";
    currentTab == (tabs.length - 1) ? next.innerHTML = "Submit" : next.innerHTML = "Next";
}

function inicatorDecoration(currentTab) {
    indicatorOff();
    indicators[currentTab].classList.add("active");
}

// remove all active class from all indicator 
function indicatorOff(){
    for (let index = 0; index < indicators.length; index++) {
        indicators[index].classList.remove("active");
    }
}

// store data in localstorage
function syncStorage(users){
    localStorage.setItem("users", JSON.stringify(users));
}

// retrive data from localstorage
function getStorage(){
    let users;
    if(localStorage.getItem("users")){
        users = JSON.parse(localStorage.getItem("users"));
    }else{
        users = [];
    }
    return users;
}

// next prev function
function nextPrev(n) {
    if (n == 1 && !validateForm(currentTab)) return false;
    storeValue(currentTab);
    
    tabs[currentTab].style.display = "none";
    currentTab = currentTab + n;
    
    if(currentTab == tabs.length){
        users.push(singleValue);
        syncStorage(users);
        regiForm.submit();
        return false;
    }
    showTab(currentTab);
}
