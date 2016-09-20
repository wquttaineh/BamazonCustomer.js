// npm inquirer package 
var inquirer = require('inquirer');

// npm mysql package 
var mysql = require('mysql');

// connection host to mysql 
var connection = mysql.createConnection({
	host: 		'127.0.0.1',
	port:        8889, 
	user: 		'root',
	password: 	'root',
	database: 	'Bamazon'
});

var cost =0;
var total = 0;
var totalcount = 0;

// function to start application.
function pickId(){

	// mysql 
	connection.query('SELECT * FROM products', function(err, rows, fields){
		if (err) throw err;
		console.log('What would you like to buy?');

		for (var i = 0; i < rows.length; i++) {
			console.log('Id:' + rows[i].itemID + ' Product: ' + rows[i].ProdcutName + ', ' + ' Department: ' + rows[i].DepartmentName + ', ' + ' Price: $' + rows[i].Price + ', ' + ' Quantity: ' + rows[i].StockQuantity);	
		}
				inquirer.prompt([{
					type: 'input',
					name: 'itemById',
					message: 'Select ID # of the item you would like to buy!'

				}]).then(function(answer){
					var itemId = parseInt(answer.itemById)
					// console.log(id);

					for (var i = 0; i < rows.length; i++) {
						if(rows[i].itemID == answer.itemById){
							var row = rows[i]; 
							console.log('We have ' + row.StockQuantity + ' ' +row.ProdcutName + ' in stock, and its only $' + row.Price + ' per Item!');

							inquirer.prompt([{
								type: 'input',
								name: 'itemQuantity',
								message: 'How many ' + row.ProdcutName + ' would you like to buy?'

							}]).then(function(answer){
								var quantity = parseInt(answer.itemQuantity);
								
								if(quantity > row.StockQuantity){
									console.log('We dont have enough for now, we will restock soon!');
									inquirer.prompt([{
										type: 'confirm',
										name: 'shop',
										message: 'Would you like to buy anything else?'

									}]).then(function(answer){
										if(answer.shop){
											pickId();
										}else{
											console.log('Thank you for shopping, please come back again!')
											connection.end();
										}
									})

								}else{
									console.log("Here is your Total Bill");

									connection.query('UPDATE Products SET StockQuantity = StockQuantity - ? WHERE itemID = ?', [quantity, itemId], function(err, results){
										if (err) throw err;
									});
										// console.log('UPDATE Quantity');
									var cost = row.Price;
									var totalcount = cost * quantity;
									var tax = ((.65 / 10000) * 1000) * totalcount;
									var total = totalcount + tax;
									
									console.log('Total Count: ' + quantity + ' ' +row.ProdcutName + '  * ' + "'$" + cost + "'");
									console.log('Pice:  $' + totalcount);
									console.log('Tax @ 0.065%: $' + tax);
									console.log('your total balance is:  $' + total);

									inquirer.prompt([{
										type: 'confirm',
										name: 'shop',
										message: 'Would you like to buy anything else?'

									}]).then(function(answer){
										if(answer.shop){
											pickId();
										}else{
											console.log('Thank you for shopping, please come back again!')
											connection.end();
										}
									})
									
								}
							})
						}
					}
				})
			
	});
// 			
}
pickId();
