import React from 'react'
import Button from '@material-ui/core/Button'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import fullScreenIcon from '../../assets/img/Group 6.png'


export default function FullScreenTogglers({ isFullScreen, setIsFullScreen, handle }) {
    return (
        isFullScreen ?
            <Button className="fullscreen-button" variant="contained" onClick={() => {
                handle.exit()
                setIsFullScreen(false)
            }}><FullscreenExitIcon /></Button>
            :
            <Button className="fullscreen-button" variant="contained" onClick={() => {
                handle.enter()
                setIsFullScreen(true)
            }}><img src={fullScreenIcon} /></Button>


    )
} 