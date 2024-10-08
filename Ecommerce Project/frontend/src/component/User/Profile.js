import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {user ? (
            <Fragment>
              <MetaData title={`${user.name}'s Profile`} />
              <div className="profileContainer">
                <div>
                  <h1>My Profile</h1>
                  <img src={user.avatar?.url} alt={user.name} />
                  <Link to="/me/update">Edit Profile</Link>
                </div>
                <div>
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0, 10)}</p>
                  </div>

                  <div>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <p>User data is unavailable. Please try reloading the page.</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
