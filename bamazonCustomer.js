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
          productList();
          break;

        case "View Low Inventory":
          inventoryLow();
          break;

        case "Add to Inventory":
          inventoryAdd();
          break;

        case "Add New Product":
          productNew();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}