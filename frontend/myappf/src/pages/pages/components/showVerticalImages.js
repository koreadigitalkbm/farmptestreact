import {Card, CardHeader, ImageList, ImageListItem, ImageListItemBar }  from '@mui/material';

export default function ShowVerticalImages(props) {
    
    const imageSet = props.imageSet;
    
    return (
        <Card sx={{ width: 1000, minWidth: 300, m: 3, p: 1, backgroundColor: '#eceff1' }}>
            <CardHeader title={'식물이미지'} />
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