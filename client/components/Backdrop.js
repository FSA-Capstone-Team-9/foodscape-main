import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableTextMobileStepper from './MobileStepper';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function SimpleBackdrop() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="tutorial">
      <Button variant="outlined" color="primary" onClick={handleToggle}>
        Tutorial
      </Button>

      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <SwipeableTextMobileStepper />
      </Backdrop>
    </div>
  );
}
