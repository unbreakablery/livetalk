import React from 'react';
// material imports 
import { Button, Box, List, ListItem, ListItemText, Fab, Grid } from '@material-ui/core';
// material icons
import { ArrowBack, ArrowForward } from '@material-ui/icons'
// Images imports
import Logo from "../../assets/img/logo.png";
import fusee from '../../assets/img/fusee.png'
import congrat from '../../assets/img/congrat.png'
import { withRouter, Link, useParams } from "react-router-dom";
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import bgVideo from '../../assets/video/theatre-audience-clapping.mp4'
import '../list/list.scss'


// ListData
// const ListData = [
//   { name: "Richard Christen", },
//   { name: "Martine Geronimon", },
//   { name: "Claire Marcacci", },
//   { name: "Pascal Tardy", },
//   { name: "Albert Uvrier", },
//   { name: "Monique Veronneau", },
// ]

let clicked = false;

function WaitingList(props) {
  const stateR = useSelector(state => state.states);
  const [state, setstate] = React.useState({
    loading: true,
    participant: "",
    select: "",
    data: []
  })

  let { seminar_id, participant_name } = useParams();


  React.useEffect(() => {
    setstate({
        loading: false
    });
  }, [state.loading])

  const addClass = (prop) => () => {
    setstate({ ...state, select: prop })
    console.log(state.select)
  }

  return (
    <>
      {
        state.loading ?
          <Loading />
          :
          <div className="list-page flex justify-center items-center flex-col">
            <div className="shadow" />
            <video autoPlay muted loop id="bdVideo" style={{ position: "fixed", right: 0, bottom: 0, minWidth: "100%", minHeight: "100%", zIndex: -999 }}>
              <source src={bgVideo} />
            </video>
            <div className="container">
              <div className="log-section">
                <img  onClick={() => { props.history.push({ pathname: "/" })}} src={Logo} width={110} alt="Logo" className="mx-auto" />
              </div>

              {/* List card starts */}
              <Grid container justify="center" alignItems="center" >
                <Grid item md={7} justify="center" alignItems="center" className="list-wrapper">
                  <Box justify="center" alignItems="center" textAlign="center" style={{fontSize: "40px"}}>
                    Congratulations {participant_name} !
                  </Box>
                  <Box justify="center" alignItems="center" textAlign="center">
                    <img className="pt-5 pb-5" src={congrat} alt="congrat" width="50" style={{margin: "auto"}} />
                  </Box>
                  
                </Grid>
              </Grid>
              {/* List card ends */}
            </div>

            {/* back to start button */}
            <div className="text-center button-bottom-list">
              <Link to={seminar_id & seminar_id !== 'undefined'? '/list?' + seminar_id : '/masterclass'}>
                <Fab variant="extended" color="default" className="btn-start-now px-5">
                <ArrowBack fontSize="medium" className="mr-2"/>
                Back to start
              </Fab>
              </Link></div>
             {/* navigate back button */}
             <Button className="down-arrow text-white" onClick={() => { props.history.goBack(); } }>
              <ArrowBack fontSize="small" />
            </Button>
          </div>
      }
    </>
  )
}

export default withRouter(WaitingList)