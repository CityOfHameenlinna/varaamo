import { compose, createStore } from 'redux';

import rootReducer from 'state/rootReducer';
import middleware from './middleware';

const finalCreateStore = compose(...middleware)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(
    rootReducer,
    initialState,
    compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('state/rootReducer', () => {
      const nextRootReducer = require('state/rootReducer'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
