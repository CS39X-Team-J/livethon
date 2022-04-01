import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const InstructorView = () => {
  const params = useParams();
  const location = useLocation();

  const [page, setPage] = useState(null);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  }

  useEffect(() => {
    const newPage = location.pathname.slice(location.pathname.lastIndexOf("/")+1, location.pathname.length);
    setPage(newPage)
  }, [location]);

  return (

    <div className="InstructorView">

      <h1>{params.session} / {page}</h1>

      <div>
        <button onClick={() => navigateTo("/instructor/session/create")}>New Session</button>
        <button onClick={() => navigateTo("tests")}>Tests</button>
        <button onClick={() => navigateTo("edit")}>Session Details</button>
        <button onClick={() => navigateTo("view")}>Students</button>
      </div>

      <Outlet />

    </div>
  );

};
