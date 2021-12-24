import React, { useState, useEffect } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import {Typography, makeStyles} from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPenAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { db } from "../firebase";
import { db as db2 } from "../firebase/firebase";
import { ref as dbRef, onValue } from "firebase/database";
import { CustomButton } from "../component/CustomButton";

const useStyles = makeStyles((theme) => ({
  formSection: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    positon: "relative",
    padding:"50px",
    paddingTop:"100px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "0 5%",
    },
  },

  formContainer: {
    width: "90%",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    padding:"50px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }
}));

const Candidates = () => {
  const classes = useStyles();
  const history = useHistory();
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [candidates,setCandidates]=useState({});

  useEffect(() => {
    const candidateseRef=dbRef(db2,`newCandidates`);
    onValue(candidateseRef,(snapshot)=>{
      if(snapshot.val()){
        setCandidates(snapshot.val());
      }
      setIsLoading(true);
    })
  }, []);

  const handleDropDown = (e) => {
    setStatus((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.innerText,
    }));
  }

  const handleDelete = (candidateKey) => {
    const newCandidateRef=dbRef(db2,`newCandidates/${candidateKey}`);
    db.doDeleteNewCandidate(newCandidateRef);
  }

  const handleUpdate = (candidateInfo, candidateStatus) => {
    console.log(candidateInfo,candidateStatus);
  }

  return (
    <>
        {isLoading && <div className={classes.formSection}>
        <Container className={classes.formContainer}>
            <Row>
              <Col md={1}>
                <Typography variant="h5"></Typography>
              </Col >
              <Col md={2}>
                <Typography variant="h5">Name</Typography>
              </Col>
              <Col md={2}>
                <Typography variant="h5">Date of Birth</Typography>
              </Col>
              <Col md={3}>
                <Typography variant="h5">Email</Typography>
              </Col>
              <Col md={3}>
                <Typography variant="h5">Result</Typography>
              </Col>
            </Row>
            <Row style={{padding:"20px"}}>
              {Object.keys(candidates).map((key,idx) => {
                return (
                  <>
                  <Col md={1} >
                    <Typography variant="h5">{idx+1}</Typography>
                  </Col >
                  <Col md={2} >
                    <Typography variant="h5">{candidates[key].name}</Typography>
                  </Col>
                  <Col md={2} >
                    <Typography variant="h5">{candidates[key].dateOfBirth}</Typography>
                  </Col>
                  <Col md={3} >
                    <Typography variant="h5">{candidates[key].emailAddress}</Typography>
                  </Col>
                  <Col md={2}>
                    <UncontrolledDropdown >
                        <DropdownToggle caret style={{backgroundColor:"white",color:"black",border:"none"}}>
                          {status[idx] ? status[idx] : (candidates[key].status ? candidates[key].status : "Selected")}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem id={idx} onClick={handleDropDown}>Selected</DropdownItem>
                          <DropdownItem id={idx} onClick={handleDropDown}>Rejected</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md={1}>
                    <Link
                      to={{pathname:"/updateCandidate",candidateInfo:candidates[key],candidateId:key,candidateStatus:status[idx]?status[idx]:'Selected'}}
                      style={{backgroundColor:"white",color:"#1a8cff"}}
                    >
                      <FontAwesomeIcon icon={faPenAlt} />
                    </Link>
                  </Col>
                  <Col md={1}>
                    <CustomButton
                      disableElevation
                      variant="contained"
                      onClick={() => handleDelete(key)}
                      style={{backgroundColor:"white",color:"#1a8cff",padding:"0px"}}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </CustomButton>
                  </Col>
                  </>
                )
              })}
            </Row>
            <CustomButton
              disableElevation
              variant="contained"
              onClick={() => history.push('/createCandidate')}
              style={{backgroundColor:"white",color:"#1a8cff",padding:"0px"}}
            >
              <Typography variant="h5" style={{color:"#1a8cff"}}>
                <FontAwesomeIcon icon={faPlus} /> Add new candidate
              </Typography>
            </CustomButton>
        </Container>
      </div> }
    </>
  );
};

export default Candidates;
