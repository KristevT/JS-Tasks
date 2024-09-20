// #1
function sortArray(arr) {
    let n = arr.length;
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i <= n - 1; i++) {
        if (arr[i] > arr[i+1]) {
            let buff = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = buff;
            swapped = true;
        }
    }
    n--;
    } while (swapped);

    return arr;
}

let array = [1, 3, 2, 4, 7, 6, 5];
console.log(sortArray(array));

// #2

class GameCharacter {
    attack() {
        console.log('Персонаж атакует.');
    }
}

class Warrior extends GameCharacter {
    attack() {
        console.log("Воин атакует в ближнем бою.");
    }
}

class Mage extends GameCharacter {
    attack() {
        console.log("Волшебник атакует, используя магию.");
    }
}

class Archer extends GameCharacter {
    attack() {
        console.log("Лучник атакует на расстоянии.");
    }
}

let hero = new GameCharacter();
let warrior = new Warrior();
let mage = new Mage();
let archer = new Archer();

console.log('')
hero.attack();
warrior.attack();
mage.attack();
archer.attack();