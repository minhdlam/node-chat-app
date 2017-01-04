class Users {
  constructor () {
    this.users = []; //this refers to the class variable users
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user); //adding user to the array
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id); //finding all the ids that don't match the one above and creating a new array
    }
    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id )[0];
  }
  getUserList (room) {
    var users = this.users.filter((user) => { //this refers to the array of users from above
      return user.room === room; //returns true or false
    });
    var namesArray = users.map((user) => { //map takes a function and returns a value like name, id, or room
      return user.name;
    });
    return namesArray;
  }
}

module.exports = {
  Users
};
// class Person { example of ES6 class
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription () {
//     return `${this.name} is ${this.age} year(s) old.`
//   }
// }
//
// var me = new Person('Duc', 22);
// // console.log('this.name', me.name); same as this
// // console.log('this.age', me.age);
// var description = me.getUserDescription();
// console.log(description);
