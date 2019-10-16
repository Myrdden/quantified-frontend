import '../styles/index.scss';

console.log('webpack starterkit');

function toggleHide(id) {
  let elem = document.getElementById(id);
  if (elem.className.includes('hidden')) {
    elem.className = elem.className.replace(' hidden', '');
  } else {
    elem.className += ' hidden';
  }
}

function generateFoodEditForm() {
  let form = document.createElement('form');
  let nameInput = document.createElement('input');
  nameInput.name = 'Name';
  nameInput.type = 'text';
  let calorieInput = document.createElement('input');
  calorieInput.name = 'Calories';
  calorieInput.type = 'text';
  let submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = 'Edit';
  form.innerHTML = 'Name:<br>';
  form.appendChild(nameInput);
  form.innerHTML += '<br>Calories:<br>';
  form.appendChild(calorieInput);
  form.innerHTML += '<br>';
  form.appendChild(submitButton);

  let editDiv = document.createElement('div');
  editDiv.appendChild(form);
  return editDiv;
}

function editFood(id, form) {
  let formData = new FormData(form);
  let body = {'name': formData.get('Name'), 'calories': formData.get('Calories')};
  fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods/' + id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
}

let table = document.getElementById('food-table');
(async () => {
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods');
  let result = await response.json();

  result.forEach(food => {
    let row = table.insertRow(0);
    let name = row.insertCell(0);
    let calories = row.insertCell(1);
    name.innerHTML = food.name;
    name.className += 'foods-table-name';
    calories.innerHTML = food.calories;
    calories.className += 'foods-table-calories';
    let form = generateFoodEditForm();
    form.addEventListener('submit', event => {
      event.preventDefault();
      editFood(food.id, event.target);
    });
    name.appendChild(form);
  });
})();

(async () => {
  let parent = document.getElementById('meals-div');
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/meals');
  let result = await response.json();
  result.forEach(async meal => {
    let newDiv = document.createElement('div');
    let titleDiv = document.createElement('div');
    titleDiv.innerHTML = meal.name;
    titleDiv.className += 'title-div';
    newDiv.appendChild(titleDiv);
    newDiv.className += 'meal-div';

    let foodsTable = document.createElement('table');
    meal.Food.forEach(food => {
      let row = foodsTable.insertRow(0);
      let name = row.insertCell(0);
      let calories = row.insertCell(1);
      name.innerHTML = food.name;
      calories.innerHTML = food.calories;
    });
    foodsTable.id = 'meal-' + meal.id + '-foods';
    newDiv.appendChild(foodsTable);

    newDiv.id = 'meal-' + meal.id;
    newDiv.addEventListener('click', () => toggleHide('meal-' + meal.id + '-foods'));
    parent.appendChild(newDiv);
  });
})();

(async () => {
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/meals/most_popular_food');
  let result = await response.json();
  // console.log(result);
  let text = document.getElementById('most-food');
  text.innerHTML += ' ' + result.name + ' (' + result.calories + ')'
})();

(async () => {
  let form = document.getElementById('add-meal-form');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let body = {'name': formData.get('Name'), 'calories': formData.get('Calories')};
    console.log(body);
    let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    let result = await response.json();
    console.log(result);
  }, false);
})();
