import React, { useEffect, createContext, useReducer, useContext } from "react";

import Navbar from "./components/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import { initialState, reducer } from "./reducers/userReducer";
import SubscribedUsersPosts from "./screens/SubscribedUsersPosts";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";
//
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/resetpassword"))
        history.push("/login");
    }
  }, [dispatch, history]);
  return (
    <Switch>
      <Route path="/" component={HomeScreen} exact />
      <Route path="/login" component={LoginScreen} />
      <Route path="/signup" component={SignupScreen} />
      <Route path="/profile" component={ProfileScreen} exact />
      <Route path="/create" component={CreatePostScreen} />
      <Route path="/profile/:userid" component={UserProfileScreen} />
      <Route path="/mysubscribedposts" component={SubscribedUsersPosts} />
      <Route path="/resetpassword" component={ResetPasswordScreen} exact />
      <Route path="/resetpassword/:token" component={NewPasswordScreen} />
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
