import React from "react";
import Logo from "../../assets/img/logo.png";
import {TableCell,TableContainer,TableHead,TableRow,Fab,TableBody,Table,Button} from '@material-ui/core';
import {Link} from "react-router-dom";
import download from '../../assets/img/download-icon2.png'
import fusee from '../../assets/img/fusee.png'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/Cancel';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import {Services}  from '../../Components/services/Services'
import { useSelector } from 'react-redux'
import { login } from '../../redux/actions'

function createData(first_name,last_name,email,language,gender,date_added) {
  return { first_name,last_name,email,language,gender,date_added };
}

export default function Individual() {
  //--- Start State Declaration -----------------------------------
  const [state, setstate] = React.useState({
    checkHover: "",
    selectedRows: "",
    rowId: ""
  });
  const stateR = useSelector(state => state.states);
  const [rows, setRows] = React.useState([])
  //--- End State Declaration -------------------------------------
  
  React.useEffect(() => {
    getRows();

  }, [])

const changeDateFormat = (date) =>{
  const pointIndex = [3,5];
  const formattedDate = date.split('-')[0].split('').map( (e,i) => pointIndex.includes(i) ? e+'.' : e ).join('').split('.').reverse().join('.')
  return formattedDate;
}

const getRows = () => {
  fetch('http://test-api.endpoints.talk-speech.cloud.goog/user/individuals', {
          headers : {'x-access-tokens' : stateR.login}
        })
          .then(response=>response.json())
          .then(rows=>  {
            let participants = rows.data.participants.map( p => Object.assign(p, {date_added: changeDateFormat(rows.data.date), _id: rows.data._id}))
            setRows(participants)
          })
          .catch(err=> console.log('unable to get participants rows'))
}

const onClickRow = (row,index) => () => {
  if (row.analysis_id == -1) {
    setstate({
      ...state,
      selectedRows: index,
      rowId: row._id
    });
  }else{
    return
  }
    
};

const mouseIn = (prop)=> ()=>{
    setstate({...state, checkHover:state.checkHover === prop ? "" : prop})
}
const mouseOut = ()=>{
  setstate({...state, checkHover: ""})
}

  return (
    <div className="start-now flex justify-center items-center flex-col">
      <div className="container">
        <div className="log-section">
          <img src={Logo} width={110} alt="Logo" className="mx-auto" />
        </div>
             <Link to="/form" className="float-right mb-3">
              <Fab variant="extended" color="default" className="btn-download px-3">
              <img src={download} alt="dowload" width="15" className="mr-3" />
              Add new speaker
              </Fab>
              </Link>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="text-white">First Name</TableCell>
                <TableCell className="text-white">Last Name</TableCell>
                <TableCell className="text-white">E-mail</TableCell>
                <TableCell className="text-white">Language</TableCell>
                <TableCell className="text-white">Gender</TableCell>
                <TableCell className="text-white">Date Added</TableCell>
                <TableCell className="text-white"></TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row,i) => (

                <>
                  <TableRow className={`relative table-main ${state.selectedRows === i &&
                            "selected-row text-dark"}`} key={row.first_name} 
                            onMouseEnter={mouseIn(i)} onMouseLeave ={mouseOut} onClick={onClickRow(row,i)} >
                        <TableCell className="text-white">{row.first_name}</TableCell>
                        <TableCell className="text-white">{row.last_name}</TableCell>
                        <TableCell className="text-white">{row.email}</TableCell>
                        <TableCell className="text-white">{row.language}</TableCell>
                        <TableCell className="text-white">{row.gender}</TableCell>
                        <TableCell className="text-white">{row.date_added}</TableCell>
                        <TableCell className="text-white" style={{width:'20rem'}}></TableCell>
                        {state.checkHover === i && row.analysis_id != -1 &&
                        <TableCell className="text-white absolute border-0 items-center" style={{right:0}}  align="right">
                           <Fab variant="extended" className="btn-del mr-2" color="primary"><img src={download} alt="dowload" width="15" className="mr-3"/>Download</Fab>
                           <Fab variant="extended" className="btn-del" color="primary"><PlayCircleFilledIcon fontSize="small" className="mr-3"/>Replay</Fab>
                           <Fab variant="extended" className="btn-pre" color="defalult"><CancelIcon fontSize="small" className="mr-3"/> Delete</Fab>
                        </TableCell>
                      }
                  
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center button-bottom">
             <Link to={state.selectedRows ? `/dashboard/${state.rowId}/${state.selectedRows}` : ''} className="">
              <Fab variant="extended" color="default" className="btn-start-now mt-14 px-5">
              <img src={fusee} alt="fuse" width="22" className="mr-5" />
              Start now !
              </Fab>
              </Link></div>
      </div>
      <Button className="down-arrow text-white">
        <ArrowBackIcon fontSize="small"/>
      </Button>
    </div>
  );
}