import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const HomeMain = () => {
  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default HomeMain;
