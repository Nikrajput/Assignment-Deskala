import React, { useState, useEffect } from "react";
import { uid } from 'uid';

import {
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@material-ui/core";
import {
  FormGroup,
  Label,
  Input,
  Form,
  Row,
  Col,
  Alert,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import { Link, useHistory } from "react-router-dom";
import {State} from 'country-state-city'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { db } from "../firebase";
import { db as db2 } from "../firebase/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { ref as dbRef, onValue } from "firebase/database";

import SEO from "../component/seo";
import withAuthorization from "../authentication/withAuthorization";

import { CustomButton } from "../component/CustomButton";

const useStyles = makeStyles((theme) => ({
  main: {
    position: "relative"
  },

  logoContainer: {
    position: "absolute",
    top: 10,
    left: 20,

    "& > img": {
      height: "60px"
    },

    [theme.breakpoints.down("sm")]: {
      "& > img": {
        height: "40px"
      }
    }
  },

  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
  },

  heading: {
    fontSize: "1.3rem",
    fontWeight: "bold",

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem"
    }
  },

  formSection: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    positon: "relative",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "0 5%",
    },
  },

  loader: {
    zIndex: 3,
    position: "absolute",
    background: theme.palette.primary.light,
    width: "50%",
    opacity: 0.3,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("md")]: {
      width: "100%"
    }
  },

  formContainer: {
    width: "60%",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    padding:"50px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },

  form: {
    margin: "2rem 0",
  },

  checkboxSection: {
    marginLeft: "1.3rem",
  },

  loginButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem"
  },

  signupText: {
    color: "gray",
    textAlign: "center",

    "& > span": {
      color: "black",
      fontWeight: "bold",
      marginLeft: "0.5rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem"
    }
  },

  // ** Image Section **
  imageSection: {
    width: "50%",
  },

  imageContainer: {
    position: "relative",
    height: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  imageOverlayTextContainer: {
    zIndex: 2,
    position: "absolute",
    top: "80%",
    display: "flex",
    justifyContent: "center",
  },

  overlayInnerContainer: {
    width: "80%",
    padding: "1rem 2rem",
    background: "rgba( 255, 255, 255, 0.25 )",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur(4px)",
    "-webkit-backdrop-filter": "blur(4px)",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    color: "white",
  },

  loginUsing: {
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    gap: 30
  }
}));

const CreateCandidate = () => {
  const classes = useStyles();
  const history = useHistory();

  const theme = useTheme();
  // ** State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [pincode, setPincode] = useState("");
  const [allState,setAllState] = useState([]);
  const [dropdown,setDropdown] = useState(false);
  const [state,setState] = useState("");
  const [candidates,setCandidates]=useState({});

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = firebase.auth().currentUser;
  const userId = user.uid;

  useEffect(() => {
    const data=State.getStatesOfCountry('IN');
    setAllState([...data]);
    const candidateseRef=dbRef(db2,`newCandidates`);
    onValue(candidateseRef,(snapshot)=>{
      if(snapshot.val()){
        setCandidates(snapshot.val());
      }
    })
  }, []);

  useEffect(() => {
    const timer = () => {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    };

    return timer;
  }, [errorMessage]);

  const existingCandidate= (email) => {
    for (let [key, value] of Object.entries(candidates)) {
      if(value.emailAddress == email)return true;
    }
    return false;
  }

  const validatePincode = (pincode) => {
    return pincode.match(/^[1-9][0-9]{5}$/);
  }

  const handleNewCandidate = () => {
    if(!name || !address || !dateOfBirth || !state || !age || !pincode){
      setErrorMessage("All Fields are compulsory");
      return;
    }
    if(existingCandidate(address)){
      setErrorMessage("Email address is already in use for another candidate");
      return;
    }
    if(!validatePincode(pincode)){
      setErrorMessage("Pin code is invalid")
      return;
    }
    db.doCreateNewCandidate({name,address,dateOfBirth,state,age,pincode});
    history.push('/');
  };

  return (
    <>
      <SEO title="Create Candidate" />
      <div className={classes.main}>
        <Link to="/">
          <div className={classes.logoContainer}>
            <img src="/favicon.ico" alt="OLX"/>
          </div>
        </Link>
      </div>
      <div className={classes.root}>
        <section className={classes.formSection}>
          {isLoading && (
            <div className={classes.loader}>
              <CircularProgress color="inherit" size={60} />
            </div>
          )}
          <div className={classes.formContainer}>
            <Typography
              variant="h4"
              className={classes.heading}
            >
              Create Candidate
            </Typography>
            <Form className={classes.form}>
              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      style={{ height: "42px"}}
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="address">Email Address</Label>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      style={{ height: "42px"}}
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="dateOfBirth">Date Of Birth</Label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      style={{ height: "42px"}}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Dropdown isOpen={dropdown} toggle={(e) =>{setDropdown(!dropdown)}} >
                      <DropdownToggle caret style={{backgroundColor:"white",color:"black"}}>
                        {state ? state : "Select your state"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {allState.map(data => {
                          return (
                            <DropdownItem onClick={(e) => setState(e.target.innerText)}>{data.name}</DropdownItem>
                          )
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="age">Age</Label>
                    <Input
                      type="number"
                      name="age"
                      id="age"
                      style={{ height: "42px"}}
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label for="pincode">Pin Code</Label>
                    <Input
                      type="number"
                      name="pincode"
                      id="pincode"
                      style={{ height: "42px"}}
                      placeholder="Enter your 6-digit pin code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row >
                <Col sm={6}>
                  <CustomButton
                    disableElevation
                    variant="contained"
                    fullWidth
                    onClick={() => history.push('/')}
                    style={{backgroundColor:"red"}}
                  >
                    Cancel
                  </CustomButton>
                </Col>
                <Col sm={6}>
                  <CustomButton
                    disableElevation
                    variant="contained"
                    fullWidth
                    onClick={handleNewCandidate}
                    
                  >
                    Create
                  </CustomButton>
                </Col>
              </Row>
            </Form>
          </div>
        </section>
      </div>
    </>
  );
};

const authCondition = (authUser) => authUser;

export default withAuthorization(authCondition)(CreateCandidate);
