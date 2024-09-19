// 1. Управление пользователями и администраторами
// Условие:
// Создайте класс User, который имеет следующие свойства:
// name — имя пользователя.
// email — email пользователя.
// role — роль пользователя (по умолчанию user).

// Добавьте методы:
// login(), который выводит сообщение "Пользователь [name] вошел в систему".
// logout(), который выводит сообщение "Пользователь [name] вышел из системы".

// Создайте класс Admin, который наследует User и добавляет следующие методы:
// deleteUser(user), который выводит сообщение "Пользователь [name] был удален администратором [admin_name]".
// Создайте несколько объектов классов User и Admin.

// Ожидаемый результат:
// Объект класса User может логиниться и выходить из системы.
// Объект класса Admin может удалять пользователей и выполнять те же действия, что и обычный пользователь.

class User {
    constructor(name, email, role){
    this.name = name;
    this.email = email;
    this.role = role;
    }
    login() {
    console.log(`User ${this.name} has entered the system.`);
    return this;
    }
    logout() {
    console.log(`User ${this.name} has left.`);
    return this;
    }
}

class Admin extends User {
    constructor(name, email, role){
        super(name, email, role);
    }
    deleteUser(user){
        console.log(`${user.name} has been deleted`);
    }
}

console.log('#1')
let userOne = new User('Tom', 'test@mail.ru', 'user');
let userTwo = new User('Jerry', 'ww@gmail.com', 'user');
let admin = new Admin('Json Statham', 'hhh', 'admin');

userOne.login().logout();
userTwo.login().logout();
admin.login().logout();
admin.deleteUser(userOne);
console.log(userOne);
console.log('\n')


// 2. Кассовый аппарат
// Условие:
// Создайте класс Product, который будет представлять товар с характеристиками:
// name — название товара.
// price — цена товара.

// Создайте класс ShoppingCart, который будет представлять корзину покупок. Этот класс должен иметь следующие методы:
// addProduct(product, quantity) — добавляет товар в корзину.
// removeProduct(product) — удаляет товар из корзины.
// getTotalPrice() — возвращает общую стоимость всех товаров в корзине.
// checkout() — выводит список всех товаров и общую сумму к оплате, затем очищает корзину.

// Создайте несколько объектов класса Product, добавьте их в корзину и рассчитайте итоговую сумму покупок.

// Ожидаемый результат:
// Можно добавлять и удалять товары из корзины.
// Корзина корректно рассчитывает общую стоимость товаров.
// Метод checkout() выводит итоговый список покупок и очищает корзину.

function Product(name, price){
    this.name = name;
    this.price = price;
}

function ShoppingCart(){
    this.products = [];
}

ShoppingCart.prototype.addProduct = function(pr) {
    this.products.push(pr);
}

ShoppingCart.prototype.removeProduct = function(pr) {
    index = this.products.indexOf(pr);
    this.products.splice(index, 1);
}

ShoppingCart.prototype.getTotalPrice = function() {
    let sum = 0;
    for (let i = 0; i < this.products.length; i++) {
        sum += this.products[i].price;
    };
    return sum;
}

ShoppingCart.prototype.checkout = function() {
    console.log(`Total price is ${this.getTotalPrice()}`)
    console.log('Products are:')
    for (let i = 0; i < this.products.length; i++) {
        console.log(this.products[i].name)
    };
    this.products = [];
}

console.log('#2')
let pr1 = new Product('apple', 100);
let pr2 = new Product('banana', 50);
let pr3 = new Product('orange', 70);
let cart = new ShoppingCart();
cart.addProduct(pr1);
cart.addProduct(pr2);
cart.addProduct(pr3);
console.log(cart.getTotalPrice());
cart.checkout();
console.log('\n')


// 3. Библиотека
// Условие:
// Создайте класс Book, который будет представлять книгу с такими свойствами:
// title — название книги.
// author — автор книги.
// pages — количество страниц.

// Создайте класс Library, который управляет коллекцией книг. Этот класс должен иметь следующие методы:
// addBook(book) — добавляет книгу в библиотеку.
// findBooksByAuthor(author) — возвращает все книги данного автора.
// listAllBooks() — выводит список всех книг в библиотеке.

// Создайте класс LibraryUser, который может:
// Брать книгу на время (borrowBook(book)).
// Возвращать книгу в библиотеку (returnBook(book)).
// Каждый пользователь может одновременно иметь не более 3 книг. Если он пытается взять больше — программа должна выдавать ошибку.

// Ожидаемый результат:
// Пользователь может брать книги из библиотеки и возвращать их.
// Можно искать книги по автору и выводить список всех доступных книг.
// Ограничение на количество взятых книг работает корректно.


class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }
}

class Library {
    constructor() {
        this.books = []
    }

    addBook(book) {
        this.books.push(book);
    }

    findBooksByAuthor(author) {
        console.log(`Books by ${author}:`)
        this.books.filter(book => book.author === author).forEach(book => (console.log(`"${book.title}" | ${book.author} | [${book.pages} pages]`)))
        return this.books.filter(book => book.author === author);
    }

    listAllBooks() {
        console.log(`List of this Library's books:`)
        this.books.forEach(book => (console.log(`"${book.title}" | ${book.author} | [${book.pages} pages]`)))
    }
}

class LibraryUser {
    constructor(name) {
        this.name = name;
        this.borrowedBooks = [];
    }

    borrowBook(book) {
        if (this.borrowedBooks.length < 3) {
            this.borrowedBooks.push(book);
            console.log(`User ${this.name} borrowed "${book.title}"`);
        } else {
            console.log(`User ${this.name} has reached their limit (3 books)`);
        }
    }

    returnBook(book) {
        const index = this.borrowedBooks.indexOf(book);
        if (index !== -1) {
            this.borrowedBooks.splice(index, 1);
            book.isBorrowed = false;
            console.log(`${this.name} has returned "${book.title}".`);
        } else {
            console.log(`${this.name} doesn't have "${book.title}".`);
        }
    }
}

console.log('#3')
let book1 = new Book('Горе от ума', 'А. С. Грибоедов', 241);
let book2 = new Book('Герой нашего времени', 'М. Ю. Лермонтов', 224);
let book3 = new Book('Кавказский пленник', 'М. Ю. Лермонтов', 164);
let book4 = new Book('Преступление и наказание', 'Ф. М. Достоевский', 672);
let library = new Library();
library.addBook(book1);
library.addBook(book2);
library.addBook(book3);
library.addBook(book4);
library.listAllBooks();
console.log('')
library.findBooksByAuthor('М. Ю. Лермонтов');
console.log('')

let vasya = new LibraryUser('Вася');
vasya.borrowBook(book1);
vasya.borrowBook(book2);
vasya.borrowBook(book3);
vasya.borrowBook(book4);

console.log(vasya.borrowedBooks);
vasya.returnBook(book1);
console.log('\n')


// 4. Задача: Система онлайн-заказов
// Условие:
// Создайте классы для системы онлайн-заказов:
// Customer — представляет покупателя с именем и email.
// Order — представляет заказ и содержит:
// Список товаров (объекты класса Product).
// Сумму заказа.
// Покупателя, оформившего заказ (объект класса Customer).

// Создайте класс Product, который имеет свойства:
// name — название товара.
// price — цена товара.

// Класс Order должен иметь методы:
// addProduct(product, quantity) — добавляет товар в заказ.
// calculateTotal() — рассчитывает итоговую сумму заказа.
// printOrder() — выводит информацию о заказе: покупатель, товары, общая стоимость.
// Создайте несколько покупателей, товары, оформите несколько заказов и выведите информацию о каждом заказе.

class Customer {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

// class Product {
//     constructor(name, price) {
//         this.name = name;
//         this.price = price;
//     }
// }

class Order {
    constructor(customer) {
        this.customer = customer;
        this.products = [];
        this.cost = 0;   
    }

    addProduct(product, quantity) {
        this.products.push({product, quantity});
    }

    calculateTotal() {
        this.cost = this.products.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);
        return this.cost;
    }

    printOrder() {
        console.log(`Order for: ${this.customer.name} (${this.customer.email})`);
        console.log("Products:");
        this.products.forEach(item => {
            console.log(`${item.quantity} X ${item.product.name}: ${item.product.price} = ${item.product.price * item.quantity}$`);
        });
        console.log(`Total cost: ${this.calculateTotal()}$`);
    }
}

console.log('#4')
let carl = new Customer('Carl', 'cj@gmail.com');
let melvin = new Customer('Melvin', 'bigsmoke@gmail.com');
let prod1 = new Product('Number 6', 1.00);
let prod2 = new Product('Number 7', 1.50);
let prod3 = new Product('Number 9', 2.00);
let prod4 = new Product('Number 45', 2.50);
let prod5 = new Product('Large Soda', 0.75);
let order = new Order(melvin);
let order2 = new Order(carl);

order.addProduct(prod3, 3);
order.addProduct(prod1, 1);
order.addProduct(prod2, 1);
order.addProduct(prod4, 2);
order.addProduct(prod5, 1);
order.calculateTotal();
order.printOrder();
console.log('')

order2.addProduct(prod3, 1);
order2.calculateTotal();
order2.printOrder();
console.log('\n')

// 5. Иерархия домашних животных
// Условие:
// Создайте абстрактный класс Pet, который будет представлять домашнее животное с методами:
// eat() — выводит сообщение "Животное ест".
// makeSound() — метод, который должен быть переопределен в классах-наследниках.
// Создайте классы Dog и Cat, которые наследуют Pet.

// Переопределите метод makeSound() для каждого класса:
// Для Dog — выводит "Собака лает".
// Для Cat — выводит "Кошка мяукает".
// Добавьте метод sleep() для каждого питомца, который выводит сообщение о том, что питомец спит.

// Создайте объекты для каждого класса и вызовите методы eat(), makeSound() и sleep().

// Ожидаемый результат:
// Объекты классов Dog и Cat корректно переопределяют метод makeSound().
// Методы eat() и sleep() работают для каждого питомца.

class Pet {
    eat() {
        console.log('The pet is eating');
    }

    makeSound() {
        throw new Error("Redefine this method in the subclass.");
    }

    sleep() {
        console.log('The pet is sleeping');
    }
}

class Dog extends Pet {
    makeSound() {
        console.log("The dog barks.");
    }
}

class Cat extends Pet {
    makeSound() {
        console.log("The cat meows.");
    }
}

console.log('#5')
let dog = new Dog();
let cat = new Cat();
let parrot = new Pet();

parrot.eat();
parrot.sleep();
dog.makeSound();
cat.makeSound();
console.log('\n')


// 6. Математические выражения
// Условие:
// Создайте класс Expression, представляющий математическое выражение с двумя числами и операцией (например, сложение или умножение). Этот класс должен содержать методы:
// evaluate() — возвращает результат выражения.
// toString() — возвращает строковое представление выражения, например, "3 + 5 = 8".

// Создайте подклассы для различных математических операций:
// Addition для сложения.
// Subtraction для вычитания.
// Multiplication для умножения.
// Division для деления (с проверкой деления на ноль).
// Создайте несколько объектов выражений и выведите результаты их вычислений.

// Ожидаемый результат:
// Каждый объект правильно вычисляет математическое выражение.
// Метод toString() корректно выводит информацию в формате "a op b = result".

class Expression {
    constructor(a, b) {
        this.a = a;
        this.b = b; 
    }

    evaluate() {
        throw new Error("Redefine this method in the subclass.");
    }

    toString() {
        return `${a} ? ${b} = ${this.evaluate()}`;
    }
}

class Addition extends Expression {
    constructor(a, b) {
        super(a, b);
    }

    evaluate() {
        return this.a + this.b;
    }

    toString() {
        return `${this.a} + ${this.b} = ${this.evaluate()}`;
    }
}

class Subtraction extends Expression {
    constructor(a, b) {
        super(a, b);
    }

    evaluate() {
        return this.a - this.b;
    }

    toString() {
        return `${this.a} - ${this.b} = ${this.evaluate()}`;
    }
}

class Multiplication extends Expression {
    constructor(a, b) {
        super(a, b);
    }

    evaluate() {
        return this.a * this.b;
    }

    toString() {
        return `${this.a} * ${this.b} = ${this.evaluate()}`;
    }
}

class Division extends Expression {
    constructor(a, b) {
        super(a, b);
    }

    evaluate() {
        if (this.b === 0) {
            throw new Error("Error: Can't divide by zero.");
        }
        return this.a / this.b;
    }

    toString() {
        if (this.b === 0) {
            return `${this.a} / ${this.b} = Error: Can't divide by zero.`;
        }
        return `${this.a} / ${this.b} = ${this.evaluate()}`;
    }
}

console.log('#6')
let add = new Addition(1, 2);
let sub = new Subtraction(5, 2);
let mul = new Multiplication(2, 2);
let div = new Division(6, 3);

console.log(add.toString());
console.log(sub.toString());
console.log(mul.toString());
console.log(div.toString());

try {
    let divByZero = new Division(3, 0);
    console.log(divByZero.toString());
} catch (error) {
    console.error(error.message);
}