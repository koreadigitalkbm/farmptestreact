import {Box, Button, Card, Stack, Typography} from '@mui/material'

export default function DataVisualization(props) {
    return (
        <Card sx={{ width: 1000, minWidth: 300, m: 3, p: 1, backgroundColor: '#eceff1' }}>
            <Stack alignItems='center' direction={'row'} justifyContent='center' spacing={3}>
                <Button>＜시작날짜</Button>
                <Typography>날짜범위<br />표시공간</Typography>
                <Button>종료날짜＞</Button>
                <Box>
                    <Button>확장</Button>
                    <Button>Export</Button>

                </Box>
            </Stack>
            <Stack direction='row' spacing={3}>
                <Box width='35em' height='20em' sx={{ backgroundColor: 'black' }}></Box>
                <Stack spacing={3}>
                    <Typography>추가할 센서를 선택하세요</Typography>
                    <Box sx={{ backgroundColor: 'black' }}>
                        <Typography sx={{ color: 'white' }}>Gilad Gray</Typography>
                        <Typography sx={{ color: 'white' }}>Jason Killian</Typography>
                        <Typography sx={{ color: 'white' }}>Antonie Llorca</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Card>
    )
}