import {Card, CardHeader, ImageList, ImageListItem, ImageListItemBar,Typography }  from '@mui/material';

export default function ShowVerticalImages(props) {
    
    const imageSet = props.imageSet;
    let imgtitle="식물 사진입니다.";
    if(imageSet.length<=0)
    {
        imgtitle="사진 데이터가 없습니다.";
    }
    
    return (
        <Card sx={{ width:1000,   maxWidth: '100%',  backgroundColor: '#eceff1' }}>
            <CardHeader title={<Typography variant="body2" fontSize="large" color="secondary">{imgtitle}</Typography>} />
            <ImageList sx={{
                gridAutoFlow: "column",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr)) !important",
                gridAutoColumns: "minmax(200px, 1fr)"
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