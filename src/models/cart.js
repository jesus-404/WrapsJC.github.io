module.exports = function Cart(prevCart) {
    this.items = prevCart.items || {};
    this.totalQuantity = prevCart.totalQuantity || 0;
    this.totalPrice = prevCart.totalPrice || 0;
    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQuantity++;
        this.totalPrice += storedItem.item.price;
    };

    this.toArray = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};