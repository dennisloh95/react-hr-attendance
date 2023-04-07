import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotServer = () => {
  return (
    <div className="status-wrapper">
      500 NotServer
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default NotServer;
