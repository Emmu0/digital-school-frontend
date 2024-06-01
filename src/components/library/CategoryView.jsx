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

const CategoryView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(location.state ? location.state : {});
  const [body, setBody] = useState([])
  const [modalShow, setModalShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const fetchBooksByCategoryId = async (categoryId) => {
    try {
      const books = await schoolApi.getBooksRecordsBycategoryId(categoryId);
      setBody(books);
    } catch (error) {
      console.error('Error fetching books by category:', error);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoryRecords = await schoolApi.getCategoryRecords();
        setCategories(categoryRecords);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []); 

  
  useEffect(() => {
    if (selectedCategory) {
      fetchBooksByCategoryId(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    async function fetchCategory() {
      let categoryId;
      if (location.hasOwnProperty("pathname")) {
        categoryId = location.pathname.split("/")[2];
      }
      if (categoryId) {
        setSelectedCategory(categoryId);
        fetchBooksByCategoryId(categoryId);
      }
    }
    fetchCategory();
  }, [location.pathname]);

  const handleBack = () => {
    navigate(`/category`);
  };

  const addBook = () => {
    setModalShow(true);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    fetchBooksByCategoryId(selectedCategory)
  };
  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
          <Container>
         <PageNavigations
              listName="category"
              listPath="/category"
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
                          category Detail
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
                          title={selectedCategory ? categories?.find(cat => cat.id === selectedCategory)?.name : category?.name}
                          onSelect={handleCategorySelect}
                          className='select-name-btn'
                          >
                        {categories?.map(category => (
                          <Dropdown.Item key={category.id} eventKey={category.id}>{category.name}</Dropdown.Item>
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
       </Container>
       {modalShow && (
        <AddBook
          show={modalShow}
          category={selectedCategory}
          onHide={() => setModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
       </div>
     </Main>
  );
};
export default CategoryView
