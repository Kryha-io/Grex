import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

export default function configureStore(history) {
  return createStore(
    combineReducers({
      router: routerReducer,
      form: formReducer,
    }),
    applyMiddleware(
      thunk,
      routerMiddleware(history),
    ),
  );
}
