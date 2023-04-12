import React, { useState } from "react";
import { IconButton, Card, CardHeader, Box, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import myAppGlobal from "../../../myAppGlobal";
import AddchartIcon from "@mui/icons-material/Addchart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";

export default function ShowVerticalImages(props) {
  const [bzoomout, setZoommax] = useState(false);
  const imageSet = props.imageSet;

  if (imageSet.length <= 0) {
    return (
      <Typography variant="body2" fontSize="large" color="secondary">
        {myAppGlobal.langT("LT_DATAPAGE_NOPHOTODATA")}
      </Typography>
    );
  }

  const zoomtoggle = () => {
    setZoommax(!bzoomout);
  };

  const imglistbyzoom = () => {
    if (bzoomout === true) {
      return (
        <ImageList
          sx={{
            maxHeight: 320,
            gridAutoFlow: "column",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr)) !important",
            gridAutoColumns: "minmax(320px, 1fr)",
          }}
        >
          {imageSet.map((item) => (
            <ImageListItem key={item.img}>
              <img src={`${item.img}`} srcSet={`${item.img}`} alt={item.title} loading="lazy" />
              <ImageListItemBar title={item.title} />
            </ImageListItem>
          ))}
        </ImageList>
      );
    } else {
      return (
        <ImageList
          sx={{
            maxHeight: 640,
            gridAutoFlow: "column",
            gridTemplateColumns: "repeat(auto-fit, minmax(640px,1fr)) !important",
            gridAutoColumns: "minmax(640px, 1fr)",
          }}
        >
          {imageSet.map((item) => (
            <ImageListItem key={item.img}>
              <img src={`${item.img}`} srcSet={`${item.img}`} alt={item.title} loading="lazy" />
              <ImageListItemBar title={item.title} />
            </ImageListItem>
          ))}
        </ImageList>
      );
    }
  };

  return (
    <Box sx={{ backgroundColor: "#eceff1" }}>
      <IconButton onClick={zoomtoggle} color="primary">
        {bzoomout ? <ZoomOutMapIcon /> : <ZoomInMapIcon />}
      </IconButton>
      <IconButton color="primary">
        {" "}
        <FileDownloadIcon />{" "}
      </IconButton>
      {imglistbyzoom()}
    </Box>
  );
}
