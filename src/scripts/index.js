import '../styles/index.scss';

console.log('webpack starterkit');

let table = document.getElementById('foodTable');
fetch('http://this-quantified-backend.herokuapp.com/api/v1/foods')
.then(response => response.json())
.then(result => {
  result.forEach(food => {
    let row = table.insertRow(0);
    let name = row.insertCell(0);
    let calories = row.insertCell(1);
    name.innerHTML = food.name;
    calories.innerHTML = food.calories;
  });
}).catch(error => {});
