import expect, { createSpy, spyOn, isSpy } from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import DeepFreeze from 'deep-freeze';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';




/* Action Creator ------------------------------------- */

let nextTodoId = 0;
const addTodo = (text) => {
  return { type: 'ADD_TODO', text, id: nextTodoId++ };
};

const setVisibilityFilter = (filter) => {
  return { type: 'SET_VISBILITY_FILTER', filter };
};

const toggleTodo = (id) => {
  return {type: 'TOGGLE_TODO', id};
};




/* Reducer ------------------------------------- */

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


// Mearge reducers automatically
const todoApp = combineReducers({
  todos,
  visibilityFilter
});




/* Helper ------------------------------------- */

const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(todo => todo.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(todo => !todo.completed);
  }
}



/* Component ------------------------------------- */



/*
Todo
*/
// Presentational component
const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}>
    {text}
  </li>
);



/*
TodoList
*/

// Presentational component
let TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    )}
  </ul>
);
// Mappers
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id)  => {
      dispatch(toggleTodo(id));
    }
  };
};
// Create Container Component using connect function.
TodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);



/*
AddTodo
*/

let AddTodo = ({ dispatch }) => {
  let input; // local variable
  return (
    <div>
      <input type="text" ref={node => {input = node;}} />
      <button onClick={() => {
        if (input.value) {
          dispatch(addTodo(input.value));
        }
        input.value = "";
      }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

// Same as...
/*
let nextTodoId = 0;
const mapDispatchToAddTodoProps = (dispatch) => {
  return {
    onAddTodoClick: (input) => {
      if (input.value) {
        dispatch({ type: 'ADD_TODO', text: input.value, id: nextTodoId++ });
        input.value = "";
      }
    }
  };
};
let AddTodo = ({ onAddTodoClick }) => {
  let input; // local variable
  return (
    <div>
      <input type="text" ref={node => {input = node;}} />
      <button onClick={() => { onAddTodoClick(input) }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect(null, mapDispatchToAddTodoProps)(AddTodo);
*/



/*
Filters
*/

// props will passed as second argument.
const mapStateToFilterLinkProps = (state, ownProps) => {
  return {
    active: state.visibilityFilter === ownProps.filter,
  }
};
const mapDispatchToFliterLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};
// Presentational component
const Link = ({active, children, onClick}) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a href="#" onClick={e => {
      e.preventDefault();
      onClick();
    }}>
      {children}
    </a>
  )
};
const FilterLink = connect(
  mapStateToFilterLinkProps,
  mapDispatchToFliterLinkProps
)(Link);


// Presentational component
const Filters = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter="SHOW_ALL">
      All
    </FilterLink>
    {' '}
    <FilterLink filter="SHOW_COMPLETED">
      Complete
    </FilterLink>
    {' '}
    <FilterLink filter="SHOW_ACTIVE">
      Active
    </FilterLink>
  </p>
);



/* Render ------------------------------------- */

/*
App
*/

// Presentational component
const TodoApp = () => (
  <div>
    <AddTodo />
    <TodoList />
    <Filters />
  </div>
);

// Pass store globally by context
ReactDOM.render(
  <Provider store={createStore(todoApp)} >
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);

