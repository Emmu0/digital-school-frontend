import React, { useState, useEffect } from "react";

import { Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "../template/custom.css"; //Added By Pathan
import schoolApi from "../../../api/schoolApi";



import { PATHS } from "../../../constants/WebRouting";
import authApi from "../../../api/authApi";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [moduleRecords, setModuleRecords] = useState([]);
  const [permissions, setPermissions] = useState();
  const location = useLocation();
  const Navigate = useNavigate();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("token")) {
        let user = jwt_decode(sessionStorage.getItem("token"));
        setUserInfo(user);

        var perm = user.permissions
          .map(function (obj) {
            return obj.name;
          })
          .join(";");
        setPermissions(perm);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //Added by Shakib : for dynamic modules
  useEffect(() => {
    fetchAllModules();
  }, []);

  async function fetchAllModules() {
    if(authApi?.companyDetail()?.companyid){
      const result = await schoolApi.getAllModules(authApi.companyDetail().companyid);
    // console.log("result module ======>", result);
    if (result !== "No Data Found") {
      result?.forEach((element) => {
        if (element.parent_module == null) {

          let subModule = [];
          result.forEach((res) => {
            if (res.parent_module === element.id) {
              subModule.push(res);
            }
            element.subModule = subModule;
          });
        }
      });

      setModuleRecords(result);
    } else {
      setModuleRecords([]);
    }
    }
    
  }

  const toggleSidebar = () => {

    if (sidebar === false) {
      setSidebar(true);

      document.querySelector("#sidebar").classList.toggle("active");
    } else {
      setSidebar(false);

      document.querySelector("#sidebar").classList.toggle("active");
    }
  };

  return (
    <>
      <nav id="sidebar" className="sidebar card py-2 mb-4">


        <div
          className="sidebar-header text-center"
          style={{ paddingLeft: "0", paddingRight: "0", paddingTop: "10px" }}
        >
          <div className="pb-1">
            <img
              src="/sansriti_logo.png"
              style={{ width: "230px", height: "160px" }}
              alt=""
              title="Sanskriti The School"
              onClick={() => { Navigate('/') }}
            />
          </div>
        </div>

        {/* Tabs List */}
        <ul
          className="nav flex-column list-unstyled components "
          id="tabs_navigation"
          style={{ fontWeight: "bold", borderTop: "1px solid #ddd" }}
        >
          {moduleRecords.map((singleModule) => (
            <>
              {singleModule && singleModule?.parent_module === null && singleModule.status !== "Inactive" && (
                <li>
                  <a
                    href={`#${singleModule?.name?.replace(/\s+/g, '_')}menu`}
                    onClick={() => { singleModule.subModule?.length === 0 && Navigate(singleModule.url) }}
                    data-toggle="collapse"
                    aria-expanded="false"
                    className={singleModule.subModule?.length > 0 && "dropdown-toggle "}
                  >
                    <i className={singleModule.icon} aria-hidden="true"></i>
                    {singleModule.name}
                  </a>

                  {singleModule.subModule && singleModule.subModule.length > 0 && (
                    <ul className="collapse list-unstyled"
                      id={`${singleModule.name.replace(/\s+/g, '_')}menu`}
                    >
                      {singleModule.subModule.map((singleSubModule) => singleSubModule.status !== "Inactive" && (
                        <li
                          className={`${location.pathname.includes(singleSubModule.url)
                            ? "active"
                            : ""
                            }`}
                        >
                          <Link
                            to={singleSubModule.url}
                            onClick={toggleSidebar}
                          >
                            <div style={{ marginLeft: "20px" }}>
                              <i className={singleSubModule.icon}></i>
                              {singleSubModule.name}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;