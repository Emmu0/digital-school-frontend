/**
 * @author: Shahir Hussain
 */
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";

import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const SectionView = (props) => {
    console.log('SectionView', props);
    const location = useLocation();
    console.log('location=========>', location);
    const navigate = useNavigate();
    const [classPath, setClassPath] = useState(location.state ? location.state.classpath : {});
    const [section, setSection] = useState(location.state ? location.state : {});
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        console.log('useEffect=', section.section_id);
        sectionRecords();
    }, []);

    const sectionRecords = async () => {
        console.log('section records =', section.section_id);
        const result = await schoolApi.fetchRecordById(section.section_id);
        console.log('sec res == ', result);
        if (result) {
            setSection(result);
            console.log('result22222', result)
        } else {
            setSection([]);
        }
    }

    const handleCancel = async (e) => {
        console.log('classPath == ', classPath);
        if (classPath)
            navigate(classPath);
        else
            navigate('/section');
    }



    const editLead = () => {
        navigate(`/section/${section.section_id}/e`, { state: section });
    };
    return (
        <Main>
            <Helmet> <title>{props?.tabName}</title> </Helmet>
            <div>
                {section && <Container>

                    <PageNavigations listName={classPath ? "Class List" : "Section List"} listPath={classPath ? classPath : "/section"} viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

                    <Row className="view-form">
                        <Col lg={12}>
                            <Col className="mx-3">
                                <Col className="section-header my-3">
                                    <span style={{ color: "black" }}>Section Information</span>
                                </Col>
                            </Col>
                            <Row className="view-form-header align-items-center mx-3">
                                <Col lg={10}>
                                    <h5>{section?.class_name} {section?.section_name}</h5>
                                </Col>
                                <Col lg={2}>
                                    <Button className="btn-sm mx-2" onClick={() => editLead(true)}>
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </Button>

                                    <Button
                                        className="btn-sm"
                                        variant="danger"
                                        onClick={() => setModalShow(true)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className="btn-sm mx-2"
                                        variant="danger"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mx-2 my-2">
                                <Col lg={6} className="my-2">
                                    <label>Class Name</label>
                                    <span>{section?.class_name}<br /></span>
                                </Col>
                                <Col lg={6} className="my-2">
                                    <label>Section Name</label>
                                    <span>{section?.section_name}<br /></span>
                                </Col>
                                <Col lg={6} className="my-2">
                                    <label>Class Teacher</label>
                                    <span>{section?.contact_name}<br /></span>
                                </Col>
                                <Col lg={6} className="my-2">
                                    <label>Is Active</label>
                                    <span>{section.isactive === true ? "true" : "false"}<br /></span>
                                </Col>
                                <Col lg={6} className="my-2">
                                    <label>strength</label>
                                    <span>{section.strength}<br /></span>
                                </Col>
                            </Row>
                            <Row>
                            </Row>
                        </Col>

                        <Col></Col>
                    </Row>

                </Container>}
            </div>
        </Main>
    )
}
export default SectionView