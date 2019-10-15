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
