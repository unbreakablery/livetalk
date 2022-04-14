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
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link } from "react-router-dom";
import download from "../../assets/img/download-icon2.png";
import fusee from "../../assets/img/fusee.png";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Services} from '../../Components/services/Services'
import Loading from "../loading/Loading";

export default function Startnow() {
  const [state, setstate] = React.useState({
    matchId: "",
    checkHover: "",
    selectedRows: [],
    data: "",
    loading: false,
  });

  const addClass = (prop) => () => {
    setstate({
      ...state,
      matchId: state.matchId === prop ? "" : prop,
      checkHover: "",
    });
  };
  const mouseIn = (prop) => () => {
    setstate({ ...state, checkHover: state.checkHover === prop ? "" : prop });
  };
  const mouseOut = () => {
    setstate({ ...state, checkHover: "" });
  };
  const onClickRow = (prop) => () => {
    
    // console.log(filtered)
    // if(!filtered.includes(true)){
    //   setstate({...state,selectedRows:[...state.selectedRows,prop]})
    // }
    // else{
    //   setstate({...state,selectedRows:[...state.selectedRows,prop]})
    // }
    
    
    // setstate({ ...state, selectedRows: state.selectedRow === prop ? "" : prop });
  };

  const onDelete = (prop) => () => {
    setstate({ ...state, loading: true });
    Services.deleteSeminar(`/user/seminar?seminar_id=${prop}`).then((res) =>
      Services.servicesGet("/user/seminars").then((res) =>
        setstate({ ...state, data: res.data, loading: false })
      )
    );
  };

  React.useEffect(() => {
    setstate({ ...state, loading: true });
    Services.servicesGet("/user/seminars").then((res) =>
      setstate({ ...state, data: res.data, loading: false })
    );
  }, []);

  const upload = async (e) => {
    setstate({ ...state, loading: true });
    const endpoint = "/user/seminar";
    var myHeaders = new Headers();
    myHeaders.append(
      "x-access-tokens",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNWZmNjAzNGVlMmZhMDcyYWJjODE3OWM5IiwiZXhwIjoxNjEwNzA5NTY2fQ.nMWbggjNNPWy-vtvUWVeBC5h4Q10sHeaNleVCFCtEzI"
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
        Services.servicesGet("/user/seminars").then((res) =>
          setstate({ ...state, data: res.data, loading: false })
        );
      })
      .catch((error) => console.log("error", error));
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
              accept="xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
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
                          className={`relative table-main ${
                            state.selectedRow === i && "selected-row text-dark"
                          }`}
                          key={row._id}
                          onMouseEnter={mouseIn(i)}
                          onMouseLeave={mouseOut}
                        >
                          {/* <TableCell colSpan={3} className="p-0">
                    <Table>
                      <TableRow> */}
                          <TableCell
                            onClick={onClickRow(i)}
                            className="text-white"
                          >
                            {row.title}
                          </TableCell>
                          <TableCell
                            onClick={onClickRow(i)}
                            className="text-white"
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
                              className="text-white absolute border-0 z-50"
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
                                onClick={addClass(i)}
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
                              className="text-white absolute border-0"
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
                              in={state.matchId === i}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Table className="border-0 table-main">
                                <TableRow>
                                  <TableCell className="text-white">
                                    1
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    2
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    3
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    4
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    5
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    6
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    7
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-white">
                                    8
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Hélène
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Portier
                                  </TableCell>
                                  <TableCell className="text-white">
                                    contact@heleneportier.com
                                  </TableCell>
                                  <TableCell className="text-white">
                                    Français
                                  </TableCell>
                                  <TableCell className="text-white">
                                    F
                                  </TableCell>
                                  <TableCell className="text-white opacity-0">
                                    contact@haleneportier.com
                                  </TableCell>
                                </TableRow>
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
              <Link to="" className="">
                <Fab
                  variant="extended"
                  color="default"
                  className="btn-start-now mt-12 px-5"
                >
                  <img src={fusee} alt="fuse" width="22" className="mr-5" />
                  Start now !
                </Fab>
              </Link>
            </div>
          </div>
          <Button className="down-arrow text-white">
            <ArrowBackIcon fontSize="small" />
          </Button>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
