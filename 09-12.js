// 1
function isPrime(x) {
    for (let i = 2; i <= x ** 0.5; i++) {
        if (x % i == 0) {
            return false;
        }
    }
    return true;
}

for (let i = 2; i <= 20; i++) {
    console.log(`${i}: ${isPrime(i)}`);
}


// 2
function findMinMax(array) {
    return [Math.max(...array), Math.min(...array)];
}

let array = Array.from({length: 10}, () => Math.floor(Math.random() * 101));
console.log(array)
console.log(findMinMax(array));


// 3
let user = {
    name: 'Eugene',
    age: 24,
    email: 'eugene135@mail.ru',
    
    greet() { console.log(`Привет, ${user.name}!`) }
}

function displayUserInfo(user) {
    console.log(`Имя: ${user.name}, Возраст: ${user.age}, Email: ${user.email}`);
}

displayUserInfo(user);
user.greet();


// 4
let list = ["Анна", "Иван", "Мария", "Алексей", "Екатерина"];

for (let i = 0; i < list.length; i++) {
    console.log(`"Студент ${list[i]}, ваш порядковый номер: ${i}".`)
}

function findLongestName(array) {
    maxl = array[0].length;
    maxi = 0;
    for (let i = 1; i < list.length; i++) {
        if (array[i].length > maxl) {
            maxl = array[i].length;
            maxi = i;
        }
    }
    return array[maxi];
}

console.log(findLongestName(list));


// 5
function formatDate(curdate) {
    let day = curdate.getDay().toString().padStart(2, '0');
    let month = (curdate.getMonth()+1).toString().padStart(2, '0');
    let year = curdate.getFullYear().toString();
    let hours = curdate.getHours().toString().padStart(2, '0');
    let minutes = curdate.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

let today = new Date();
console.log(formatDate(today));


function daysDifference(date1, date2) {
  const dayInMs = 24 * 60 * 60 * 1000;
  let diffInMs = Math.abs(date2 - date1);
  return Math.floor(diffInMs / dayInMs);
}

let date1 = new Date('2024-09-01');
let date2 = new Date('2024-09-10');
console.log(daysDifference(date1, date2));