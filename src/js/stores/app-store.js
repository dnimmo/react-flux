var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var assign = require('react/lib/Object.assign'); // from React
var EventEmitter = require('events').EventEmitter; // from Node

// This will be broadcast whenever anything changes in the application
var CHANGE_EVENT = 'change';

var _catalogue = [];

for (var i=1; i<9; i++){
  _catalogue.push({
    'id' : 'Widget' + i,
    'title' : 'Widget #' + i,
    'summary' : 'This is a widget',
    'description' : 'Lorem ipsum dolor sit amet',
    'cost' : i
  });
}

var _cartItems = [];

function _removeItem(index){
  _cartItems[index].inCart = false;
  _cartItems.splice(index, 1);
}

function _increaseItem(index){
  _cartItems[index].quantity++;
}

function _decreaseItem(index){
  if(_cartItems[index].quantity < 1){
    // If there's more than one, decrease by one
    _cartItems[index].quantity-; 
  } else {
    // If there's only one, remove the item entirely
    _removeItem(index);
  }
}

function _addItem(item){
  if(!item.inCart){
    // If the item is not already in the user's cart, add it to the cart
    item['quantity'] = 1;
    item['inCart'] = true;
    _cartItems.push(item);
  } else {
    // Find the item in the user's cart
    _cartItems.forEach(function(cartItem, i){
      if(cartItem.id === item.id){
        // Increase the quantity of the item in the user's cart
        _increaseItem(i);
      }
    });
  }
}

function _cartTotals(){
  // Get the total quantity of the items in the cart, and the total cost of the cart itself
  var quantity = 0;
  var total = 0;
  _cartItems.forEach(function(cartItem){
    quantity += cartItem.quantity;
    total += cartItem.quantity*cartItem.cost;
  });
}

var AppStore = assign(EventEmitter.prototype, {
  emitChange : function(){
    this.emit(CHANGE_EVENT);
  },
  
  addChangeListener : function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  
  removeChangeListener : function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },
  
  getCart : function(){
    return _cartItems;
  },
  
  getCatalogue : function(){
    return _catalogue;
  },
  
  getCartTotals : function(){
    return _cartTotals();
  },
  
  dispatcherIndex : AppDispatcher.register(function(payload){
    var action = payload.action; // this is the action that's passed down from handleViewAction in ../dispatchers/app-dispatcher.js
    switch(action.actionType){
      // Determine which private method needs to be called: Add/Remove/Increase/Decrease
      case AppConstants.ADD_ITEM;
        _addItem(payload.action.item);
        break;
      
      case AppConstants.REMOVE_ITEM;
        _removeItem(payload.action.index);
        break;
        
      case AppConstants.INCREASE_ITEM;
        _increaseItem(payload.action.index);
        break;
        
      case AppConstants.DECREASE_ITEM;
        _decreaseItem(payload.action.index);
        break;
    }
    // Emit a message to state that something has been changed on every event
    AppStore.emitChange();
    // Return true so that the dispatcher will receive the resolved promise and can move on to the next action
    return true;
  });
});

