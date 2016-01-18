import expect, { createSpy, spyOn, isSpy } from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import DeepFreeze from 'deep-freeze';

import { createStore, combineReducers } from 'redux';


// Store
/*
const store = createStore(counter);
*/

/*
// Implementation of createStore
const createStore = (reducer) =>  {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => {
      listener();
    });
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => {
        l !== listener
      });
    }
  };

  dispatch({});

  return { getState, dispatch, subscribe };
}
*/


// Reducer
// Accept current state and action, return next state.
/*
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
*/

// This is stateless component
// with ES6 destructuring assignment.
// You should you it whenever you can if you don't need
// this.state or React lifecycle methods.
/*
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
)
*/

// View
/*
const render = () => {
  ReactDOM.render(
    <Counter value={store.getState()}
      onIncrement={() =>
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={() =>
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
    document.getElementById('root')
  );
};

//store.subscribe(render);
//render();
*/


const addCounter = (list) => {
  // Spread list array in a array.
  return [...list, 0];
};

const removeCounter = (list, index) => {
  return [...list.slice(0, index), ...list.slice(index + 1)]
};

const incrementCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
}

const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {id: action.id, text: action.text, completed: false};
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      } else {
        return { ...state, completed: !state.completed };
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(state, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};



// This is hand writing version of conbining reducers.
/*
const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: (visibilityFilter(state.visibilityFilter, action))
  }
};
*/

/*
// Implementation of combineReducer from scratch
const combineReducers = (reducers) => {
  // Return value must be a function(another reducer) with multiple reducers.
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (prev, current) => {
        // prev is an object because initial value is given.
        // current is a key from reducers.
        prev[current] = reducers[current](state[current], action);
        return prev[current];
      },
      {} //initial value
    );
  };
};
*/

// Mearge reducers automatically
// *key has to be a property of state.
//   e.g. state.todos ====> { todos: todos }
// *value has to be a reducer.
// In addition, since key name is always same as value name,
// you can ommit value name thanks to ES6 object literal short hand.
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

/* Testing ------------------------------------- */

/*
const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  DeepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [10, 20, 30];
  const listAfter = [10, 30];

  DeepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
}

const testIncrementCounter = () => {
  const listBefore = [10, 20, 30];
  const listAfter = [10, 21, 30];

  DeepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
}

testAddCounter();
testRemoveCounter();
testIncrementCounter();

*/

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    id: 0,
    text: 'Learn Redux',
    type: 'ADD_TODO'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  DeepFreeze(stateBefore);
  DeepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
}

const testToggleTodo = () => {
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  const todoBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'React is awesome',
      completed: false
    }
  ];
  const todoAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'React is awesome',
      completed: true
    }
  ];

  DeepFreeze(todoBefore);
  DeepFreeze(action);

  expect(
    todos(todoBefore, action)
  ).toEqual(todoAfter);
};


testAddTodo();
testToggleTodo();
console.log("test passed!");


/* Logging ------------------------------------- */

console.log("Current state:");
console.log(store.getState());
console.log("--------------");

console.log("Dispatch ADD_TODO:");
store.dispatch({ type: "ADD_TODO", id: 0, text: "Learn Redux" });
console.log("Current state:");
console.log(store.getState());
console.log("--------------");

console.log("Dispatch ADD_TODO:");
store.dispatch({ type: "ADD_TODO", id: 1, text: "Learn React!" });
console.log("Current state:");
console.log(store.getState());
console.log("--------------");

console.log("Dispatch TOGGLE_TODO:");
store.dispatch({ type: "TOGGLE_TODO", id: 1 });
console.log("Current state:");
console.log(store.getState());
console.log("--------------");

console.log("Dispatch SET_VISBILITY_FILTER:");
store.dispatch({ type: "SET_VISBILITY_FILTER", filter: 'SHOW_COMPLETED' });
console.log("Current state:");
console.log(store.getState());
console.log("--------------");







