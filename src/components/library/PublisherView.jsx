import React, { useState, useEffect } from "react";
import { Table, Button, Col, Container, Row, Dropdown, DropdownButton } from "react-bootstrap";
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

const PublisherView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [publisher, setPublisher] = useState(location.state ? location.state : {});
  const [body, setBody] = useState([])
  const [modalShow, setModalShow] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState('');

  const header = [
    { title: "S.No.", prop: "serial", isFilterable: true },
    { title: "Book", prop: "title", isFilterable: true, cell: (row) => (
        <Link to={"/books/" + row.id} state={row}>
          {row.title}
        </Link>
      ), },
    { title: "Book Number", prop: "isbn", isFilterable: true },
    { title: "author", prop: "author_name", isFilterable: true },
    { title: "Language", prop: "language_name", isFilterable: true },
    { title: "publisher", prop: "publisher_name", isFilterable: true },
    { title: "copies", prop: "total_copies", isFilterable: true },
    { title: "available", prop: "available", isFilterable: true },
    { title: "status", prop: "status", isFilterable: true },
  ];
  
  const fetchBooksBypublisherId = async (publisherId) => {
    try {
      const books = await schoolApi.getBooksRecordsByPublisherId(publisherId);
      setBody(books);
    } catch (error) {
      console.error('Error fetching books by publisher:', error);
    }
  };

  useEffect(() => {
    async function fetchpublishers() {
      try {
        const publisherRecords = await schoolApi.getPublishersRecords();
        setPublishers(publisherRecords);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    }
    fetchpublishers();
  }, []); 
 
  useEffect(() => {
    if (selectedPublisher) {
      fetchBooksBypublisherId(selectedPublisher);
    }
  }, [selectedPublisher]);

  const handlePublisherSelect = async (publisherId) => {
    setSelectedPublisher(publisherId);
  };

  useEffect(() => {
    async function fetchPublisher() {
      let publisherId;
      if (location.hasOwnProperty("pathname")) {
        publisherId = location.pathname.split("/")[2];
      }
      if (publisherId) {
        setSelectedPublisher(publisherId);
        fetchBooksBypublisherId(publisherId);
      }
    }
    fetchPublisher();
  }, [location.pathname]);

  const handleBack = () => {
    navigate(`/publisher`);
  };

  const addBook = () => {
    setModalShow(true);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    fetchBooksBypublisherId(selectedPublisher)
  };

  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
          <Container>
         <PageNavigations
              listName="publisher"
              listPath="/publisher"
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
                        publisher Detail
                        </span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={3}>
                    <div>
                      <DropdownButton 
                      size="sm" 
                      id="dropdown-basic-button"
                      variant="primary" 
                      title={selectedPublisher ? publishers?.find(cat => cat.id === selectedPublisher)?.name : publisher?.name}
                      onSelect={handlePublisherSelect} 
                      className='select-name-btn'
                    >
                        {publishers?.map(publisher => (
                          <Dropdown.Item key={publisher.id} eventKey={publisher.id}>{publisher.name}</Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </div>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      variant="primary"
                      onClick={() => addBook(true)}
                    >
                      New
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
       </Container>
       {modalShow && (
        <AddBook
          show={modalShow}
          publisher={selectedPublisher}
          onHide={() => setModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
       </div>
     </Main>
  );
};
export default PublisherView;