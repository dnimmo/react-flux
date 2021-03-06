// Flux applications are built up as follows:
//
// [Action] > [Dispatcher] > [Store] > [View]
//   /\                                  \/
//    ------------------------------------
//
// "Views" are React components. Store is where all of work is done, and registers listen events
// on the dispatcher. The dispatcher will emit events to any store that is registered to listen to it.

var Dispatcher = require('flux').Dispatcher;
// Assign allows you to pass existing functionality into new object, like 'extend'
var assign = require('react/lib/Object.assign');

var AppDispatcher = assign(new Dispatcher(), {
  handleViewAction: function(action){
    console.log('action', action);
    // Dispatch method on the dispatcher
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  }
});

module.exports = AppDispatcher;