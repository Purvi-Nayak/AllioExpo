import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";

//local
import appTheme from "./localStates/appTheme";
import userData from "./localStates/userData";

//auth
import login from "./auth/login";

//app
import profile from "./app/profile";
// media slice (store media in the global reducer so selectors can read it)
import media from "../redux/slices/MediaSlice";

// combine reducer handler
const reducers = combineReducers({
  login,
  profile,
  appTheme,
  userData,
  media,
});
// root reducer to detect each and every reducer passed by
// handled logout reducer here and empty all the reducers and local storage
const rootReducer = (state: any, action: any) => {
  if (action.type === "logout") {
    AsyncStorage.clear(() => {});
  }
  return reducers(state, action);
};

export default rootReducer;
