import React from "react";
import Logo from "../../assets/img/logo.png";
import {
  Collapse,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  TableBody,
  Table,
  Button,
}
  from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { withRouter } from "react-router-dom";
import download from "../../assets/img/download-icon2.png";
import fusee from "../../assets/img/fusee.png";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import { Services } from "../../Components/services/Services";
import Loading from "../loading/Loading";
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../redux/actions'
import { onExpire } from '../../redux/actions'



function ListSeminar(props) {
  const [state, setstate] = React.useState({
    matchId: "",
    checkHover: "",
    selectedRows: "",
    data: "",
    loading: true,
    participants: null,
    error2: '',
    hidden: false
  });
  const stateR = useSelector(state => state.states);

  const openDownloadWindow = function(seminar_id, analysis_id, participant_name) {
    window.open(`/dashboard/report/${seminar_id}/${analysis_id}/${participant_name}`, '_blank', 'location=no,menubar=no,status=no,width=1230,height=980')
  }

  const dispatch = useDispatch();
  const printError = (val) => dispatch(onExpire(val))
  const addClass = (prop) => () => {
    const endpoint = `/user/seminar/participants?seminar_id=${prop._id}`;
    if (state.matchId !== prop) {
      Services.servicesGet(endpoint, stateR.login).then((res) => {
        setstate({
          ...state,
          participants: res.data,
          matchId: prop,
          checkHover: "",
        });
      }).catch(function (error) {
        error &&
          setstate({ ...state, error: error.response.data.message, loading: false })
        localStorage.removeItem('token');
        props.history.push('./login');
        dispatch(login(null), onExpire(error.response.data.message))
        printError(error.response.data.message)
      })
    } else {
      setstate({
        ...state,
        matchId: "",
        checkHover: "",
        error: ''
      });
    }
  };

  const mouseIn = (prop) => () => {
    setstate({ ...state, checkHover: state.checkHover === prop ? "" : prop });
  };
  const mouseOut = () => {
    setstate({ ...state, checkHover: "" });
  };
  const onClickRow = (prop) => () => {
    setstate({
      ...state,
      selectedRows: state.selectedRows._id === prop._id ? "" : prop._id,
    });
  };

  const onDelete = (prop) => () => {
    setstate({ ...state, loading: true });
    Services.deleteSeminar(`/user/seminar?seminar_id=${prop}`, stateR.login).then((res) =>
      Services.servicesGet("/user/seminars", stateR.login).then((res) =>
        setstate({ ...state, data: res.data, loading: false })
      )
    ).catch(function (error) {
      error &&
        setstate({ ...state, error: error.response.data.message, loading: false })
      localStorage.removeItem('token');
      props.history.push('./login');
      dispatch(login(null));
      printError(error.response.data.message);

    });
  };

  React.useEffect(() => {
    Services.servicesGet("/user/seminars", stateR.login).then((res) =>
      setstate({ ...state, data: res.data, loading: false })
    ).catch(function (error) {
      error.response &&
        setstate({ ...state, error: error.response.data.message, loading: false })
      localStorage.removeItem('token');
      props.history.push('./login');
      dispatch(login(null));
      printError(error.response.data.message);
    })


  }, []);

  const upload = async (e) => {
    setstate({ ...state, loading: true });
    const endpoint = "/user/seminar";
    var myHeaders = new Headers();
    myHeaders.append(
      "x-access-tokens",
      stateR.login
    );

    var formdata = new FormData();
    formdata.append("file", e.target.files[0], e.target.files[0].name);
    formdata.append("title", e.target.files[0].name);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    Services.createSeminar(requestOptions, endpoint)
      .then((result) => {
        Services.servicesGet("/user/seminars", stateR.login).then((res) =>
          setstate({ ...state, data: res.data, loading: false })
        );
      })
      .catch(function (error) {
        error &&
          setstate({ ...state, error: error.response.data.message, loading: false })
        localStorage.removeItem('token');
        props.history.push('./login');
        dispatch(login(null));
        printError(error.response.data.message);

      })
  };

  const onClickStart = () => {
    props.history.push({
      pathname: "/list",
      search: state.selectedRows,
    });
  };

  return (
    <>
      {!state.loading ? (
        <div className="start-now flex justify-center items-center flex-col">
          <div className="container">
            <div className="log-section">
              <img src={Logo} width={110} alt="Logo" className="mx-auto" />
            </div>
            <input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="file-upload"
              id="contained-button-file"
              multiple
              type="file"
              onChange={upload}
            />
            <label htmlFor="contained-button-file" className="float-right mb-3">
              <Fab
                variant="extended"
                color="default"
                className="btn-download px-3"
                type="button"
                component="span"
              >
                <img src={download} alt="dowload" width="15" className="mr-3" />
                Download new file
              </Fab>
            </label>
            <div className="clear-both"></div>

            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell className="text-white text-xs">
                      Files Imported
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      Date Added
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.data &&
                    state.data.map((row, i) => (
                      <>
                        <TableRow
                          className={`relative table-main ${state.selectedRows === row._id &&
                            "selected-row text-dark"
                            }`}
                          key={row._id}
                          onMouseEnter={mouseIn(i)}
                          onMouseLeave={mouseOut}
                        >
                          {/* <TableCell colSpan={3} className="p-0">
                    <Table>
                      <TableRow> */}
                          <TableCell
                            onClick={onClickRow(row)}
                            className="text-white p-3"
                          >
                            {row.title}
                          </TableCell>
                          <TableCell
                            onClick={onClickRow(row)}
                            className="text-white p-3"
                          >
                            {`${new Date(
                              row.date.slice(0, 4),
                              parseInt(row.date.slice(4, 6)) - 1,
                              row.date.slice(6, 8)
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })} at ${row.date.slice(9, 11)}:${row.date.slice(
                              11,
                              13
                            )}`}
                          </TableCell>
                          {state.checkHover === i ? (
                            <TableCell
                              className="text-white absolute border-0 p-3"
                              style={{ right: 0 }}
                              align="right"
                            >
                              <Fab
                                variant="extended"
                                className="btn-del"
                                color="primary"
                                onClick={onDelete(row._id)}
                              >
                                <CancelIcon fontSize="small" className="mr-3" />{" "}
                                Delete
                              </Fab>
                              <Fab
                                variant="extended"
                                onClick={addClass(row)}
                                className="btn-pre"
                                color="defalult"
                              >
                                <VisibilityIcon
                                  fontSize="small"
                                  className="mr-3"
                                />{" "}
                                Preview
                              </Fab>
                            </TableCell>
                          ) : (
                              <TableCell
                                className="text-white absolute border-0 p-3"
                                style={{ right: 0 }}
                                align="right"
                              >
                                <AddCircleIcon
                                  className="cursor-pointer"
                                  fontSize="small"
                                />
                              </TableCell>
                            )}
                        </TableRow>
                        <TableRow className="border-0 detail-data">
                          <TableCell
                            className="text-white border-0 p-0"
                            colSpan={3}
                          >
                            <Collapse
                              in={state.matchId === row}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Table className="border-0 table-main">
                                {state.participants &&
                                  state.participants.map((val, i) => (
                                    <TableRow>
                                      <TableCell className="text-white p-3">
                                        {i + 1}
                                      </TableCell>
                                      <TableCell className="text-white p-3">
                                        {val.first_name}
                                      </TableCell>
                                      <TableCell className="text-white p-3">
                                        {val.last_name}
                                      </TableCell>
                                      <TableCell className="text-white p-3">
                                        {val.email}
                                      </TableCell>
                                      <TableCell className="text-white p-3">
                                        {val.gender}
                                      </TableCell>
                                      <TableCell className="text-white opacity-0 p-3">
                                        contact@haleneportier.com
                                      </TableCell>
                                      {
                                        parseInt(val.analysis_id) !== -1 &&
                                        <TableCell
                                          className="text-white absolute border-0 p-3"
                                          style={{ right: 0 }}
                                          align="right"
                                        >
                                          <Fab
                                            variant="extended"
                                            className="btn-del mr-2"
                                            color="primary"
                                            onClick={() => openDownloadWindow(row._id, val.analysis_id, val.first_name + " " + val.last_name)}
                                          >
                                            <img
                                              src={download}
                                              alt="dowload"
                                              width="15"
                                              className="mr-3"
                                            />{" "}
                                          Download
                                        </Fab>
                                          <Fab
                                            variant="extended"
                                            className="btn-del"
                                            color="primary"
                                            onClick={() => { props.history.push({ pathname: `/dashboard/feedback/${row._id}/${val.analysis_id}/${val.first_name} ${val.last_name}` }) }}
                                          >
                                            <PlayCircleFilledWhiteIcon
                                              fontSize="small"
                                              className="mr-3"
                                            />{" "}
                                          Replay
                                        </Fab>
                                        </TableCell>
                                      }

                                    </TableRow>
                                  ))}
                              </Table>
                            </Collapse>

                            {/* </TableCell> */}
                            {/* </TableRow>   
                    </Table> */}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="text-center button-bottom">
              <Fab
                variant="extended"
                color="default"
                onClick={onClickStart}
                disabled={state.selectedRows.length === 0}
                className="btn-start-now mt-12 px-5"
              >
                <img src={fusee} alt="fuse" width="22" className="mr-5" />
                Start now !
              </Fab>
            </div>
          </div>
          <Button className="down-arrow text-white" onClick={() => { props.history.push({ pathname: '/' }) }}>
            <ArrowBackIcon fontSize="small" />
          </Button>
        </div>
      ) : (
          <Loading />
        )}
    </>
  );
}

export default withRouter(ListSeminar);
