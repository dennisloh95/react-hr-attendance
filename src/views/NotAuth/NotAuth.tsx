import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotAuth = () => {
  return (
    <div className="status-wrapper">
      403 NotAuth
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default NotAuth;
