import React from 'react';
// material imports 
import { Button, Box, List, ListItem, ListItemText, Fab, Grid } from '@material-ui/core';
// material icons
import { ArrowBack } from '@material-ui/icons'
// Images imports
import Logo from "../../assets/img/logo.png";
import fusee from '../../assets/img/fusee.png'
import { withRouter, Link } from "react-router-dom";
import { Services } from "../../Components/services/Services";
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import bgVideo from '../../assets/video/audience-listens-speech.mp4'
import './list.scss'

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
    participants: null,
    select: "",
    data: []
  })

  const items = React.useRef([])

  React.useEffect(() => {
    const SEARCH_QUERY = window.location.search.slice(1);
    const endpoint = `/user/seminar/participants?seminar_id=${SEARCH_QUERY}`
    Services
      .servicesGet(endpoint, stateR.login)
      .then((res) => {
        setstate({
          ...state,
          participants: res.data,
          data: res.data,
          loading: false
        });
      })
  }, [state.loading])

  const addClass = (prop) => () => {
    setstate({ ...state, select: prop })
    console.log(state.select)
  }

  const createListItems = () => state.participants && state.participants.map((value, index) => (
    parseInt(value.analysis_id) === -1 &&
    <ListItem ref={element => { items.current.push(element) }} key={index} button className={`grid grid-cols-3 p-1.5 ${index === state.select ? 'active' : ''}`} onClick={addClass(index)} >
      <span className="span ml-2">{index + 1}</span>
      <ListItemText className="text-white fontFamily col-span-2" primary={`${value.first_name} ${value.last_name} `} />
    </ListItem>
  )).filter(Boolean)

  const clickItem = () => {
    if (items.current[0] && !clicked) {
      console.log(items.current)
      console.log(!Boolean(state.select))
      items.current[0].click()
      clicked = true
    }
  }

  clickItem()

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
                <img src={Logo} width={110} alt="Logo" className="mx-auto" />
              </div>

              {/* List card starts */}
              <Grid container justify="center">
                <Grid item md={7}>
                  <Box className="list-wrapper">
                    <List className="list" component="nav" aria-label="main mailbox folders">
                      {createListItems()}
                    </List>
                  </Box>
                </Grid>
              </Grid>
              {/* List card ends */}
            </div>

            {/* Start now button */}
            <div className="text-center button-bottom-list">
              <Link to={'/dashboard/' + window.location.search.slice(1) + '/' + state.select}>
                <Fab variant="extended" color="default" className="btn-start-now px-5">
                  <img src={fusee} alt="fuse" width="22" className="mr-5" />
              Start now !
              </Fab>
              </Link></div>
            {/* navigate back button */}
            <Button className="down-arrow text-white" onClick={() => { props.history.push({ pathname: "/masterclass" }) } }>
              <ArrowBack fontSize="small" />
            </Button>
          </div>
      }
    </>
  )
}

export default withRouter(WaitingList)