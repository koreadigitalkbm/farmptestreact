import { DeviceThermostat, Opacity, Water, Waves, Scale, LocalDrink, LibraryAdd } from '@mui/icons-material'
import { colors } from '@mui/material';

function actuatorIcon(code) {
    switch (code) {
        case 0:
            return
        case 1:
            return
        case 2:
            return
        case 3:
            return
        default:
            return <LibraryAdd sx={{ fontSize: 30, color: colors.common[500] }} />
    }
}

const sensorIcon = (code) => {
    console.log('코드확인');
    console.log(code);
    switch (code) {
        case 1:
        case 7:
            console.log('온도!')
            return <DeviceThermostat sx={{ fontSize: 40, color: colors.red[500] }} />
        case 2:
            return <Opacity sx={{ fontSize: 40, color: colors.blue[500] }} />
        case 26:
            return <Water sx={{ fontSize: 40, color: colors.blue[500] }} />
        case 27:
            return <Waves sx={{ fontSize: 40, color: colors.blue[500] }} />
        case 29:
            return <Scale sx={{ fontSize: 40, color: colors.indigo[500] }} />
        case 30:
            return <LocalDrink sx={{ fontSize: 40, color: colors.blue[500] }} />
        default:
            return <LibraryAdd sx={{ fontSize: 30, color: colors.common[500] }} />
    }
}

export default function getIcon(deviceType, code) {

    switch (deviceType) {
        case 'sensor':
            console.log('센서아이콘');
            sensorIcon(code);
            break;

        case 'actuator':
            actuatorIcon(code);
            break;

        default:
            return <LibraryAdd sx={{ fontSize: 30, color: colors.common[500] }} />
    }
}