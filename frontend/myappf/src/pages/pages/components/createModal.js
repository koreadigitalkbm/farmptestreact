import { useEffect, useState } from "react";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import myAppGlobal from "../../../myAppGlobal";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CreateModal(props) {
    const handleModal = props.handleModal;
    const handleClose = props.handleClose;
    const [modalContent, setModalContent] = useState(<Typography />);


    useEffect(() => {

        let newName;

        const handleNewname = (e) => {
            newName = e.target.value
        }


        const handleConfirm = () => {
            if (newName === "" || newName === undefined) {
                setModalContent(
                    <Box sx={modalStyle}>
                        <Typography>{myAppGlobal.langT('LT_SETTING_MODAL_NOSPACEALLOW')}</Typography>
                    </Box>
                )
            } else {
                let newMyInfo = myAppGlobal.systeminformations.Systemconfg;
                console.log(newMyInfo);
                newMyInfo.name = newName;
                myAppGlobal.farmapi.setMyInfo(newMyInfo).then((ret) => {
                    if (ret) {
                      if (ret.IsOK === true) {
                        if (ret.retMessage === 'ok') {
                            setModalContent(
                                <Box sx={modalStyle}>
                                    <Typography>{myAppGlobal.langT('LT_SETTING_MODAL_CONFIRMED')}</Typography>
                                </Box>
                            )
                        } else {
                            setModalContent(
                                <Box sx={modalStyle}>
                                    <Typography>{myAppGlobal.langT('LT_SETTING_MODAL_FAILED')}</Typography>
                                </Box>
                            )
                        }
                      }
                    }
                  })
            }
        }

        setModalContent(
            <Box sx={modalStyle}>
                <Typography id="modal-changename-title" variant="h5" component="h2">
                    {myAppGlobal.langT('LT_SETTING_MODAL_CHAGENAME')}
                </Typography>
                <Stack alignItems='center' direction='row' justifyContent='space-between' sx={{ mt: 6 }}>
                    <Typography id="modal-changename-Ecurrentname" variant="h6">
                        {myAppGlobal.langT('LT_SETTING_MODAL_CURRENTNAME')}
                    </Typography>
                    <Typography id="modal-changename-currentname">
                        {myAppGlobal.systeminformations.Systemconfg.name}
                    </Typography>
                </Stack>

                <TextField
                    required
                    fullWidth
                    id={'newName'}
                    label={myAppGlobal.langT('LT_SETTING_MODAL_NEWNAME_LABEL')}
                    type='text'
                    variant="standard"
                    onChange={handleNewname}
                    sx={{
                        mt: 2,
                        mb: 3,
                        '& .MuiInputBase-input': {
                            border: 0
                        }
                    }} />
                <Button onClick={handleConfirm}>{myAppGlobal.langT('LT_SETTING_MODAL_CONFIRM')}</Button>
                <Button onClick={handleClose}>{myAppGlobal.langT('LT_SETTING_MODAL_CANCEL')}</Button>
            </Box>
        )


    }, [handleModal, handleClose])

    return (
        <Modal
            open={handleModal}
            onClose={handleClose}
            aria-labelledby="modal-configure-title"
            aria-describedby="modal-configure-description"
        >
            {modalContent}
        </Modal>
    )
}