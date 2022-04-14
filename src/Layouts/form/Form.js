import React from "react";
import clsx from "clsx";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Radio,
  FormControlLabel,
  Checkbox,
  Fab,
  FormControl,
  RadioGroup,
} from "@material-ui/core";
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import Fusee from "../../assets/img/fusee.png";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 0,
    width: 16,
    height: 16,
    boxShadow: "none",
    backgroundColor: "#fff",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "0px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
});

// Inspired by blueprintjs
function StyledCheckbox(props) {
  const classes = useStyles();
  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ "aria-label": "decorative checkbox" }}
      {...props}
    />
  );
}

export default function Form() {

  const [participantInfo, setParticipantInfo] = React.useState(
    { 
      first_name: '',
      last_name: '',
      email: '',
      language: '',
      gender: ''
    }
  )

  const stateR = useSelector(state => state.states);

  const createParticipant = ()=>{
    fetch('http://test-api.endpoints.talk-speech.cloud.goog/user/individuals/create', {
      method: 'post',
      headers : {
        'x-access-tokens' : stateR.login,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify(participantInfo)
    })
      .catch(err=> console.log('participant does not created'))
    console.log("RESULT ",participantInfo)
  }

  const onInputChange = (e)=>{
    console.log("=>Input Name ",e.target.name)
    console.log("=>Input Value ",e.target.value)
    setParticipantInfo(Object.assign( participantInfo, {[e.target.name]: e.target.value}))
  }


  return (
    <>
      <div className="start-now flex justify-center items-center flex-col">
        <div className="container">
          <div className="log-section">
            <img src={Logo} width={110} alt="Logo" className="mx-auto" />
            <Box className="my-5">
              <Grid container justify="center">
                <Grid item md={4}>
                  <Grid container>
                    <Grid item md={3}>
                      <Typography className="text-white text-lg pt-4 fontFamily">
                        First Name
                      </Typography>
                    </Grid>
                    <Grid item md={9} className="pl-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        className="bg-white my-2"
                        name="first_name"
                        onChange={ (e)=> onInputChange(e)}
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={3}>
                      <Typography className="text-white text-lg pt-4 fontFamily">
                        Last Name
                      </Typography>
                    </Grid>
                    <Grid item md={9} className="pl-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        className="bg-white my-2"
                        name="last_name"
                        onChange={ (e)=> onInputChange(e)}
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={3}>
                      <Typography className="text-white text-lg pt-4 fontFamily">
                        Email
                      </Typography>
                    </Grid>
                    <Grid item md={9} className="pl-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        className="bg-white my-2"
                        name="email"
                        onChange={ (e)=> onInputChange(e)}
                      />
                    </Grid>
                  </Grid>
                  <div className="form-checkbox mt-2">
                    <Grid container>
                      <Grid item md={3}>
                        <Typography className="text-white text-lg pt-1.5 mb-4 fontFamily">
                          Gender
                        </Typography>
                      </Grid>
                      <Grid item md={9} className="pt-1 pl-2">
                        <FormControl component="fieldset">
                          <RadioGroup row aria-label="position" name="gender" onClick={ (e)=> onInputChange(e)}>
                            <FormControlLabel labelPlacement="start" className="text-white" value="M" control={<Radio size="small" />} label="Men" />
                            <FormControlLabel labelPlacement="start" className="text-white" value="F" control={<Radio size="small" />} label="Women" />
                            <FormControlLabel labelPlacement="start" className="text-white" value="Other" control={<Radio size="small" />} label="Other" />
                          </RadioGroup>
                          
                        </FormControl>
                        
                          
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item md={3}>
                        <Typography className="text-white my-1 text-lg fontFamily">
                          Language
                        </Typography>
                      </Grid>
                      <Grid item md={9} className="pt-1 pl-2">
                      <FormControl component="fieldset">
                        <RadioGroup row aria-label="position" name="language" onClick={ (e)=> onInputChange(e)} >
                        <FormControlLabel labelPlacement="start" className="text-white" value="ENG" control={<Radio size="small" />} label="English" />
                        <FormControlLabel labelPlacement="start" className="text-white" value="FR" control={<Radio size="small" />} label="Français" />
                          </RadioGroup>
                        </FormControl>  
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Box>

            <div className="text-center button-bottom-form">
              <Link to="/individual" className="">
                <Fab
                  variant="extended"
                  color="default"
                  className="btn-start-now px-5"
                  onClick={createParticipant}
                >
                  <img src={Fusee} alt="fuse" width="22" className="mr-5" />
                  Create !
                </Fab>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
