import React, { useState } from "react";
import { IconButton,  Box, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import myAppGlobal from "../../../myAppGlobal";
import AddchartIcon from "@mui/icons-material/Addchart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";

export default function ShowVerticalImages(props) {
  const [bzoomout, setZoommax] = useState(true);
  const imageSet = props.imageSet;

  if (imageSet.length <= 0) {
    return (
      <Typography variant="body2" fontSize="large" color="secondary">
        {myAppGlobal.langT("LT_DATAPAGE_NOPHOTODATA")}
      </Typography>
    );
  }

  

  const downloadFiles =async  () => {
      
      let urls = [];
    imageSet.forEach((imgData) => {
      urls.push(imgData.img);
      
  })

    for (const url of urls) {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = url.split('/').pop(); // 파일명을 URL에서 추출
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl); // 메모리 정리
    }
    
  };

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
      <IconButton  onClick={downloadFiles} color="primary">
        {" "}
        <FileDownloadIcon />{" "}
      </IconButton>
      {imglistbyzoom()}
    </Box>
  );
}
