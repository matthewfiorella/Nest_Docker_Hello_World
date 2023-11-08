import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from "react-bootstrap";

const Navbar = () => {
  const { isLoading, user, loginWithRedirect, logout, isAuthenticated  } = useAuth0();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand">
        Navbar
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
          <Link className="nav-link" to={"/"}> Home </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/postal"}> Postal Code Lookup </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/sqrt"}> Sqrt Calculator </Link>
          </li>
          <li className="nav-item">
            <Button onClick={() => loginWithRedirect()}> Login </Button>
          </li>
          <li className="nav-item">
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}> Logout </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;