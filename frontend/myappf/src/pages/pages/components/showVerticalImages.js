import {Card, CardHeader, ImageList, ImageListItem, ImageListItemBar,Typography }  from '@mui/material';

export default function ShowVerticalImages(props) {
    
    const imageSet = props.imageSet;
    
    if(imageSet.length<=0)
    {
        return (
            <Typography variant="body2" fontSize="large" color="secondary">
                      사진 데이터가 없습니다.
                    </Typography>
          );

        
    }
    
    return (
        <Card sx={{ width:window.innerWidth,   backgroundColor: '#eceff1' }}>
            
            <ImageList sx={{
                maxHeight: 300,
                gridAutoFlow: "column",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr)) !important",
                gridAutoColumns: "minmax(300px, 1fr)"
            }}>
                {imageSet.map((item) => (
                    <ImageListItem key={item.img}>
                        <img src={`${item.img}`} srcSet={`${item.img}`} alt={item.title} loading='lazy' />
                        <ImageListItemBar
                            title={item.title}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Card>
    )
}