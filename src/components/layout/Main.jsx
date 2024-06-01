/** @format */

import Sidebar from "../../components/layout/common/Sidebar"
import Header from "../../components/layout/common/Header";
const Main = ({ children }) => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div id="content">
        <Header />
        {children && children}
      </div>
    </div>
  );
};

export default Main;
