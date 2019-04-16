var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "r00tr00t",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  runApp();
});
function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Products for Sale":
          inventoryList();
          break;

        case "View Low Inventory":
          inventoryLow();
          break;

        case "Add to Inventory":
          inventoryAdd();
          break;

        case "Add New Product":
          inventoryNew();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function inventoryList() {
  inquirer
    .prompt({
      name: "inventory",
      type: "list",
      message: "List of Available Products:",
      choices: [

      ]
    })
    .then(function (answer) {
      var query = "SELECT * FROM bamazon";
      //(property) Connection.query: QueryFunction
      //(options: string | QueryOptions, callback?: queryCallback) => Query (+2 overloads)
      connection.query(query, { inventory: answer.inventory }, function (error, response) {
        for (var i = 0; i < response.length; i++) {
        }
        runApp();
      });
    });
}
function inventoryLow() {

}
function inventoryAdd() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Which item needs to be restocked?"
      },
      {
        name: "stock",
        type: "input",
        message: "How much of this item are you into the inventory?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          stock_quantity: stock_quantity + answer.stock 
        },
        function (error) {
          if (error) throw err;
          console.log("===============================================================\nThe stock of your item was successfully updated!!\n===============================================================")
          runApp();
        }
      )
    })
}
function inventoryNew() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What item would you like to add to the list of inventory?"
      },
      {
        name: "department",
        type: "input",
        message: "What department does this item belong to?"
      },
      {
        name: "price",
        type: "input",
        message: "How much does this item cost?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stock",
        type: "input",
        message: "How much of this item are you into the inventory?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.stock
        },
        function (error) {
          if (error) throw err;
          console.log("===============================================================\nYour item was successfully added to the current list inventory!\n===============================================================")
          runApp();
        }
      )
    })
}