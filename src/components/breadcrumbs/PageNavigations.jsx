import * as React from 'react';
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PageNavigations = (props) =>{
    if(props.id){
        return(
            <div>
                <Row className="g-0">
                    <Col lg={props.extrColumn}/>
                        <Col lg={props.colLg} className={props.colClassName}>
                            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>

                                { props.listName ? <Link className="nav-link" to="/">Home</Link> :
                                <Typography color="text.primary"><Link className="nav-link" to="/">Home</Link></Typography> }

                                { props.listName ? 
                                    props.viewName ?   <Link className="nav-link" underline="hover" color="inherit" to={props.listPath}>{props.listName}</Link>
                                        :   <Typography color="text.primary"><Link className="nav-link" underline="hover" color="inherit" to={props.listPath}>{props.listName}</Link></Typography>
                                    :   ""
                                }

                                {/* { props.listName ?  <Typography color="text.primary"><Link className="nav-link" underline="hover" color="inherit" to={props.listPath}>{props.listName}</Link></Typography> : ""} */}
                                { props.viewName ?  <Typography color="text.primary"><Link className="nav-link" underline="hover" color="inherit" to={props.viewPath}>{props.viewName}</Link></Typography> : ""}
                            </Breadcrumbs>             
                        </Col>
                    <Col lg={props.extrColumn}/>    
                </Row>
            </div>
        )
    }
    else{
        return(
            <div>
                <Row className="g-0">
                    <Col lg={props.extrColumn}/>
                        <Col lg={props.colLg} className={props.colClassName}>
                            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                                {/* <Typography color="text.primary"><Link className="nav-link" to="/">Home</Link></Typography> */}

                                { props.listName ? <Link className="nav-link" to="/">Home</Link> :
                                <Typography color="text.primary"><Link className="nav-link" to="/">Home</Link></Typography> }
                                
                                { props.listName ?  <Typography color="text.primary"><Link className="nav-link" underline="hover" color="inherit" to={props.listPath}>{props.listName}</Link></Typography> : ""}
                            </Breadcrumbs>
                        </Col>
                    <Col lg={props.extrColumn}/>    
                </Row>
            </div>
        )
    }
}
export default PageNavigations;