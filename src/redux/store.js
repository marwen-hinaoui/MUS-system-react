import { configureStore } from '@reduxjs/toolkit';
import appSlices from '../redux/slices';

export default configureStore({
  reducer: {
    app: appSlices,

  }
});