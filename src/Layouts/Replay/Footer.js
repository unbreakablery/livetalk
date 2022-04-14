import React from 'react'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack'
import { withRouter, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { secs2min } from '../../Components/utils/sec2min'
import './Footer.scss'


const Footer = (props) => {
    const stateR = useSelector(state => state.states)
    const { participant_name, seminar_id } = useParams()
    return (
        <div className="footer-wrapper">
            <footer>
                <Button color="primary" className="" startIcon={<ArrowBackwardIcon />} onClick={() => props.history.goBack()}>Back</Button>
                <div className="duration">{stateR.data && secs2min(parseInt(stateR.data.metadata.duration))}</div>
                <Button color="primary" className="" startIcon={<ArrowForwardIcon />} onClick={() => props.history.push({ pathname: `/congratulations/${seminar_id}/${participant_name}` })}>Next</Button>
            </footer>
        </div>
    )
}

export default withRouter(Footer)
