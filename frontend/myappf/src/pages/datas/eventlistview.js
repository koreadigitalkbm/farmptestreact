import React, { useState } from "react";
import { IconButton, Typography,Box,  Checkbox, FormControlLabel, Paper,Modal, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from "@mui/material";


import FileDownloadIcon from "@mui/icons-material/FileDownload";
import myAppGlobal from "../../myAppGlobal";
import ChartDataUtil from "./datautil";

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
let columns = [
  { id: "date", label: 'date', minWidth: 10 },
  { id: "type", label: 'type', minWidth: 10 },
  { id: "content", label: 'content', minWidth: 100 },
];

let chboxlist = {
  system: { checked: true },
  device: { checked: true },
  autocontrol: { checked: true },
  etc: { checked: true },
};

export default function EventListView(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [bcheckeds, setCheckeds] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [successSave, setSuccessSave] = useState(false);


  const rows = props.dataSet;
  const isdashpage = props.isdash;

  console.log("------------------------EventListView-------------------- ");

  if (rows.length <= 0) {
    return (
      <Typography variant="body2" fontSize="large" color="secondary">
        {myAppGlobal.langT('LT_MAINPAGE_MAIN_EVENT_NODATA')}
      </Typography>
    );
  }

  columns[0].label = myAppGlobal.langT('LT_DATAPAGE_EVENT_DATE');
  columns[1].label = myAppGlobal.langT('LT_DATAPAGE_EVENT_TYPE');
  columns[2].label = myAppGlobal.langT('LT_DATAPAGE_EVENT_CONTENT');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event) => {
    console.log("------------------------handleChange--------------------event : " + event.target.name + ",ch:" + event.target.checked);
    chboxlist[event.target.name].checked = event.target.checked;

    //그냥 화면 갱신
    setCheckeds(!bcheckeds);
  };


  const makexlsxlog = () => {
    
    ChartDataUtil.MakexlsxforLogs(rows,  handleOpenModal, setSuccessSave);
  }



  function isdatapage() {
    if (isdashpage == true) {
      return null;
    }

    return (
      <React.Fragment>
        
        
        <Tooltip title={myAppGlobal.langT('LT_DATAPAGE_LOG_DOWNLOAD')}>
          <IconButton onClick={makexlsxlog} aria-label="AddchartIcon" color="secondary">
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

  const modalMessage = (td) => {
    if (successSave) {
      if (td == 't') {
        return (myAppGlobal.langT("LT_DATAPAGE_CHART_SAVESUCCESS_MODALTITLE"))
      } else if (td == 'd') {
        return (myAppGlobal.langT("LT_DATAPAGE_CHART_SAVESUCCESS_MODALDESCRIPTION"))
      }
    } else {
      if (td == 't') {
        return (myAppGlobal.langT("LT_DATAPAGE_CHART_SAVEFAIL_MODALTITLE"))
      } else if (td == 'd') {
        return (myAppGlobal.langT("LT_DATAPAGE_CHART_SAVEFAIL_MODALDESCRIPTION_LOG"))
      }
    }
  }


  return (
    <Box sx={{m:0, backgroundColor: "#eceff1" }}>

<Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-makexlsx-title"
              aria-describedby="modal-makexlsx-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-makexlsx-title" variant="h6" component="h2">
                  {modalMessage('t')}
                </Typography>
                <Typography id="modal-makexlsx-description" sx={{ mt: 2 }}>
                  {modalMessage('d')}
                </Typography>
              </Box>
            </Modal>


      <Paper sx={{ m:0, width: "100%" }}>
        <TableContainer sx={{ maxHeight: 640}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow key="row1">
                <TableCell align="left" colSpan={3} sx={{ backgroundColor: "#eceff1" }}>
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["system"].checked} name={"system"} key="s1" onChange={handleChange} />} label={myAppGlobal.langT('LT_MAINPAGE_MAIN_EVENT_SYSTEM')} />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["device"].checked} name={"device"} key="s2" onChange={handleChange} />} label={myAppGlobal.langT('LT_MAINPAGE_MAIN_EVENT_ACTUATOR')} />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["autocontrol"].checked} key="s3" name={"autocontrol"} onChange={handleChange} />} label={myAppGlobal.langT('LT_MAINPAGE_MAIN_EVENT_AUTO')} />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["etc"].checked} key="s4" name={"etc"} onChange={handleChange} />} label={myAppGlobal.langT('LT_MAINPAGE_MAIN_EVENT_ETC')} />

                  {isdatapage()}
                </TableCell>
              </TableRow>
              <TableRow key="row2">
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ top: 57, minWidth: column.minWidth }} sx={{ backgroundColor: "#fce4ec" }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                if (row["type"] == 1 && chboxlist["system"].checked == false) {
                  return null;
                }
                if (row["type"] == 2 && chboxlist["device"].checked == false) {
                  return null;
                }
                if (row["type"] == 3 && chboxlist["autocontrol"].checked == false) {
                  return null;
                }
                if (row["type"] > 3 && chboxlist["etc"].checked == false) {
                  return null;
                }

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={"rowkey" + index}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={"evtkey" + index} align={column.align}>
                          {column.format && typeof value === "number" ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[1000, 10000]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Paper>
    </Box>
  );
}
