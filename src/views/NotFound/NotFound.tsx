import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="status-wrapper">
      404 NotFound
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
