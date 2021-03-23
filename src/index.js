// write your code here
const API = "http://localhost:3000/ramens";
// Ramen Menu
const ramenDiv = document.querySelector("#ramen-menu");
// Ramen Detail
const ramenImg = document.querySelector("img.detail-image")
const ramenName = document.querySelector("h2.name")
const ramenRestaurant = document.querySelector("h3.restaurant")
// Ramen Form 
const form = document.querySelector("form#ramen-rating")
    const formRating = form.querySelector("#rating")
    const formComment = form.querySelector("#comment")

let clickedOnRamenId

// fetch all ramen
fetch(API)
.then(resp => resp.json())
.then(ramenObjs => {
    ramenObjs.forEach(ramenObj => {
        renderRamenObj(ramenObj)
    });
});

// display single ramen obj on the ramen div
function renderRamenObj(ramenObj) {
    const img = document.createElement('img')
        img.src = ramenObj.image
        img.dataset.id = ramenObj.id
    ramenDiv.append(img)
}

// display clicked on Ramen
function displayRamenDetails(clickedOnRamen) {
    clickedOnRamenId = clickedOnRamen.dataset.id
    fetch(`${API}/${clickedOnRamenId}`)
    .then(resp => resp.json())
    .then(ramenData => {
        let {image, name, restaurant, rating, comment} = ramenData
        ramenImg.src = image
        ramenName.textContent = name
        ramenRestaurant.textContent = restaurant
        formRating.value = rating
        formComment.value = comment
    })
}

// handle ramen image click 
ramenDiv.addEventListener("click", (e) => {
    if (e.target.matches("img")) {
        displayRamenDetails(e.target)
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e.target)
    const rating = e.target.rating.value
    const comment = e.target.comment.value

    fetch(`${API}/${clickedOnRamenId}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            accept: "application/json"
        },
        body: JSON.stringify({
            rating,
            comment
        })
    })
    .then(resp => resp.json())
    .then(updatedRamen => {
        form.dataset.id = updatedRamen.id
        formRating.value = updatedRamen.rating
        formComment.value = updatedRamen.comment
    })

})