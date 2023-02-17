import {Box, Button, Card, Stack, Typography} from '@mui/material'

export default function DataVisualization(props) {
    return (
        <Card sx={{ width: 1000, minWidth: 300, m: 3, p: 1, backgroundColor: '#eceff1' }}>
            <Box>
                        <Button>확장</Button>
                        <Button>Export</Button>

                    </Box>
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