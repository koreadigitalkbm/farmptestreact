import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function AlertDialog(props) {
    
    
    const mparams = props.params;
    let open =false;
    let message ;
    let handleClose;
    let atype="success";
    let attitle="Sucess";
    if(mparams != null)
    {
         message = mparams.message;
        handleClose = mparams.onClose;
        open=(message ==null)? false:true;
        atype = mparams.type;
        attitle=mparams.title;
    }
    
    

    
  
    

  return (
    <div>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
         <Alert severity={atype}>
        <AlertTitle>{attitle}</AlertTitle>
        {message}
      </Alert>

     
        
        <DialogActions>
          
          <Button onClick={handleClose} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
