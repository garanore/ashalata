// eslint-disable-next-line no-unused-vars
import React from "react";
import NavBar from "./component/page/home/NavBar";
import { Outlet } from "react-router-dom";
import SideBar from "./component/page/home/SideBar";
import "/src/component/css/Outlet.css";
import "/src/component/css/SideBar.css";

function App() {
  return (
    <div className="">
      <header className="">
        <NavBar />
      </header>
      <div className=" d-flex flex-row">
        <aside className="me-2 ">
          <SideBar />
        </aside>

        <main className="Size">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
