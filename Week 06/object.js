class Human {
  hurt(damage) {
    console.log(`${damage} is hurt`);
  }
}

class Dog {
   bite(someWhere) {
     return someWhere;
   }
}

let p = new Human();
let dog = new Dog();

p.hurt(dog.bite("leg"));