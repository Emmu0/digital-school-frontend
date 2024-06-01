import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation, useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBook from "./AddBook";
import BookRelatedList from "./BookRelatedList";
import PageNavigations from "../breadcrumbs/PageNavigations";

const BookView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = () => {
    if (location.hasOwnProperty("pathname")) {
      book.id = location.pathname.split("/")[2];
    }
    async function initBook() {
      let result = await schoolApi.getBooksRecordsById(book.id);
      if (result) {
        setBook(result);
      } else {
        setBook({});
      }
    }
    initBook();
  };

  const deleteBook = async () => {
    try {
      const result = await schoolApi.deleteBook(book.id);
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Deleted",
          message: "Record Deleted successfully",
        });
        navigate(`/books`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const editBook = () => {
    setEditModalShow(true);
    setRowRecords(book);
  };

  const recordSaveSuccesfully = () => {
    setEditModalShow(false);
    fetchBook();
  };
  const handleBack = () => {
    navigate(`/books`);
  };

  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
        {book && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteBook={deleteBook}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="book"
              />
            )}

            <PageNavigations
              listName="Book"
              listPath="/books"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />

            <Row className="view-form pt-5">
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "black" }}>Book Information</span>
                  </Col>
                </Col>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={10}>
                    <h5>
                      {book.title} {book.isbn && <>({book.isbn})</>}
                    </h5>
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editBook(true)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm mx-2"
                      variant="danger"
                      onClick={handleBack}
                    >
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col></Col>
              <div className="px-4 mt-2">
                <BookRelatedList book={book} />
              </div>
            </Row>
          </Container>
        )}
      </div>
      {editModalShow && (
        <AddBook
          show={editModalShow}
          parent={rowRecords}
          onHide={() => setEditModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
    </Main>
  );
};
export default BookView;