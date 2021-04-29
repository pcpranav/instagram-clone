import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
//
const Navbar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li key={1}>
          <Link to="/profile">Profile</Link>
        </li>,
        <li key={2}>
          <Link to="/create">Create Post</Link>
        </li>,
        <li key={6}>
          <Link to="/mysubscribedposts">Subscribed Posts</Link>
        </li>,

        <li key={3}>
          <button
            className="btn #c62828 red darken-2"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("jwt");
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={4}>
          <Link to="/login">Login</Link>
        </li>,
        <li key={5}>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo  left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
