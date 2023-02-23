import React, { useState } from "react";
import { Box, IconButton, Typography, Card, CardHeader, Checkbox, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar } from "@mui/material";

import AddchartIcon from "@mui/icons-material/Addchart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const columns = [
  { id: "date", label: "Date", minWidth: 10 },
  { id: "type", label: "Type", minWidth: 10 },
  { id: "content", label: "Contents", minWidth: 100 },
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
  const rows = props.dataSet;
  const isdashpage = props.isdash;

  console.log("------------------------EventListView-------------------- ");

  if (rows.length <= 0) {
    return (
      <Typography variant="body2" fontSize="large" color="secondary">
        이벤트 데이터가 없습니다.
      </Typography>
    );
  }

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

  function isdatapage() {
    if (isdashpage == true) {
      return null;
    }

    return (
      <React.Fragment>
        <IconButton aria-label="fingerprint" color="secondary">
          <AddchartIcon />
        </IconButton>
        <IconButton aria-label="AddchartIcon" color="secondary">
          <FileDownloadIcon />
        </IconButton>
      </React.Fragment>
    );
  }

  return (
    <Card sx={{ minWidth: 100, backgroundColor: "#eceff1" }}>
      
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow key="row1">
                <TableCell align="left" colSpan={3} sx={{ backgroundColor: "#eceff1" }}>
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["system"].checked} name={"system"} key="s1" onChange={handleChange} />} label="시스템" />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["device"].checked} name={"device"} key="s2" onChange={handleChange} />} label="구동장비" />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["autocontrol"].checked} key="s3" name={"autocontrol"} onChange={handleChange} />} label="자동제어" />
                  <FormControlLabel sx={{ flex: "1 1 100%" }} control={<Checkbox checked={chboxlist["etc"].checked} key="s4" name={"etc"} onChange={handleChange} />} label="기타" />

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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
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
                    {columns.map((column,index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={"evtkey"+index} align={column.align}>
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
    </Card>
  );
}
