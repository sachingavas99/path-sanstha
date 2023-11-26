import { createStore, combineReducers } from "redux";
import foodReducer from "./reducer/userReducer";

const rootReducer = combineReducers({
  userData: foodReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
