import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: '#fff',
  },
}));

export default function SimpleBackdrop() {
  const classes = useStyles();
  

  return (
    <div>
      <Backdrop className={classes.backdrop} open={true} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
