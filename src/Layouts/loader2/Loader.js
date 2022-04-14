import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withRouter } from "react-router";

function CircularProgressWithLabel(props) {
  return (
    <Box height="100vh" bgcolor="#151616">
      <Box position="relative" display="inline-flex">
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="fixed"
          display="flex"
          alignItems="center"
          justifyContent="center"
          className="progress"
        >
          <CircularProgress variant="determinate" {...props} />
        </Box>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="fixed"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" className="text-3xl text-white font-regular" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

function Loader(props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setProgress(props.progress * 100)
  }, [props.progress]);

  React.useEffect(() => {
    if (progress === 100) {
      setProgress(0)
    }
  }, [progress === 100])


  return <CircularProgressWithLabel value={progress} />;
}

export default withRouter(Loader)