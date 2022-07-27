import React from 'react';
import CustomRouter from './src/components/CustomRouter';

import { Provider } from 'react-redux';
import store from './src/constants/store';

export default function App() {
  return (
    <Provider store={store}>
      <CustomRouter />
    </Provider>
  );
};