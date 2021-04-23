// import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

// import monitorReducersEnhancer from './enhancers/monitorReducers'
// import loggerMiddleware from './middleware/logger'
// import rootReducer from './reducers'

// export default function configureAppStore(preloadedState) {
//   const store = configureStore({
//     reducer: rootReducer,
//     middleware: [loggerMiddleware, ...getDefaultMiddleware()],
//     preloadedState,
//     enhancers: [monitorReducersEnhancer]
//   })

//   // if (process.env.NODE_ENV !== 'production' && module.hot) {
//   //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
//   // }

//   return store
// }

import { createStore } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store