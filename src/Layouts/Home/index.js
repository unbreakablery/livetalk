import React from "react";
import { Typography } from "@material-ui/core/";
import Fab from "@material-ui/core/Fab";
import download from "../../assets/img/download-icon.png";
import add from "../../assets/img/Group.png";
import Logo from "../../assets/img/logo_.png";
import { Link } from "react-router-dom";
export default function index() {
  return (
    <>
      {/* start Wrapper */}
      <div className="main-wrapper">
        <img src={Logo} className="logo" alt="Logo" />
        <div className="grid grid-cols-2 h-full">
          {/* Left Side */}
          <div className="left">
            <div className="inner">
              <Link to="/masterclass">
                <Fab variant="extended" color="secondary" className="btn pr-10">
                  <img src={download} className="mr-8" alt="download" />{" "}
                  MasterClass
                </Fab>
              </Link>
              <Typography component="p" className="text-white mt-3">
                Download a new file to generate
              </Typography>
              <Typography component="p" className="text-white mt-1">
                performances one after the other
              </Typography>
            </div>
          </div>
          {/* Right Side */}
          <div className="right">
            <div className="inner">
              <Link to="/individual">
                <Fab variant="extended" color="primary" className="btn pr-10">
                  <img src={add} className="mr-10" alt="download" /> Individual
                </Fab>
              </Link>
              <Typography component="p" className="mt-3 text-black">
                Register a single speaker and launch
              </Typography>
              <Typography component="p" className="mt-1">
                a performance
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
