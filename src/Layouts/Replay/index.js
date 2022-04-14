import React, {Fragment, useState} from "react"
import { withRouter } from "react-router-dom";
import VideoPlayer from './VideoPlayer'
import Footer from './Footer'

function Replay (props) {
    return(
        <Fragment>
            <VideoPlayer />
            <Footer />
        </Fragment>
    )
}

export default withRouter(Replay)