/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useState, useEffect} from "react";
import { Button, Col, Modal, Container, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Main from "../layout/Main";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { RxCross2 } from "react-icons/rx";
import Confirm from "../Confirm";
import ConfirmationDialog from '../modal/confirmation_dialog';

import PubSub from 'pubsub-js';

const FeeMasterEdit = () => {
  const location = useLocation();
  console.log('location-->', location?.state);
  
  const initialState = location?.state && location?.state?.id
    ? {
        apply_to_all: "false",
        classid: location?.state?.classid,
        fee_structure: location?.state?.fee_structure,
        sessionid: location?.state?.sessionid,
        status: location?.state?.status,
        type: location?.state?.type,
        fee_head_master_id: [{ general_fee: 0, obc_fee: 0, sc_fee: 0, st_fee: 0 }],
      }
    : { sessionid: "" };
  const navigate = useNavigate();
  const [optionClasses, setOptionClasses] = useState([]);
  const [optionFeeHeadMaster, setFeeHeadMaster] = useState([]);
  const [selectedFeeHeadMaster, setSelectedFeeHeadMaster] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sessionYear, setSessionYear] = useState([]);
  const [allFeesMaster, setAllFeesMaster] = useState([]);
  const [feeMaster, setFeeMastrer] = useState(initialState);
  const [selectedType, setSelectedType] = useState("Monthly");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showInstallment, setShowInstallment] = useState(false);
  const [currentSession, setCurrentSession] = useState();
  const [finalData, setFinalData] = useState([]);
  const [applyToAllChecked, setApplyToAllChecked] = useState(false);
  const [formatedSelectedMonth, setFormatedSelectedMonths] = useState([]);
  const [fixedmonths, setFixedMonths] = useState([]);
  const [deleteFeeHeads, setDeleteFeeHeads] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [monthsToBeRemoved, setMonthsToBeRemoved] = useState([]);
  const [optionMonths, setOptionMonths] = useState([]);
  const [activeTab, setActiveTab] = useState(fixedmonths[0]?.value);
  const [feeMasterInstallment, setFeeMasterInstallment] = useState([]);
  const [isUpdate, setisUpdate] = useState(false);
  const [removeTab, setRemoveTab] = useState(false);
  // const [months, setMonths] = useState();

console.log('feeMaster using location-->',feeMaster);
  // while edit------------------------location.state.id-------------------------
  useEffect(() => {
    fetchData(location?.state?.id);
    handleInstallmentType(feeMaster?.type);
  }, [location?.state]);

  console.log('isUpdate-->',isUpdate);

  const fetchData = async () => {
    try {
      const masterInstalments = await schoolApi.fetchRelatedInstallments(location?.state?.classid, location?.state?.type);
      console.log('masterInstalments:', masterInstalments);

      masterInstalments?.forEach((res) => {
        setFinalData((prevData) => {
          setFixedMonths((prevMonths) => {
            if (!prevMonths.some((item) => item.label === res.month)) {
              return [...prevMonths, { label: res.month, value: res.month }];
            }
            return prevMonths;
          });
  
          // setOptionMonths((prevMonths) => {
          //   if (!prevMonths.some((item) => item.label === res.month)) {
          //     return [...prevMonths, { label: res.month, value: res.month }];
          //   }
          //   return prevMonths;
          // })
          
          if (!prevData) {
            return [
              {
                ...feeMaster,
                month: res?.month,
                fee_master_id: res?.fee_master_id,
                sessionid:
                  feeMaster?.sessionid === "" ? currentSession?.id : feeMaster?.sessionid,
                fee_head_master_id: {
                  line_items_id: res.id,
                  name: res.name,
                  head_master_id: res?.fee_head_master_id,
                  general_fee: res?.general_amount,
                  obc_fee: res?.obc_amount,
                  sc_fee: res?.sc_amount,
                  st_fee: res?.st_amount,
                  month: res?.month,
                  fee_master_installment_id: res?.fee_master_installment_id
                },
              },
            ];
          } else {
            const existingMonths = new Set(prevData.map((item) => item.month));
            if (existingMonths.has(res.month)) {
              const existingData = prevData.find((item) => item.month === res.month);
              if (!existingData.fee_head_master_id.some((item) => item.name === res.name)) {
                const newData = {
                  ...existingData,
                  fee_head_master_id: [
                    ...existingData.fee_head_master_id,
                    {
                      line_items_id: res.id,
                      name: res.name,
                      head_master_id: res.fee_head_master_id,
                      general_fee: res.general_amount,
                      obc_fee: res.obc_amount,
                      sc_fee: res.sc_amount,
                      st_fee: res.st_amount,
                      month: res.month,
                      fee_master_installment_id: res?.fee_master_installment_id
                    },
                  ],
                };
                return prevData.map((item) => (item.month === res.month ? newData : item));
              }
            } else {
              return [
                ...prevData,
                {
                  ...feeMaster,
                  month: res.month,
                  fee_master_id: res?.fee_master_id,
                  sessionid:
                    feeMaster.sessionid === "" ? currentSession.id : feeMaster.sessionid,
                  fee_head_master_id: [
                    {
                      line_items_id: res.id,
                      name: res.name,
                      head_master_id: res.fee_head_master_id,
                      general_fee: res.general_amount,
                      obc_fee: res.obc_amount,
                      sc_fee: res.sc_amount,
                      st_fee: res.st_amount,
                      month: res.month,
                      fee_master_installment_id: res?.fee_master_installment_id
                    },
                  ],
                },
              ];
            }
          }
          return prevData;
        });
      });
      
      if (Array.isArray(masterInstalments)) {
        setisUpdate(true);
        setFeeMasterInstallment(masterInstalments);
      } else {
        console.error('API response is:', masterInstalments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // while edit------------------------location.state.id-------------------------
  
  const handleFeeChange = (e) => {
    console.log('handle Change Called-->', e.target.value);
    setShowInstallment(false);
    if (e.target.name === "type") {
      const type = e.target.value;
      setSelectedType(type);
      handleInstallmentType(e.target.value);

    } else {
      setFeeMastrer({ ...feeMaster, [e.target.name]: e.target.value });

      if (finalData && finalData.length > 0) {
        setFinalData((prevVal) => {
          return prevVal.map((res) => {
            if (res[e.target.name] !== e.target.value) {
              return { ...res, [e.target.name]: e.target.value };
            }
            return res;
          });
        });
      }
      
    }
  };

const  handleInstallmentType =(typeValue)=>{
  console.log('type has called-->', typeValue);
  const currentDate = new Date();
  let months = [];
  setFormatedSelectedMonths([]);

  if (typeValue === "Monthly") {
    for (let i = 3; i <= 14; i++) {
      const month = (i % 12) + 1;
      const year = currentDate.getFullYear() + Math.floor((i - 1) / 12);
      months.push(
        `${new Date(year, month - 1, 1).toLocaleString("en-US", {
          month: "long",
        })}`
      );
      setSelectedMonths(months);

      setFormatedSelectedMonths((prevSelectedMonths) => [
        ...prevSelectedMonths,
        {
          label: `${new Date(year, month - 1, 1).toLocaleString("en-US", {
            month: "long",
          })}`,
          value: `${new Date(year, month - 1, 1).toLocaleString("en-US", {
            month: "long",
          })}`,
        },
      ]);
    }
  } else if (typeValue === "Bi-Monthly") {
    for (let i = 3; i <= 13; i += 2) {
      const month1 = (i % 12) + 1;
      const month2 = i + 1;
      const year = currentDate.getFullYear() + Math.floor((i - 1) / 12);
      months.push(
        `${new Date(year, month1 - 1, 1).toLocaleString("en-US", {
          month: "long",
        })} to ${new Date(year, month2, 1).toLocaleString("en-US", {
          month: "long",
        })}`
      );
      setSelectedMonths(months);
      setFormatedSelectedMonths((prevSelectedMonths) => [
        ...prevSelectedMonths,
        {
          label: `${new Date(year, month1 - 1, 1).toLocaleString("en-US", {
            month: "long",
          })} to ${new Date(year, month2, 1).toLocaleString("en-US", {
            month: "long",
          })}`,
          value: `${new Date(year, month1 - 1, 1).toLocaleString("en-US", {
            month: "long",
          })} to ${new Date(year, month2, 1).toLocaleString("en-US", {
            month: "long",
          })}`,
        },
      ]);
    }
  } else if (typeValue === "Quarterly") {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const startMonth = (quarter - 1) * 3 + 4;
      const endMonth = startMonth + 2;

      const year = currentDate.getFullYear();

      const startDate = new Date(year, startMonth - 1, 1);
      const endDate = new Date(year, endMonth, 0);

      const startMonthName = startDate.toLocaleString("en-US", {
        month: "long",
      });
      const endMonthName = endDate.toLocaleString("en-US", {
        month: "long",
      });

      months.push(`${startMonthName} to ${endMonthName}`);
      setSelectedMonths(months);

      setFormatedSelectedMonths((prevSelectedMonths) => [
        ...prevSelectedMonths,
        {
          label: `${startMonthName} to ${endMonthName}`,
          value: `${startMonthName} to ${endMonthName}`,
        },
      ]);
    }
  } else if (typeValue === "Half Yearly") {
    for (let halfYear = 1; halfYear <= 2; halfYear++) {
      const startMonth = (halfYear - 1) * 6 + 4;
      const endMonth = startMonth + 5;

      const year = currentDate.getFullYear();

      const adjustedYear = halfYear === 1 ? year : year + 1;

      const startDate = new Date(adjustedYear, startMonth - 1, 1);
      const endDate = new Date(adjustedYear, endMonth, 0);

      const startMonthName = startDate.toLocaleString("en-US", {
        month: "long",
      });
      const endMonthName = endDate.toLocaleString("en-US", {
        month: "long",
      });

      months.push(`${startMonthName} to ${endMonthName}`);
      setSelectedMonths(months);

      setFormatedSelectedMonths((prevSelectedMonths) => [
        ...prevSelectedMonths,
        {
          label: `${startMonthName} to ${endMonthName}`,
          value: `${startMonthName} to ${endMonthName}`,
        },
      ]);
    }
  } else if (typeValue === "Yearly") {
    const startMonth = 4;
    const endMonth = 3;

    const year = currentDate.getFullYear();

    const adjustedYear = endMonth === 1 ? year - 1 : year;

    const startDate = new Date(adjustedYear, startMonth - 1, 1);
    const endDate = new Date(adjustedYear + 1, endMonth, 0);

    const startMonthName = startDate.toLocaleString("en-US", {
      month: "long",
    });
    const endMonthName = endDate.toLocaleString("en-US", { month: "long" });

    months.push(`${startMonthName} to ${endMonthName}`);
    setSelectedMonths(months);

    setFormatedSelectedMonths((prevSelectedMonths) => [
      ...prevSelectedMonths,
      {
        label: `${startMonthName} to ${endMonthName}`,
        value: `${startMonthName} to ${endMonthName}`,
      },
    ]);
  }

  setFeeMastrer({
    ...feeMaster,
    type: typeValue,
    month: months[0],
    apply_to_all: "false",
    fee_head_master_id: [],
  });
  setFinalData([]);
  setAllFeesMaster([]);
  setSelectedFeeHeadMaster([]);
  setFixedMonths([]);
  setOptionMonths([]);
  setApplyToAllChecked(false);

  }

  useEffect(() => {
    if (
      feeMaster.classid &&
      feeMaster.type &&
      feeMaster.fee_structure &&
      feeMaster.status
    ) {
      setShowInstallment(true);
    } else {
      setShowInstallment(false);
    }
  }, [feeMaster]);

  useEffect(() => {
    async function initClass() {
      const sessions = await schoolApi.fetchSessions();
      if (sessions) {
        setSessionYear(sessions);

        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        setCurrentSession(sessions.find((res) => {return res.year === `${currentYear}-${nextYear}`;}));
      } else {
        setSessionYear([]);
      }

      const classList = await schoolApi.getActiveClassRecords();
      if (classList) {
        let ar = [];
        classList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.classname;
          ar.push(obj);
        });
        setOptionClasses(ar);
      } else {
        setOptionClasses([]);
      }
    }
    async function initFeeHeadMaster() {
      const feeHeadMaster = await schoolApi.fetchFeesHeadMaster();

      let selectedHeadIds = [];
      if (finalData?.length > 0) {
        finalData.forEach((res) => {
          if (feeMaster.month === res.month) {
            res.fee_head_master_id.forEach((itm) => {
              selectedHeadIds.push(itm.head_master_id);
            });
          }
        });
      }

      if (selectedHeadIds.length > 0) {
        setFeeHeadMaster(
          feeHeadMaster
            .filter((itm) => !selectedHeadIds.includes(itm.id))
            .map((itm) => ({ value: itm.id, label: itm.name }))
        );
      } else {
        if (feeHeadMaster) {
          let ar = feeHeadMaster.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setFeeHeadMaster(ar);
        } else {
          setFeeHeadMaster([]);
        }
      }
    }

    initClass();
    initFeeHeadMaster();
  }, [showModal]);

  const handleFeeHeadMaster = (selectedOption) => {
    selectedOption.forEach((val) => {
      if (!val?.data) {
        return (val.data = {
          general_fee: "",
          obc_fee: "",
          sc_fee: "",
          st_fee: "",
        });
      }
    });
    setFeeMastrer({ ...feeMaster, fee_head_master_id: selectedOption });
    setSelectedFeeHeadMaster(selectedOption);
    setAllFeesMaster(selectedOption);

    if(finalData && finalData.length > 0){
      setFinalData((prevData) => {
        if (prevData && prevData.length > 0) {
          const newData = prevData.map((element) => {
            if(optionMonths.some((option)=>option.label === element.month)){
            const existingHeads = new Set(element?.fee_head_master_id.map((head) => head.name));
            console.log('existingHeads-->', existingHeads);
          
            const newFees = selectedOption
            .filter(option => !existingHeads.has(option.label))
            .map(option => ({
              name: option.label,
              head_master_id: option.value,
              general_fee: 0,
              obc_fee: 0,
              sc_fee: 0,
              st_fee: 0,
              month: element.month,
            }));
            
            const updatedFeeHeadMasterId = [...element.fee_head_master_id, ...newFees];

            console.log('new Element-->', { ...element, fee_head_master_id: updatedFeeHeadMasterId });
            
            return { ...element, fee_head_master_id: updatedFeeHeadMasterId };
          }else{
            return element;
          }
        }
          );

          console.log('newData-->',newData);
          return newData;
        }
      });
    }
  };

  const handleMonthMaster = (selectedOption) => {
    console.log("month master called::::::::", selectedOption);
    setOptionMonths(selectedOption)
    setFinalData((prevData) => {
        if (!prevData) {
            return [
                {
                    ...feeMaster,
                    month: selectedOption[0]?.value,
                    sessionid:
                        feeMaster.sessionid === ""
                            ? currentSession.id
                            : feeMaster.sessionid,
                    fee_head_master_id: feeMaster.fee_head_master_id.map((res) => ({
                        name: res.label,
                        head_master_id: res.value,
                        general_fee: "",
                        obc_fee: "",
                        sc_fee: "",
                        st_fee: "",
                        month: selectedOption[0]?.value,
                    })),
                },
            ];
        }
        console.log('prevData--->', prevData);

        let existingMonths = new Set(prevData.map((item) => item.month));
        
        let newMonths = selectedOption.filter(option => !existingMonths.has(option.label));

        if (newMonths.length > 0) {
            console.log('newMonths-->', newMonths);

            const newData = newMonths.map((option) => ({
                ...feeMaster,
                month: option.label,
                sessionid: feeMaster.sessionid === "" ? currentSession.id : feeMaster.sessionid,
                fee_head_master_id: feeMaster.fee_head_master_id.map((res) => ({
                    name: res.label,
                    head_master_id: res.value,
                    general_fee: 0,
                    obc_fee: 0,
                    sc_fee: 0,
                    st_fee: 0,
                    month: option.label,
                })),
            }));

            setFixedMonths((prevFixedMonths) => [...prevFixedMonths, ...newMonths]);
            return [...prevData, ...newData];
        }
        else {
            return prevData;
        }
    });
};


  const handleform = (e, row) => {
    setFinalData((oldval) =>
      oldval.map((res) => ({
        ...res,
        fee_head_master_id: res.fee_head_master_id.map((itm) => {
          if (itm.name === row.name && itm.month === row.month) {
            if (e.target.name === "general_fee") {
              return {
                ...itm,
                general_fee: e.target.value,
                obc_fee: e.target.value,
                sc_fee: e.target.value,
                st_fee: e.target.value,
              };
            } else if (e.target.name === "obc_fee") {
              return { ...itm, [e.target.name]: e.target.value };
            } else if (e.target.name === "sc_fee") {
              return { ...itm, [e.target.name]: e.target.value };
            } else if (e.target.name === "st_fee") {
              return { ...itm, [e.target.name]: e.target.value };
            }
          }
          return itm;
        }),
      }))
    );
  };

  const getBody = (month) => {
    const filteredData = finalData?.filter((vl) => month === vl.month);
    const feeHeadIds = filteredData?.map((vl) => vl.fee_head_master_id);
    return feeHeadIds[0];
  };

  
  const handleSaveLineItems = async () => {
    try {

      if(isUpdate){
        const resultFeeMasterupdate = await schoolApi.updateFeeInstallmentLineItems(finalData);
        console.log("resultFeeMaster", resultFeeMasterupdate);
  
        if (resultFeeMasterupdate.success) {
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Record Saved',
            message: 'Record Saved successfully'
          });
          navigate("/feesmasterlist");
        }

      }else{
        const resultFeeMaster = await schoolApi.createFeeMaster(finalData);
        console.log("resultFeeMaster", resultFeeMaster);
  
        if (resultFeeMaster.success) {
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Record Saved',
            message: 'Record Saved successfully'
          });
          navigate("/feesmasterlist");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return toast.error("Duplicate records are not allowed!!");
      } else {
        console.error("Request failed:", error);
      }
    }
  };

  const applyToAllHendler = (e) => {
    setFeeMastrer({ ...feeMaster, apply_to_all: e.target.checked });
    setApplyToAllChecked(e.target.checked);

    if (feeMaster.apply_to_all) {
      for (let i = 0; i < fixedmonths.length; i++) {
        setFinalData((prevData) =>
        prevData.map((res) => {
          if (res.month === fixedmonths[i].label && feeMaster.month !== fixedmonths[i].label) {
            const filteredAr = prevData.filter((result) => feeMaster.month === result.month);
      
            let arry = [...res.fee_head_master_id];
            filteredAr[0].fee_head_master_id?.forEach((item) => {
              arry.forEach((existingItem, index) => {
                if (existingItem.name === item.name && existingItem.general_fee <= 0) {
                  arry[index] = { ...existingItem, general_fee: item.general_fee, obc_fee: item.obc_fee,
                  sc_fee: item.sc_fee, st_fee: item.st_fee };
                }
              });

              if (!arry.some((existingItem) => existingItem.name === item.name)) {
                arry.push(item);
              }
            });
      
            return { ...res, fee_head_master_id: arry };
          }
          return res;
        })
      );
      
      }
    }
  };


  const header = [
    {
      title: "Name",
      prop: "name",
      isFilterable: true,
      //   cell: (row) => (
      //     <Form.Group>
      //       <Form.Control
      //         type="text"
      //         name="name"
      //         placeholder="Enter Head Master Name"
      //         value={row.name}
      //         onChange={handleform}
      //       />
      //     </Form.Group>
      //   ),
    },
    {
      title: "Month",
      prop: "month",
    },
    {
      title: "General Fee",
      prop: "general_fee",
      cell: (row) => (
        <Form.Group>
          <Form.Control
            type="number" 
            required
            name="general_fee"
            placeholder="Enter General Fee"
            value={row.general_fee}
            onChange={(e) => handleform(e, row)}
          />
        </Form.Group>
      ),
    },
    {
      title: "Obc Fee",
      prop: "obc_fee",
      cell: (row) => (
        <Form.Group>
          <Form.Control
            type="number"
            name="obc_fee"
            placeholder="Enter OBC Fee"
            value={row.obc_fee}
            onChange={(e) => handleform(e, row)}
          />
        </Form.Group>
      ),
    },
    {
      title: "Sc Fee",
      prop: "sc_fee",
      cell: (row) => (
        <Form.Group>
          <Form.Control
            type="number"
            name="sc_fee"
            placeholder="Enter Sc Fee"
            value={row.sc_fee}
            onChange={(e) => handleform(e, row)}
          />
        </Form.Group>
      ),
    },
    {
      title: "St Fee",
      prop: "st_fee",
      cell: (row) => (
        <Form.Group>
          <Form.Control
            type="number"
            name="st_fee"
            placeholder="Enter St Fee"
            value={row.st_fee}
            onChange={(e) => handleform(e, row)}
          />
        </Form.Group>
      ),
    },
    {
      title: "Action",
      prop: "",
      cell: (row) => (
        <div>
          <button
            className="btn btn-sm btn-danger mx-2"
            onClick={(e)=>deleteSelectedFeeHeads(e, row)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const deleteSelectedFeeHeads = (e, row) => {
    e.preventDefault();
    setDeleteFeeHeads(true);
    setSelectedRow(row);
    monthsToBeRemoved.push(row.month);
  }

  const handleTabSelect = (selectedTab) => {
    setFeeMastrer({ ...feeMaster, month: selectedTab });
    setActiveTab(selectedTab);
  };

  const removeSelectedTab = async (month) => {
    if (location?.state) {

      const masterInstallmentIds = finalData
        .filter(res => res.fee_head_master_id.some(item => item.month === month))
        .map(res => res.fee_head_master_id.filter(item => item.month === month)
          .map(item => item.fee_master_installment_id))
        .flat();

      console.log('masterInstallmentIds-->', masterInstallmentIds);

      const resultInstallmentdelete = await schoolApi.deleteFeeMasterInstallment(masterInstallmentIds[0]);
      console.log('resultInstallmentdelete-->', resultInstallmentdelete);

      if (resultInstallmentdelete.success) {
        PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
        // navigate("/feesmasterlist");
      }

      setOptionMonths((prevMonths) => {
        const indexToRemove = prevMonths.findIndex(res => res.label === month);
        if (indexToRemove !== -1) {
          const updatedMonths = [...prevMonths];
          updatedMonths.splice(indexToRemove, 1);
          return updatedMonths;
        }
        return prevMonths;
      });

      setFixedMonths(prevMonths => {
        const indexToRemove = prevMonths.findIndex(res => res.label === month);
        if (indexToRemove !== -1) {
          const updatedMonths = [...prevMonths];
          updatedMonths.splice(indexToRemove, 1);
          const newActiveTab = updatedMonths.length > 0 ? updatedMonths[0].value : null;
          setActiveTab(newActiveTab);
          return updatedMonths;
        }
        return prevMonths;
      });

      setFinalData(prevData => {
        const indexToRemove = prevData.findIndex(item => item.month === month);
        if (indexToRemove !== -1) {
          const updatedData = [...prevData];
          updatedData.splice(indexToRemove, 1);
          return updatedData;
        }
        return prevData;
      });

    }
    else {

      setOptionMonths((prevMonths) => {
        const indexToRemove = prevMonths.findIndex(res => res.label === month);
        if (indexToRemove !== -1) {
          const updatedMonths = [...prevMonths];
          updatedMonths.splice(indexToRemove, 1);
          return updatedMonths;
        }
        return prevMonths;
      });

      setFixedMonths(prevMonths => {
        const indexToRemove = prevMonths.findIndex(res => res.label === month);
        if (indexToRemove !== -1) {
          const updatedMonths = [...prevMonths];
          updatedMonths.splice(indexToRemove, 1);
          const newActiveTab = updatedMonths.length > 0 ? updatedMonths[0].value : null;
          setActiveTab(newActiveTab);
          return updatedMonths;
        }
        return prevMonths;
      });

      setFinalData(prevData => {
        const indexToRemove = prevData.findIndex(item => item.month === month);
        if (indexToRemove !== -1) {
          const updatedData = [...prevData];
          updatedData.splice(indexToRemove, 1);
          return updatedData;
        }
        return prevData;
      });

    }
    setRemoveTab(false);
  };

  const closeDeleteSelectedFeeHeads =()=>{
    setDeleteFeeHeads(false);
    setSelectedRow();
    setMonthsToBeRemoved([]);
  }

  const handleRemoveSelectedFeeHeads = () => {
    if(!monthsToBeRemoved.length > 0){
      return toast.error("Please select Month!!");
    }

    setFinalData((prevData) => {
      if (prevData && monthsToBeRemoved.length > 0) {
        const updatedData = prevData.map((res) => {
          if (monthsToBeRemoved.includes(res.month)) {
            let tempArray = [...res.fee_head_master_id];
            const indexToRemove = tempArray.findIndex((item) => item.name === selectedRow?.name);
            if (indexToRemove !== -1) {
              tempArray.splice(indexToRemove, 1);
            }
            return { ...res, fee_head_master_id: tempArray };
          }
          return res;
        });
        return updatedData;
      }
      return prevData;
    });
    setDeleteFeeHeads(false);
    setMonthsToBeRemoved([]);
  };

  
  const applyToAllMonthHandler = (month) => {
    console.log('month to be removed clicked!!!');
    if (!monthsToBeRemoved.includes(month)) {
      setMonthsToBeRemoved(prev => [...prev, month]);
    } else {
      setMonthsToBeRemoved(prev => prev.filter(item => item !== month));
    }
  };

  console.log("finalData-->", finalData);
  console.log("fixedmonths-->", fixedmonths);
  console.log('selectedMonths->',selectedMonths);
  console.log('optionMonths-->',optionMonths);

  return (
    <Main>
      <Container>
        <Form>
          <Row>
            <Col lg={12}>
              <Row className="view-form-header align-items-center mx-2">
                <Col lg={3}>Fee Master</Col>
              </Row>
            </Col>
          </Row>
          <Row lg={12} className="attandanceDate">
            <Row>
              <Col lg={12} className="mx-3">
                <Row>
                  <Col lg={4}>
                    <Form.Group className="my-3 mx-2">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Class Name
                      </Form.Label>
                      <Form.Select
                        required
                        name="classid"
                        value={feeMaster?.classid}
                        onChange={handleFeeChange}
                      >
                        <option value="">-- Select Class Name --</option>
                        {optionClasses.map((res) => (
                          <option key={res.value} value={res.value}>
                            {res.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className=" my-3 mx-2">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Type
                      </Form.Label>
                      <Form.Select
                        required
                        name="type"
                        value={feeMaster?.type}
                        onChange={handleFeeChange}
                      >
                        <option value="">-- Select Type --</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-Monthly">Bi-Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half Yearly">Half Yearly</option>
                        <option value="Yearly">Yearly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="my-3 mx-2">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Session
                      </Form.Label>
                      <Form.Select
                        name="sessionid"
                        value={
                          feeMaster.sessionid === ""
                            ? currentSession && currentSession.id
                            : feeMaster.sessionid && feeMaster.sessionid
                        }
                        onChange={handleFeeChange}
                      >
                        <option value="">-- Select Session --</option>
                        {sessionYear.map((session) => (
                          <option key={session.id} value={session.id}>
                            {feeMaster.sessionid === ""
                              ? currentSession && currentSession.year
                              : session && session.year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="my-3 mx-2">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Structure Type<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select
                        required
                        name="fee_structure"
                        value={feeMaster?.fee_structure}
                        onChange={handleFeeChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="New">New</option>
                        <option value="Old">Old</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group className="my-3 mx-2">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="nameInput"
                      >
                        Status<span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select
                        required
                        name="status"
                        value={feeMaster?.status}
                        onChange={handleFeeChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Active">Active</option>
                        <option value="InActive">InActive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={4}></Col>
              <Col lg={4}>
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </Col>
              <Col lg={4}></Col>
            </Row>
          </Row>
          <Row>
            <Col lg={3}></Col>
          </Row>
          {showInstallment && (
            <>
              <Row>
                <Col lg={12}>
                  <Col className="mx-3">
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}>Fee Configuration</span>
                    </Col>
                  </Col>
                </Col>

                {/* start--------------------------------- ReWork ---------------------------- */}
                <Row>
                  <Col lg={5}>
                    <Form.Group className="mx-3 fees">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Select fee head
                      </Form.Label>
                      <Select
                        placeholder="Select fee head"
                        value={selectedFeeHeadMaster}
                        onChange={handleFeeHeadMaster}
                        options={optionFeeHeadMaster}
                        isMulti={true}
                        name="fee_head_master_id"
                      ></Select>
                    </Form.Group>
                  </Col>
                  <Col lg={5}>
                    <Form.Group className="mx-3 fees">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Select Months
                      </Form.Label>
                      <Select
                        placeholder="Select month"
                        value={optionMonths}
                        onChange={handleMonthMaster}
                        options={formatedSelectedMonth}
                        isMulti={true}
                        name="month"
                      ></Select>
                    </Form.Group>
                  </Col>
                  <Col lg={2}>
                    <Row style={{ textAlign: "center", marginTop: "24px" }}>
                      <Col lg={6}>
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Apply To All"
                          style={{ fontSize: "18px" }}
                          checked={feeMaster.apply_to_all === true}
                          onChange={(e) => applyToAllHendler(e)}
                          disabled={applyToAllChecked}
                        />
                      </Col>
                      <Col lg={6}>
                        <Button
                          className="mx-3"
                          onClick={handleSaveLineItems}
                          style={{ textAlign: "center" }}
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Form.Group className="text-center mx-3">
                    <Tabs
                      id="month-tab"
                      activeKey={activeTab}
                      onSelect={handleTabSelect}
                    >
                      {fixedmonths.map((month, index) => (
                        <Tab
                          eventKey={month.value}
                          title={
                            <span>
                              {month.value}
                              <RxCross2
                                style={{
                                  marginLeft: "5px",
                                  verticalAlign: "middle",
                                }}
                                onClick={() => setRemoveTab(true)}
                              />
                              
                              {/* {removeTab && (
                                <Confirm
                                  show={removeTab}
                                  onHide={() => setRemoveTab(false)}
                                  removeSelectedTab={() =>
                                    removeSelectedTab(month.value)
                                  }
                                  title="Confirm remove?"
                                  message="You are going to remove the tab. Are you sure?"
                                  tabname="remove_tab"
                                />
                              )} */}

                                 <div>
                                  <ConfirmationDialog
                                    open={removeTab}
                                    onClose={() => setRemoveTab(false)}
                                    onConfirm={() => removeSelectedTab(month.value)}
                                    message="Are you sure you want to perform this action?"
                                  />

                                </div>
                            </span>
                          }
                          key={index}
                        >
                          <Col lg={12} className="mt-3">
                            {finalData && finalData.length ? (
                              <DatatableWrapper
                                body={getBody(month.value)}
                                headers={header}
                                paginationOptionsProps={{
                                  initialState: {
                                    rowsPerPage: 15,
                                    options: [5, 10, 15, 20],
                                  },
                                }}
                              >
                                <Table striped className="data-table">
                                  <TableHeader />
                                  <TableBody />
                                </Table>
                                <Pagination />
                              </DatatableWrapper>
                            ) : (
                              <DatatableWrapper
                                body={[]}
                                headers={header}
                                paginationOptionsProps={{
                                  initialState: {
                                    rowsPerPage: 15,
                                    options: [5, 10, 15, 20],
                                  },
                                }}
                              >
                                <Table striped className="data-table">
                                  <TableHeader />
                                  <TableBody />
                                </Table>
                                <Pagination />
                              </DatatableWrapper>
                            )}
                          </Col>
                        </Tab>
                      ))}
                    </Tabs>
                  </Form.Group>
                </Row>

                {/* end--------------------------------- ReWork ------------------------------- */}
              </Row>
            </>
          )}
        </Form>
      </Container>

      <Modal
        show={deleteFeeHeads}
        backdrop="static"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        onHide={closeDeleteSelectedFeeHeads}
      >
        <Modal.Header>
          <Modal.Title>
            Are you Sure want to Remove {selectedRow?.name}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              {fixedmonths.map((res) => (
                <Col key={res.label} lg={6}>
                  <Form.Check
                    inline
                    type="checkbox"
                    label={res.label}
                    style={{ fontSize: "18px" }}
                    checked={monthsToBeRemoved.includes(res.label)}
                    onChange={() => applyToAllMonthHandler(res.label)}
                  />
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeDeleteSelectedFeeHeads}>
            Close
          </Button>
          <Button variant="danger" onClick={handleRemoveSelectedFeeHeads}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  );
};

export default FeeMasterEdit;
