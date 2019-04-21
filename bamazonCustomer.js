var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var colors = require("colors");
var { table } = require("table");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
connection.connect(function (err) {
  if (err) throw err;
  figlet('Bamazon Manager App', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log("==============================================================================================================\n" + data + "\n==============================================================================================================");
    runApp();
  });
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
  //(property) Connection.query: QueryFunction
  //(options: string | QueryOptions, callback?: queryCallback) => Query (+2 overloads)
  connection.query("SELECT * FROM bamazon.products", function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    const header = ['ID', 'Name', 'Department', 'Price(USD)', 'Stock Quanity'];
    const data = [header.map(s => s.green)];
    for (let i = 0; i < res.length; i++) {
      const row = res[i];
      data.push([row.item_id.toString().yellow, row.product_name, row.department_name, row.price, row.stock_quantity]);
    }
    console.log('\n' + table(data));
    runApp();
  });
};
function inventoryLow() {
  //console log data in table where products.stock_quantity is < 5.
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    const header = ['ID', 'Name', 'Department', 'Price(USD)', 'Stock Quanity'];
    const data = [header.map(s => s.red)];
    for (let i = 0; i < res.length; i++) {
      const row = res[i];
      data.push([row.item_id.toString().yellow, row.product_name, row.department_name, row.price, row.stock_quantity]);
    }
    console.log('\n' + table(data));
    runApp();
  });
};
function inventoryAdd() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "Item ID of the item that is being restocked?"
        },
        {
          name: "stock",
          type: "input",
          message: "How much of this item are you adding into the inventory?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        var updateQuantity = (parseInt(results[answer.item].stock_quantity) + parseInt(answer.stock));
        if (i = answer.item - 1) {
          connection.query("UPDATE products SET ? WHERE ?",
            [{
              stock_quantity: updateQuantity
            }, {
              item_id: answer.item
            }],
            function (error, result) {
              if (error) throw err;
              console.log("inventory sucessfully updated!")
              //inventoryList()
              runApp();
            });
        };
      });
  });
};





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
          console.log("Your item was successfully added to the current list inventory!")
          runApp();
        }
      );
    });
};




