import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
// import authApi from "../../components/Auth";
// import authApi from "../../components/Auth/Auth";
import jwt_decode from "jwt-decode";
import schoolApi from "../../../api/schoolApi";
import authApi from "../../../api/authApi";

const Header = (props) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  
  useEffect(() => {
    if (!sessionStorage.getItem("token")) navigate("/login");
    try {
      if (sessionStorage.getItem('token')) {
        let user = jwt_decode(sessionStorage.getItem('token'));
        setUserInfo(user);
      }
    } catch (error) {
      console.log(error)
    }
  }, []);

  const [All_launcher, setLauncherData] = useState(false)
  useEffect(() => {
    if (!All_launcher) {
      schoolApi.getAllQuickLauncher().then((result) => {
        if (result?.success) {
          setLauncherData(result.records);
        } else {
          setLauncherData([]);
        }
      })
    }
  }, [All_launcher]);

  const [sidebar, setSidebar] = useState(false);
  const logout = () => {
   // authApi.logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (sidebar === false) {
      setSidebar(true);
      console.log(sidebar);
      document.querySelector("#sidebar").classList.toggle("active");
    }

    else {
      setSidebar(false);
      console.log(sidebar);
      document.querySelector("#sidebar").classList.toggle("active");

    }

  };

  const [open_Ql, setopen_Ql] = useState(false)
  const QuickLauncher = () => {
    setopen_Ql(!open_Ql)
  }

  return (
    <>
      <Navbar className="header px-2" bg="" expand="lg" variant="">
        <button
          type="button"
          id="sidebarCollapse"
          className="btn btn-info"
          onClick={toggleSidebar}

        >
          <i className="fas fa-align-left"></i>
        </button>
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="#" className="p-0" style={{ fontSize: ".9rem" }}>
              <img src={sessionStorage.getItem("myimage")} className="rounded-circle" style={{ height: "30px" }} />
              <Badge style={{ fontSize: ".9rem" }} bg="light" text="dark">{sessionStorage.getItem("username")} </Badge>
              
              {sessionStorage.getItem("userrole") === "SUPER_ADMIN" && (
                <Badge bg="success" style={{ fontSize: ".9rem" }}>Super Admin</Badge>
              )}

              {sessionStorage.getItem("userrole") === "ADMIN" && (
                <Badge bg="success" style={{ fontSize: ".9rem" }}>Admin</Badge>
              )}
              {console.log(authApi.companyDetail(),'authApi.companyDetail().')}
{/* 
              {authApi.companyDetail(). === "USER" && (
                <Badge bg="success" style={{ fontSize: ".9rem" }}>User</Badge>
              )} */}
            </Nav.Link>


            {/* New code for module visibility based on user role */}



            <Nav.Link href="#" className="d-flex p-0" style={{ alignItems: "center" }}><span className="mx-2" style={{ fontSize: ".9rem" }}>Company</span> <Badge style={{ fontSize: ".9rem" }} bg="secondary">ibirds software services </Badge> </Nav.Link>


          </Nav>

          <Nav className="ml-auto">
            <Nav.Link href="/about">
              <i className="fa-solid fa-bell"></i>
            </Nav.Link>
            {sessionStorage.getItem("token") ? (
              <Button variant="btn btn-primary" onClick={logout} title="Logout">
                <i className="fa-solid fa-right-from-bracket"></i>
              </Button>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {All_launcher.length > 0 &&
      <button type="button" class="btn btn-secondary appLauncher px-2" onClick={() => QuickLauncher()}><i class="fa-solid fa-jet-fighter-up"></i></button>
      }
      {open_Ql &&
      
        <div className="all_Quick_launcer py-2 ">
          {All_launcher?.map((vl, ky) => (
            <div class="card my-2 bg-light">
              {console.log(vl,"vl ==>")}
              <Link class="card-body text-decoration-none" to={vl.sub_module_url}  state={{ [vl?.name]: true }}data-toggle="tooltip" data-placement="top" title={vl?.name}>
                <i className={vl.icon} />
              </Link>
            </div>
          ))}
        </div>
      }
    </>
  );
};

export default Header;
