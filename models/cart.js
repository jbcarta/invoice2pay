var numeral = require('numeral');

module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;
	this.totalQtyStr = numeral(oldCart.totalQty).format('(0,0.00)'); 
	this.totalPriceStr = numeral(oldCart.totalPrice).format('(0,0.00)');

	this.add = function(item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price;
		storedItem.totprod = storedItem.item.price * storedItem.qty;
		storedItem.qtyStr = numeral(storedItem.qty).format('(0,0.00)');		
		storedItem.priceStr = numeral(storedItem.price).format('(0,0.00)');
		storedItem.totprodStr = numeral(storedItem.totprod).format('(0,0.00)');		

		this.totalQty++;
		this.totalPrice += storedItem.item.price;
		this.totalQtyStr = numeral(this.totalQty).format('(0,0.00)');
		this.totalPriceStr = numeral(this.totalPrice).format('(0,0.00)');		

	};

	this.less1 = function(item, id) {
		var storedItem = this.items[id];
		if (storedItem.qty > 1) {
			storedItem.qty--;
		}
		storedItem.totprod = storedItem.item.price * storedItem.qty;
		storedItem.qtyStr = numeral(storedItem.qty).format('(0,0.00)');		
		storedItem.priceStr = numeral(storedItem.price).format('(0,0.00)');
		storedItem.totprodStr = numeral(storedItem.totprod).format('(0,0.00)');		

		this.totalQty--;
		this.totalPrice -= storedItem.item.price;
		this.totalQtyStr = numeral(this.totalQty).format('(0,0.00)');
		this.totalPriceStr = numeral(this.totalPrice).format('(0,0.00)');		

	};


	this.generateArray = function() {
		var arr= [];
		for (var id in this.item) {
			arr.push.item[id];
		}
		return arr;
	}
};