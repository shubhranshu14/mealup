let btn_generate = document.querySelector("#generate");
let hgt = document.querySelector("#height");
let wgt = document.querySelector("#weight");
let ag = document.querySelector("#age");
let gender = document.querySelector("#gender");
let Activity = document.querySelector("#activity");
let display = document.querySelector(".meal-container");
let overlay = document.querySelector(".overlay");
let recipe = document.querySelector("#recipe-container");
let recipeStep = document.querySelector(".recipe-step");
let ingre = document.querySelector("#ingredient-container");
let ingreStep = document.querySelector(".ingre-step");
let ingrebtn = document.querySelector("#ingri_btn");
let recipebtn = document.querySelector("#recipe_btn");
let close = document.querySelectorAll(".fa");
let API_KEY = "af4157c25f4a48c9b9a5c580ddd06ebf";
let bmr;

const showData = () => {
  if (gender.value === "Female") {
    bmr =
      655.1 +
      9.563 * Number(wgt.value) +
      1.85 * Number(hgt.value) -
      4.676 * Number(ag.value);
  } else if (gender.value === "Male") {
    bmr =
      66.47 +
      13.75 * Number(wgt.value) +
      5.003 * Number(hgt.value) -
      6.755 * Number(ag.value);
  }

  if (Activity.value === "Light") {
    bmr = bmr * 1.375;
  } else if (Activity.value === "Medium") {
    bmr = bmr * 1.55;
  } else if (Activity.value === "High") {
    bmr = bmr * 1.725;
  }

  if (hgt.value == "" || wgt.value == "" || ag.value == "") {
    alert("Please fill the detail.");
    return;
  }
  generate_meal_cart(bmr);
};

ingrebtn.addEventListener("click", function () {
  if (ingre.classList.contains("hidden")) {
    recipe.classList.add("hidden");
    ingre.classList.remove("hidden");
  }
});
recipebtn.addEventListener("click", function () {
  if (recipe.classList.contains("hidden")) {
    recipe.classList.remove("hidden");
    ingre.classList.add("hidden");
  }
});
async function shu(id) {
  let information = "";
  let ingredients = "";
  let url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let res;
  if (overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    recipe.classList.remove("hidden");
    document.body.classList.add("noscroll");
  }
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      res = data;
    });

  res.analyzedInstructions[0].steps.map((eve) => {
    console.log(eve);
    information += `
      <li>${eve.step}</li>
    `;
    recipeStep.innerHTML = information;
  });
  res.extendedIngredients.map((eve) => {
    console.log(eve);
    ingredients += `
      <li>${eve.name}</li>`;

    ingreStep.innerHTML = ingredients;
  });
}
close.forEach((close_btn) => {
  close_btn.addEventListener("click", function () {
    if (!overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");
      recipe.classList.add("hidden");
      ingre.classList.add("hidden");
      document.body.classList.remove("noscroll");
    }
  });
});

async function generate_meal_cart(bmr) {
  let result;
  let html = "";
  await fetch(
    `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${bmr}&apiKey=${API_KEY}&includeNutrition=true`
  )
    .then((res) => res.json())
    .then((data) => {
      result = data;
    });
  let mealTime = ["BREAKFAST", "LUNCH", "DINNER"];
  let t = 0;

  result.meals.map(async (p) => {
    let url = `https://api.spoonacular.com/recipes/${p.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });

    html += `
          <div class="meal-box">
          <h2>${mealTime[t++]}</h2>
          <div class="meal-card">
            <div class="meal-img">
              <img src=${imgURL} alt="" />
            </div>
            <div class="meal-details">
              <h4>${p.title}</h4>
              <p>Calories: ${bmr.toFixed(2)}</p>
            </div>
            <button id="recipe" onclick="shu(${p.id})" >Get recipe</button>
          </div>
        </div>`;
    display.innerHTML = html;
    display.style.backgroundImage = "url('img/bg.jpg')";
  });
}
btn_generate.addEventListener("click", showData);
