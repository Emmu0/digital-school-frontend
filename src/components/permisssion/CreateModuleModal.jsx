// import React, { useEffect, useState } from "react";
// import { Button, Col, Modal, Row, Form } from "react-bootstrap";
// import schoolApi from "../../api/schoolApi";
// import { ToastContainer, toast } from "react-toastify";

// const CreateModuleModal = (props) => {

//   const [moduleData, setModuleData] = useState({
//     name: "",
//     status: "",
//   });

//   useEffect(() => {
//     if (props.moduleData) {
//       setModuleData({
//         name: props.moduleData.name,
//         status: props.moduleData.status,
//       });
//     } else {
//       setModuleData({
//         name: "",
//         status: "",
//       });
//     }
//   }, [props.moduleData]);

//   const handleChange = (e) => {
//     setModuleData({ ...moduleData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (moduleData.name) {
//       if (!moduleData.status) {
//         return toast.error("Please select status");
//       }
//       if (props.moduleData) {
//         try {
//           const result = await schoolApi.updateModule(props.moduleData.id,moduleData);
//           if (result.message === 'Module updated successfully') {
//             props.handleCloseModal();
//             props.fetchAllModules();
//             setModuleData({
//               name: "",
//               status: "",
//             });
//           }else{
//             toast.error(result.message)
//           }
//         } catch (error) {
//           console.error("Error updating assignment:", error);
//         }
//       } else {
//         try {
//           const result = await schoolApi.createModule(moduleData);
//           if (result.message === 'Module created successfully') {
//             props.handleCloseModal();
//             props.fetchAllModules();
//             setModuleData({
//               name: "",
//               status: "",
//             });
//           }else{
//             toast.error(result.message)
//           }
//         } catch (error) {
//           console.error("Error creating assignment:", error);
//         }
//       }
//     } else {
//       return toast.error("Please fill all the required fields.");
//     }
//   };

//   return (
//     <Modal
//       show={props.modalShow}
//       centered
//       backdrop="static"
//       aria-labelledby="contained-modal-title-vcenter"
//       onHide={() => {
//         props.handleCloseModal();
//         setModuleData({
//           name: props.moduleData.name ? props.moduleData.name : "",
//           status: props.moduleData.status ? props.moduleData.status : "",
//         });
//       }}
//     >
//       <Modal.Header
//         closeButton
//         style={{ maxHeight: "",}}
//       >
//         <Modal.Title>
//           {props.moduleData ? "Update Module" : "Create Module"}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form className="mt-3">
//           <Row>
//             <Col lg={6}>
//               <Form.Group className="mx-3">
//                 <Form.Label className="form-view-label">Module Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   placeholder="Enter Module name"
//                   value={moduleData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col lg={6} className="mt-1">
//               <Form.Group>
//                 <Form.Label>Status</Form.Label>
//                 <div className="mt-1">
//                   <Form.Check
//                     inline
//                     type="radio"
//                     label="Active"
//                     name="status"
//                     value="Active"
//                     checked={moduleData.status === "Active"}
//                     onChange={(e) =>
//                       setModuleData({ ...moduleData, status: "Active" })
//                     }
//                     required
//                   />
//                   <Form.Check
//                     inline
//                     type="radio"
//                     label="Inactive"
//                     name="status"
//                     value="Inactive"
//                     checked={moduleData.status === "Inactive"}
//                     onChange={(e) =>
//                       setModuleData({ ...moduleData, status: "Inactive" })
//                     }
//                     required
//                   />
//                 </div>
//               </Form.Group>
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="success" onClick={handleSubmit}>
//           {props.btnName}
//         </Button>
//         <Button
//           variant="light"
//           onClick={() => {
//             props.handleCloseModal();
//             setModuleData({
//               name: props.moduleData.name ? props.moduleData.name : "",
//               status: props.moduleData.status ? props.moduleData.status : "",
//             });
//           }}
//         >
//           Close
//         </Button>

//         <ToastContainer
//           position="top-center"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default CreateModuleModal;
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import PubSub from "pubsub-js";
import { useNavigate } from "react-router";
import authApi from "../../api/authApi";

const CreateModuleModal = (props) => {
  console.log('props CreateModuleModal : ', props);
  const navigate = useNavigate();
  const [allModules, setAllModules] = useState([]);
  const [moduleData, setModuleData] = useState({
    name: "",
    status: "",
    api_name: "",
    icon: "",
    url: "",
    parent_module: "",
    icon_type: "",
    order_no: null,
  });

  useEffect(() => {
    fetchAllModules();
  }, []);

  async function fetchAllModules() {
    let selectedAllModules = [];
    const result = await schoolApi.getAllModules(authApi.companyDetail().companyid);
    console.log("result module ======>", result);
    if (result !== "No Data Found") {
      console.log("enter");
      result.forEach((element) => {
        console.log("element ======>", element);
        if (element.parent_module === null) {
          selectedAllModules.push(element);
        }
      });
      setAllModules(selectedAllModules);
    } else {
      setAllModules([]);
    }
  }

  console.log("setAllModules ======>", allModules);

  useEffect(() => {
    if (props.moduleData) {
      setModuleData({
        name: props.moduleData.name,
        status: props.moduleData.status,
        api_name: props.moduleData.api_name,
        icon: props.moduleData.icon,
        url: props.moduleData.url,
        parent_module: props.moduleData.parent_module,
        icon_type: props.moduleData.icon_type,
        order_no: props.moduleData.order_no,
      });
    } else {
      setModuleData({
        name: "",
        status: "",
        api_name: "",
        icon: "",
        url: "",
        parent_module: "",
        icon_type: "",
        order_no: null,
      });
    }
  }, [props.moduleData]);

  // const handleChange = (e) => {
  //   setModuleData({ ...moduleData, [e.target.name]: e.target.value });
  //   if(moduleData.name){
  //         const apiName = moduleData.name.replace(' ', '_')
  //         console.log('apiName-------->', apiName);
  //         setModuleData({ ...moduleData, api_name : apiName});
  //       }
  // };
  const handleChange = (e) => {
    moduleData.CompanyId = authApi.companyDetail().companyid
    const { name, value } = e.target;
    let updatedModuleData = { ...moduleData, [name]: value };
  
    if (name === "name") {
      const apiName = value.replace(/ /g, '_');
      console.log('apiName-------->', apiName);
      updatedModuleData = { ...updatedModuleData, api_name: apiName };
    }
  
    setModuleData(updatedModuleData);
  };



  const handleSubmit = async () => {
    
    if (moduleData.name && moduleData.status && moduleData.icon_type && moduleData.icon && 
      ((!moduleData.parent_module && moduleData.url === '') || (moduleData.parent_module && moduleData.url)) &&
       ((moduleData.parent_module && moduleData.order_no === null) || (!moduleData.parent_module && moduleData.order_no))) 
    {
      console.log('moduleData=====> enter');
      if (!moduleData.status) {
        return toast.error("Please select status",{ position: toast.POSITION.TOP_CENTER, 
          theme:"colored", 
          hideProgressBar:true});
      }

      if (moduleData.icon_type === "url" && !moduleData.icon.startsWith("http")) {
        return toast.error("Please enter a valid URL for the icon.");
      }

      if (moduleData.icon_type === "className" && !moduleData.icon.startsWith("fa")) {
        return toast.error("Please enter a valid FontAwesome class name for the icon.");
      }

      if (moduleData.parent_module && moduleData.url === '') {
        return toast.error("Please enter url.");
      }

      if (props.moduleData) {
        try {
          const result = await schoolApi.updateModule(
            props.moduleData.id,
            moduleData
          );
          if (result.message === "Module updated successfully") {
            PubSub.publish("RECORD_SAVED_TOAST", {
              title: "Module Update",
              message: "Module update successfully",
            });
            props.handleCloseModal();
            props.fetchAllModules();
            setModuleData({
              name: "",
              status: "",
            });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Error updating assignment:", error);
        }
      } else {
        try {
          const result = await schoolApi.createModule(moduleData);
          if (result.message === "Module created successfully") {
            PubSub.publish("RECORD_SAVED_TOAST", {
              title: "Module Saved",
              message: "Module saved successfully",
            });
            props.handleCloseModal();
            navigate("/modulelist");
            props.fetchAllModules();
            setModuleData({
              name: "",
              status: "",
              api_name: "",
              icon: "",
              url: "",
              parent_module: "",
              icon_type: "",
              order_no: null,
            });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Error creating assignment:", error);
        }
      }
    } else {
      return toast.error("Please fill all the required fields.",{ position: toast.POSITION.TOP_CENTER, 
        theme:"colored", 
        hideProgressBar:true});
    }
  };

  return (
    <Modal
      show={props.modalShow}
      centered
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => {
        props.handleCloseModal();
        setModuleData({
          name: props.moduleData.name ? props.moduleData.name : "",
          status: props.moduleData.status ? props.moduleData.status : "",
          api_name: props.moduleData.status ? props.moduleData.status : "",
          icon : props.moduleData.icon ? props.moduleData.icon : "",
          url : props.moduleData.url ? props.moduleData.url : "",
          parent_module : props.moduleData.parent_module ? props.moduleData.parent_module : "",
          icon_type : props.moduleData.icon_type ? props.moduleData.icon_type : "",
          order_no : props.moduleData.order_no ? props.moduleData.order_no : null,
        });
      }}
    >
      <Modal.Header closeButton style={{ maxHeight: "" }}>
        <Modal.Title>
          {props.moduleData ? "Update Module" : "Create Module"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Module Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Module name"
                  value={moduleData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-1">
              <Form.Group>
                <Form.Label>Status
                  <sup style={{ color: "red", fontSize: '13px' }}>*</sup>
                </Form.Label>

                <div className="mt-1">
                  <Form.Check
                    inline
                    type="radio"
                    label="Active"
                    name="status"
                    value="Active"
                    checked={moduleData.status === "Active"}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, status: "Active" })
                    }
                    required
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="Inactive"
                    checked={moduleData.status === "Inactive"}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, status: "Inactive" })
                    }
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Icon Type</Form.Label>
                <Form.Select
                  required
                  placeholder="Select icon type"
                  name="icon_type"
                  onChange={handleChange}
                  value={moduleData.icon_type}
                >
                  <option value="">Select Icon Type</option>
                  <option value="className">Class Name</option>
                  <option value="url">Url</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Icon</Form.Label>
                <Form.Control
                  type="text"
                  name="icon"
                  placeholder="Enter Icon name"
                  value={moduleData.icon}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">URL</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  placeholder="Enter url"
                  value={moduleData.url}
                  onChange={handleChange}
                  required={moduleData.parent_module}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">
                  Parent Module
                </Form.Label>
                <Form.Select
                  name="parent_module"
                  onChange={handleChange}
                  value={moduleData.parent_module}
                // required
                >
                  <option key="default" value="">
                    -- Select Parent id --
                  </option>
                  {allModules &&
                    allModules.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Api Name</Form.Label>
                <Form.Control
                  type="text"
                  name="api_name"
                  placeholder="Enter Api name"
                  value={moduleData.api_name}
                  onChange={handleChange}
                // required
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Order No.</Form.Label>
                <Form.Control
                  type="number"
                  name="order_no"
                  placeholder="Enter order no."
                  // disabled={moduleData.parent_module}
                  value={moduleData.order_no}
                  onChange={handleChange}
                  required={moduleData.parent_module ? false : true}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          {props.btnName}
        </Button>
        <Button
          variant="light"
          onClick={() => {
            props.handleCloseModal();
            setModuleData({
              name: props.moduleData.name ? props.moduleData.name : "",
              status: props.moduleData.status ? props.moduleData.status : "",
              api_name: props.moduleData.status ? props.moduleData.status : "",
              icon : props.moduleData.icon ? props.moduleData.icon : "",
              url : props.moduleData.url ? props.moduleData.url : "",
              parent_module : props.moduleData.parent_module ? props.moduleData.parent_module : "",
              icon_type : props.moduleData.icon_type ? props.moduleData.icon_type : "",
              order_no : props.moduleData.order_no ? props.moduleData.order_no : null,
            });
          }}
        >
          Close
        </Button>

        {/* <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        /> */}
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModuleModal;
