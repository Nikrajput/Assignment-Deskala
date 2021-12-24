import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Typography,
  Box,
  Button,
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
  CustomInput,
  Alert,
} from "reactstrap";

import { Link, useHistory } from "react-router-dom";

import { auth } from "../firebase";
import { db } from "../firebase";

import { handleAuthError } from "./handleAuthError";
import SEO from "../component/seo";

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
    padding:"50px",

    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "0 5%",
    },
  },

  loader: {
    zIndex: 3,
    position: "absolute",
    background: 'white',
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

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();

  const theme = useTheme();

  // ** State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const timer = () => {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    };

    return timer;
  }, [errorMessage]);

  // ** Login Functions
  function isAllPresent(str) {
    var pattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );

    if (!str || str.length < 8) {
      setErrorMessage("Password length should be greater or equal to 8")
      return false;
    }

    if (!pattern.test(str)) {
      setErrorMessage("Password shouldn contain at least One Uppercase, One lowercase, One Numeric, One Special Character");
      return false;
    } 
    return true;
  }

  const validateEmail = (email) =>{
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber.match(
      /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/
      )
  }

  const handleSignup = () => {
    console.log('nik',validateEmail(email));
    if(!validateEmail(email)){
      setErrorMessage("Email is not valid");
      return;
    }
    if (!isAllPresent(password)) {
      return;
    }
    if(!validatePhoneNumber(phoneNumber)){
      setErrorMessage('Phone Number is not valid');
      return;
    }
    setIsLoading(true);
    auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        db.doCreateUser(authUser.user.uid,email,phoneNumber);
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        history.push("/");
        setIsLoading(false);
      })
      .catch((err) => {
        const error = handleAuthError(err);
        setErrorMessage(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <SEO title="Sign up" />
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
              Sign Up
            </Typography>
            <Form className={classes.form}>
              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      style={{ height: "42px"}}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      style={{ height: "42px"}}
                      placeholder="Enter your Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      style={{ height: "42px"}}
                      placeholder="Minimum 8 Alpha numeric"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className={classes.loginButtons}>
                <Col sm={12}>
                  <CustomButton
                    disableElevation
                    variant="contained"
                    fullWidth
                    onClick={handleSignup}
                  >
                    Sign up
                  </CustomButton>
                </Col>
              </Row>
            </Form>
            <Typography variant="h6" className={classes.signupText}>
              Already have an account?
              <span>
                <Link to="/signin" style={{ color: "black" }}>
                  Login here
                </Link>
              </span>
            </Typography>
          </div>
        </section>
      </div>
    </>
  );
};

export default Signup;
