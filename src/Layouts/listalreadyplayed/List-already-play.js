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
function createData(files, date) {
  return { files, date };
}
const rows = [
  createData("seminaire-pictet-20200912.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-20200912.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
  createData("seminaire-pictet-202009C12.xls", "09 Sept 2020 at 23:46"),
];

export default function Listalreadyplay() {
  const [state, setstate] = React.useState({
    matchId: "",
    checkHover: "",
    selectedRow: "",
  });
  const addClass = (prop) => () => {
    setstate({ ...state, matchId: state.matchId === prop ? "" : prop });
  };
  const mouseIn = (prop) => () => {
    setstate({ ...state, checkHover: state.checkHover === prop ? "" : prop });
  };
  const mouseOut = () => {
    setstate({ ...state, checkHover: "" });
  };
  const onClickRow = (prop) => () => {
    setstate({ ...state, selectedRow: state.selectedRow === prop ? "" : prop });
  };
  console.log(state);
  return (
    <div className="start-now">
      <div className="container">
        <div className="log-section pt-16 pb-14">
          <img src={Logo} width={110} alt="Logo" className="mx-auto" />
        </div>
        <Link to="" className="float-right mb-3">
          <Fab variant="extended" color="default" className="btn-download px-3">
            <img src={download} alt="dowload" width="15" className="mr-3" />
            Download new file
          </Fab>
        </Link>
        <TableContainer>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="text-white text-xs">
                  Files Imported
                </TableCell>
                <TableCell className="text-white text-xs">Date Added</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <>
                  <TableRow
                    className={`relative table-main ${
                      state.selectedRow === i && "bg-white text-dark"
                    }`}
                    key={row.files}
                    onMouseEnter={mouseIn(i)}
                    onMouseLeave={mouseOut}
                  >
                    {/* <TableCell colSpan={3} className="p-0">
                    <Table>
                      <TableRow> */}
                    <TableCell onClick={onClickRow(i)} className="text-white">
                      {row.files}
                    </TableCell>
                    <TableCell onClick={onClickRow(i)} className="text-white">
                      {row.date}
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
                          <VisibilityIcon fontSize="small" className="mr-3" />{" "}
                          Perview
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
                    <TableCell className="text-white border-0 p-0" colSpan={3}>
                      <Collapse
                        in={state.matchId === i}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table className="border-0 table-main">
                          <TableRow>
                            <TableCell className="text-white">1</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">2</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">3</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">4</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">5</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">6</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">7</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
                            <TableCell className="text-white opacity-0">
                              contact@haleneportier.com
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-white">8</TableCell>
                            <TableCell className="text-white">Hélène</TableCell>
                            <TableCell className="text-white">
                              Portier
                            </TableCell>
                            <TableCell className="text-white">
                              contact@heleneportier.com
                            </TableCell>
                            <TableCell className="text-white">
                              Français
                            </TableCell>
                            <TableCell className="text-white">F</TableCell>
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
        <div className="text-center pt-10 button-bottom">
          <Link to="" className="">
            <Fab
              variant="extended"
              color="default"
              className="btn-start-now px-5"
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
  );
}
