//React.version = 17.0.1
//Copyright © PlugEnd TechLabs Inc. All rights reserved
//Name : Login.js
//Created On :4/1/2021
//Built by : Techgater
//Description :
import React from "react";
//Material Components
import {
  Typography,
  Box,
  IconButton,
  FormControl,
  TextField,
  InputAdornment,
  Grid,
  Container,
  Fab
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import {Services} from '../../Components/services/Services'
import Loading from '../loading/Loading'
import { withRouter } from "react-router-dom";
import './login.scss'
import {useDispatch} from 'react-redux'
import {login} from '../../redux/actions'
import {sha3_512} from 'js-sha3';


const Login =  function (props) {
const dispatch = useDispatch();

  const [state, setstate] = React.useState({
    email: "",
    password: "",
    emailError:false,
    passwordError: false,
    loading:false
  });
  // Check email validate
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// on submit 
const submit = ()=> {
  const endpoint = "/auth/login";
  const data = {
    email:state.email,
    password:sha3_512(state.password)
  }
  setstate({...state,loading:true})
  Services.servicesPost(data,endpoint)
  .then(res => res.message === "SUCCESS" && (
  localStorage.setItem("token",res.token ),
  dispatch(login(res.token)),props.history.push("/"),setstate({...state,loading:false})
  ));
 
    
}
React.useEffect(() => {
  if(localStorage.getItem("token")){
    props.history.push('/')
   }
}, [])
 

  return (
      <>
    {!state.loading ? 
    <Box className="login-main">
        <Container className="h-full">
        <Grid container justify="center" alignItems="center" className="h-full" spacing={2}>
        <Grid item xs={12} md={5} >
      <Typography className="text-login">User Name</Typography>
      <FormControl required className="w-full">
        <TextField
          className=" rounded-lg textfield"
          disableUnderline={true}
          name="name"
          autoComplete="name"
          onFocus={()=>setstate({...state,emailError:true})}
          variant="outlined"
          helperText = {state.emailError && !re.test(state.email) && 'Email is not valid'}
          error = {state.emailError && !re.test(state.email)}
          type = "email"
          onChange = {e => setstate({...state,email:e.target.value})}
        />
      </FormControl>
      <Typography className="text-login pt-12">Password</Typography>
      <FormControl required className="w-full">
        <TextField
          className=" rounded-lg textfield"
          disableUnderline={true}
          onFocus={()=> setstate({...state,passwordError:true})}
          helperText = {state.passwordError && state.password.length < 5  && 'Password must be 5 chars'}
          error = {state.passwordError && state.password.length < 5}
          name="password"
          onChange={(e) => setstate({ ...state, password:e.target.value })}
          value={state.password}
          autoComplete="password"
          variant ="outlined"
          type="password"
          InputProps={{
            endAdornment: <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => setstate({ ...state, password: "" })}
              aria-label="toggle password visibility"
            >
              <CloseIcon color="secondary" fontSize="small" />
            </IconButton>
          </InputAdornment>
          }}
        />
      </FormControl>
      <Fab
        variant="extaind"
        type="submit"
        className="flex btn-login p-2 px-8 mx-auto mt-5 btn-submit"
        onClick={submit}
      >
        Login
      </Fab>
      </Grid>
      </Grid>
      </Container>
    </Box>
     :
     <Loading />
     }
    </>
  );
}
export default withRouter(Login)