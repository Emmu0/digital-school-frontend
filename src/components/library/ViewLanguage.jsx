import React, { useState, useEffect } from "react";
import { Table, Button, Col, Container, Row, DropdownButton, Dropdown  } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import "react-toastify/dist/ReactToastify.css";
import {
    DatatableWrapper,
    Pagination,
    TableBody,
    TableHeader,
  } from "react-bs-datatable";
  import Main from "../layout/Main";
  import { Helmet } from "react-helmet";
  import { ToastContainer } from "react-toastify";
  import PageNavigations from "../breadcrumbs/PageNavigations";
  import AddBook from "./AddBook";

const ViewLanguage = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(location.state ? location.state : {});
  const [body, setBody] = useState([]);

  // Start: Add by Abhishek
  const [modalShow, setModalShow] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  // End: Add by Abhishek

  const header = [
    { title: "S.No.", prop: "serial", isFilterable: true },
    { title: "Book", prop: "title", isFilterable: true, cell: (row) => (
        <Link to={"/books/" + row.id} state={row}>
          {row.title}
        </Link>
      ), },
    { title: "Book Number", prop: "isbn", isFilterable: true },
    { title: "Author", prop: "author_name", isFilterable: true },
    { title: "Category", prop: "category_name", isFilterable: true },
    { title: "Publisher", prop: "publisher_name", isFilterable: true },
    { title: "copies", prop: "total_copies", isFilterable: true }, 
    { title: "Available", prop: "available", isFilterable: true },
    { title: "Status", prop: "status" , isFilterable: true}, 
  ];
  
  async function initBook(languageId) {
    let result = await schoolApi.getBooksRecordsBylanguageId(languageId);
      setBody(result);
      setSelectedLanguage(languageId);
  }

  const fetchlanguage = () => {
    if (location.hasOwnProperty("pathname")) {
      language.id = location.pathname.split("/")[2];
      setLanguage(language);
    }
    // move the initBook() outside the fetchLanguage() by Abhishek
    initBook(language.id);
  };
 
  useEffect(() => {
    fetchlanguage();
  }, []); 
  
  const handleBack = () => {
    navigate(`/language`);
  };  

  // Start: Add by Abhishek
  useEffect(()=>{
    async function fetchAllLanguages(){
      try{
        let res=await schoolApi.getLanguagesRecords();
        console.log(res);
        setLanguages(res);
      }catch(error){
        console.error('Error fetching categories:', error);
      }      
    }
    fetchAllLanguages();
  }, []);
  
  const handleSelectLanguage = async(languageId) =>{
    setSelectedLanguage(languageId);
    setLanguage({id: languageId});
  }
  
  useEffect(()=>{
    if(selectedLanguage){
      initBook(selectedLanguage);
    }
  },[selectedLanguage]);

  const addBook = () => {
    setModalShow(true);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    initBook(language.id);
  };
  // End: Add by Abhishek

  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
        {body && (
          <Container>
         <PageNavigations
              listName="Language"
              listPath="/language"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />
            <Row className="view-form pt-5">
              <Col lg={12}>
                <Row>
                  <Col lg={12}>
                    <Col className="mx-3">
                      <Col className="section-header my-3">
                        <span style={{ color: "black" }}>
                          LANGUAGE INFORMATION
                        </span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={3}>
                    {/* DropdownButton Add by Abhishek */}
                    <DropdownButton size="sm" id="dropdown-basic-button" variant="primary" title={selectedLanguage ? languages?.find(lang => lang.id === selectedLanguage)?.name: language?.name} onSelect={handleSelectLanguage} className='select-name-btn'>
                      {languages?.map(lang => (
                          <Dropdown.Item key={lang.id} eventKey={lang.id}>{lang.name}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    {/* Add Book btn add by Abhishek */}
                    <Button
                      className="btn-sm mx-2"
                      variant="primary"
                      onClick={() => addBook(true)}
                    >
                      Add Book
                    </Button>

                    <Button
                      className="btn-sm mx-2"
                      variant="danger"
                      onClick={handleBack}
                    >
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </Button>
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
                </Row>
                <Row className="mx-3 mt-2">
                <div>
                {body ? (
                    <DatatableWrapper body={body} headers={header}>
                        <Table striped className="data-table custom-table-subject-list">
                        <TableHeader />
                        <TableBody />
                        </Table>
                        <Pagination />
                    </DatatableWrapper>
                    ) : (
                    <ShimmerTable row={10} col={8} />
                    )}
                    </div>
                 </Row>

                 <Row></Row>
               </Col>
            <Col></Col>
             </Row>
       </Container>)}
       {/* Add Add book Model by Abhishek */}
       {modalShow && (
        <AddBook
          show={modalShow}
          language={language.id}
          onHide={() => setModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
         )}
       </div>
     </Main>
  );
};
export default ViewLanguage;