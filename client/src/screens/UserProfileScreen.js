import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
//
const UserProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(true);
  //
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/user/${userid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setShowFollow(state && !state.following.includes(userid));
  }, [state, userid]);
  //
  const followUser = async () => {
    const response = await fetch("/api/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        followId: userid,
      }),
    });
    const data = await response.json();
    dispatch({
      type: "UPDATE",
      payload: { following: data.following, followers: data.followers },
    });
    localStorage.setItem("user", JSON.stringify(data));
    setProfile((prevState) => {
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: [...prevState.user.followers, data._id],
        },
      };
    });
    setShowFollow(false);
  };
  //
  const unfollowUser = async () => {
    const response = await fetch("/api/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    });
    const data = await response.json();
    dispatch({
      type: "UPDATE",
      payload: { following: data.following, followers: data.followers },
    });
    localStorage.setItem("user", JSON.stringify(data));
    setProfile((prevState) => {
      const newFollower = prevState.user.followers.filter(
        (item) => item !== data._id
      );
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: newFollower,
        },
      };
    });
    setShowFollow(true);
  };
  return (
    <>
      {profile ? (
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "1rem 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "10rem",
                  height: "10rem",
                  borderRadius: "5rem",
                }}
                src={profile.user.pic}
                alt="profile"
              />
            </div>
            <div>
              <h4>{profile.user.name}</h4>
              <h4>{profile.user.image}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{profile.posts.length} posts</h6>
                <h6>{profile.user.followers.length} followers</h6>
                <h6>{profile.user.following.length} following</h6>
                {showFollow ? (
                  <button
                    className="btn  #64b5f6 blue darken"
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn  #64b5f6 blue darken"
                    onClick={() => unfollowUser()}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {profile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.image}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
};

export default UserProfileScreen;
