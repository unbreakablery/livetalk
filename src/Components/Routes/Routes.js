
import React from "react";
import Home from '../../Layouts/Home'
import ListSeminar from '../../Layouts/listseminar/ListSeminar'
import Individual from '../../Layouts/Individual/Individual'
import Form from '../../Layouts/form/Form'
import List from '../../Layouts/list/List'
import Loader from '../../Layouts/Loader/Loader'
import Loader2 from '../../Layouts/loader2/Loader'
import Dashboard from '../../Layouts/dashboard/Dashboard'
import Listalreadyplay from '../../Layouts/listalreadyplayed/List-already-play'
import Feedback from '../../Layouts/feedback/Feedback'
import Login from '../../Layouts/login/Login'
import Replay from '../../Layouts/Replay'
import Report from '../../Layouts/report/Report'
import Congratulations from '../../Layouts/congratulations/Congratulations'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import { Slide } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { onExpire } from '../../redux/actions'

function Routes({ history }) {
  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push('/login')
    }
  }, [])
  const dispatch = useDispatch();
  const stateR = useSelector(state => state.states);
  if (stateR.error) {
    setTimeout(() => {
      dispatch(onExpire(null))
    }, 3000);
  }

  return (
    <>
      <Slide direction="down" in={stateR.error} mountOnEnter unmountOnExit>
        <Alert severity="error" className="expire-alert">
          {stateR.message}
        </Alert>
      </Slide>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/masterclass">
          <ListSeminar />
        </Route>
        <Route path="/individual">
          <Individual />
        </Route>
        <Route path="/form">
          <Form />
        </Route>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/Listalreadyplay">
          <Listalreadyplay />
        </Route>
        <Route path="/loader">
          <Loader />
        </Route>
        <Route path="/loader2">
          <Loader2 />
        </Route>
        <Route path="/dashboard/feedback/:seminar_id/:analysis_id/:participant_name">
          <Feedback />
        </Route>
        <Route path="/dashboard/report/:seminar_id/:analysis_id/:participant_name">
          <Report />
        </Route>
        <Route path="/dashboard/:seminar_id/:participant_index">
          <Dashboard />
        </Route>
        <Route path="/replay/:analysis_id/:participant_name">
          <Replay />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/congratulations/:seminar_id/:participant_name">
          <Congratulations />
        </Route>
      </Switch>
    </>

  );
}
export default withRouter(Routes)