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

const newRamenForm = document.querySelector("form#new-ramen")

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
    const button = document.createElement('button')
        button.classList.add("delete")
        button.textContent = `delete ${ramenObj.name}`
    const oneDiv = document.createElement('div')
    oneDiv.classList.add("ramen-div")
    oneDiv.dataset.id = ramenObj.id
    oneDiv.append(img, button)
    
    ramenDiv.append(oneDiv)
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

function handleRamenDelete(ramenDiv) {
    fetch(`${API}/${ramenDiv.dataset.id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(emptyObj => {
        ramenDiv.remove()
    })
}

// handle ramen image click 
ramenDiv.addEventListener("click", (e) => {
    if (e.target.matches("img")) {
        displayRamenDetails(e.target)
    } else if (e.target.matches("button")) {
        handleRamenDelete(e.target.closest('div.ramen-div'))
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

newRamenForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let {name, restaurant, image, rating} = e.target
    let newComment = e.target["new-comment"].value

    fetch(API, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accept: "application/json"
        },
        body: JSON.stringify({
            name: name.value,
            restaurant: restaurant.value,
            image: image.value,
            rating: rating.value,
            comment: newComment
        })
    })
    .then(resp => resp.json())
    .then(newRamen => {
        renderRamenObj(newRamen)
        e.target.reset()
    })
    
})