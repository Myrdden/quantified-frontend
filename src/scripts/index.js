import '../styles/index.scss';

function onReady(f) {/in/.test(document.readyState) ? setTimeout(onReady, 9, f) : f();}
onReady(() => {
  prepareAnims();
  prepareForms();
  populateFoods();
  populateMeals();
});

function prepareAnims() {
  document.getElementById('left-panel-title').addEventListener('click', event => {
    document.getElementById('left-panel').classList.remove('collapsed-left');
    document.getElementById('right-panel').classList.add('collapsed-right');
    document.getElementById('right-panel-title').classList.remove('title-focused');
    document.getElementById('left-panel-title').classList.add('title-focused');
    document.getElementById('title-slide-bar').classList.remove('slide');
  });

  document.getElementById('right-panel-title').addEventListener('click', event => {
    document.getElementById('left-panel').classList.add('collapsed-left');
    document.getElementById('right-panel').classList.remove('collapsed-right');
    document.getElementById('left-panel-title').classList.remove('title-focused');
    document.getElementById('right-panel-title').classList.add('title-focused');
    document.getElementById('title-slide-bar').classList.add('slide');
  });

  document.getElementById('add-food-btn').addEventListener('click', event => {
    document.getElementById('add-food').classList.remove('slide-out');
  });

  document.getElementById('add-food-cancel').addEventListener('click', event => {
    document.getElementById('add-food').classList.add('slide-out');
  });
}

function prepareForms() {
  document.getElementById('add-food').addEventListener('submit', async event => {
    event.preventDefault();
    await addFood(event.target);
    populateFoods();
  });
}

async function populateFoods() {
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods');
  let result = await response.json();
  let leftColumn = document.getElementById('foods-left-column');
  leftColumn.innerHTML = '';
  let midColumn = document.getElementById('foods-mid-column');
  midColumn.innerHTML = '';
  let rightColumn = document.getElementById('foods-right-column');
  rightColumn.innerHTML = '';
  let i = 1;
  result.forEach(food => {
    if (i % 3 == 1) {
      i = 2;
      leftColumn.appendChild(newFoodCard(food.id, food.name, food.calories));
    } else if (i % 3 == 2) {
      midColumn.appendChild(newFoodCard(food.id, food.name, food.calories));
      i = 3;
    } else {
      rightColumn.appendChild(newFoodCard(food.id, food.name, food.calories));
      i = 1;
    }
  });
}

function newFoodCard(id, name, calories) {
  let card = document.createElement('div');
  card.id = 'food-' + id;
  card.className = 'card box-fit shadow';
  let title = document.createElement('div');
  title.className = 'title';
  title.innerHTML = name;
  let content = document.createElement('div');
  content.className = 'content';
  content.innerHTML = calories + ' calories.';
  card.appendChild(title);
  card.appendChild(content);
  let editButton = document.createElement('button');
  editButton.innerHTML = '/';
  editButton.id = 'food-edit-button-' + id;
  editButton.className = 'edit-button';
  editButton.addEventListener('click', event => {
    toggleEditFood(id);
  });
  let deleteButton = document.createElement('button');
  deleteButton.innerHTML = '-';
  deleteButton.id = 'food-delete-button-' + id;
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', async event => {
    await deleteFood(id);
    populateFoods();
  });
  card.appendChild(editButton);
  card.appendChild(deleteButton);

  let form = document.createElement('form');
  form.id = 'food-edit-form-' + id;
  form.className = 'edit-form hidden';
  form.innerHTML = 'Name:<br>';
  let nameField = document.createElement('input');
  nameField.name = 'name';
  nameField.type = 'text';
  nameField.className = 'edit-form-text edit-form-name';
  form.appendChild(nameField);
  form.innerHTML += '<br>Calories:<br>';
  let caloriesField = document.createElement('input');
  caloriesField.name = 'calories';
  caloriesField.type = 'text';
  caloriesField.className = 'edit-form-text edit-form-sub';
  form.appendChild(caloriesField);
  let submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = '✓';
  submitButton.className = 'submit-button';
  form.appendChild(submitButton);
  form.addEventListener('submit', event => {
    event.preventDefault();
    updateFood(id, event.target);
    toggleEditFood(id);
  });

  card.appendChild(form);
  return card;
}

function toggleEditFood(id) {
  let form = document.getElementById('food-edit-form-' + id);
  let button = document.getElementById('food-edit-button-' + id);
  if (form.classList.contains('hidden')) {
    form.classList.remove('hidden');
    button.innerHTML = 'X';
  } else {
    form.classList.add('hidden');
    button.innerHTML = '/';
  }
}

async function addFood(form) {
  let formData = new FormData(form);
  let body = {'name': formData.get('name'), 'calories': formData.get('calories')};
  await fetch('https://this-quantified-backend.herokuapp.com/api/v1/foods', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
}

async function updateFood(id, form) {
  let formData = new FormData(form);
  let card = document.getElementById('food-' + id);
  let oldTitle = card.querySelector('.title').innerHTML;
  let oldCalories = parseInt(card.querySelector('.content').innerHTML, 10);
  let body = {'name': formData.get('name') || oldTitle, 'calories': formData.get('calories') || oldCalories};
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods/' + id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  let result = await response.json();
  card.querySelector('.title').innerHTML = result.name;
  card.querySelector('.content').innerHTML = result.calories + ' calories.';
}

async function deleteFood(id) {
  await fetch('http://this-quantified-backed.herokuapp.com/api/v1/foods/' + id, {
    method: 'DELETE'
  });
}

async function populateMeals() {
  let response = await fetch('http://this-quantified-backend.herokuapp.com/api/v1/meals');
  let result = await response.json();
  let leftColumn = document.getElementById('meals-left-column');
  leftColumn.innerHTML = '';
  let midColumn = document.getElementById('meals-mid-column');
  midColumn.innerHTML = '';
  let rightColumn = document.getElementById('meals-right-column');
  rightColumn.innerHTML = '';
  let i = 1;
  result.forEach(meal => {
    if (i % 3 == 1) {
      i = 2;
      leftColumn.appendChild(newMealCard(meal.id, meal.name, meal.Food));
    } else if (i % 3 == 2) {
      midColumn.appendChild(newMealCard(meal.id, meal.name, meal.Food));
      i = 3;
    } else {
      rightColumn.appendChild(newMealCard(meal.id, meal.name, meal.Food));
      i = 1;
    }
  });
}

function newMealCard(id, name, foods) {
  let card = document.createElement('div');
  card.id = 'meal-' + id;
  card.className = 'card box-fit shadow';
  let title = document.createElement('div');
  title.className = 'title';
  title.innerHTML = name;
  card.appendChild(title);

  foods.forEach(food => {
    let item = document.createElement('div');
    item.className = 'sub-item content';
    item.innerHTML = food.name;
    let deleteItem = document.createElement('button');
    deleteItem.className = 'delete-button sub';
    deleteItem.innerHTML = '-';
    deleteItem.addEventListener('click', async event => {
      await deleteFoodItem(id, food.id);
      populateMeals();
    });
    item.appendChild(deleteItem);

    card.appendChild(item);
  });

  let hasFoods = foods.map(food => food.name);
  let allFoods = getAllFoods();
  let addForm = document.createElement('form');
  addForm.className = 'add-food-item-form';
  let selectFood = document.createElement('select');
  selectFood.name = 'name';
  selectFood.className = 'add-food-item-dropdown';
  allFoods.forEach(food => {
    if (!hasFoods.includes(food.name)) {
      let option = document.createElement('option');
      option.value = food.id;
      option.innerHTML = food.name;
      option.className = 'add-food-item-dropdown-option';
      selectFood.appendChild(option);
    }
  });
  addForm.appendChild(selectFood);
  let addButton = document.createElement('input');
  addButton.type = 'submit';
  addButton.value = '✓';
  addButton.className = 'submit-button sub';
  addForm.appendChild(addButton);
  addForm.addEventListener('submit', async event => {
    event.preventDefault();
    await addFoodItem(id, addForm);
    populateMeals();
  });
  card.appendChild(addForm);

  return card;
}

function getAllFoods() {
  let cards = Array.from(document.getElementById('left-panel').querySelectorAll('.card'));
  return cards.map(card => {
    return {
      id: parseInt(card.id.replace('food-','')),
      name: card.querySelector('.title').innerHTML
    }
  });
}

async function deleteFoodItem(mealId, foodId) {
  await fetch('http://this-quantified-backend.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodId, {
    method: 'DELETE'
  });
}

async function addFoodItem(mealId, form) {
  let formData = new FormData(form);
  let foodId = formData.get('name');
  await fetch('http://this-quantified-backend.herokuapp.com/api/v1/meals/' + mealId + '/foods/' + foodId, {
    method: 'POST'
  });
}
