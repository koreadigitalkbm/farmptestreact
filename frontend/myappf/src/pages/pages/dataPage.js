import { useEffect, useState } from 'react';
import { Box, Button, Card, CardHeader, Checkbox, FormControlLabel, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, ThemeProvider, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { Delete, FilterList } from '@mui/icons-material';
import muiTheme from '../muiTheme';
import PropTypes from 'prop-types';

import img1 from './testImage/img1.png'
import img2 from './testImage/img2.jpg'
import img3 from './testImage/img3.jpg'
import img4 from './testImage/img4.png'
import img5 from './testImage/img5.jpg'
import img6 from './testImage/img6.jpg'


export default function DataPage(props) {
    const today = new Date();
    const [startTargetDate, setstartTargetDate] = useState();
    const [endTargetDate, setEndTargetDate] = useState(today.getFullYear() + "." + today.getMonth() + "." + today.getDay());
    const [testImageSet, setTestImageSet] = useState([{ img: img1, title: '채소1' }, { img: img2, title: '채소2' }, { img: img3, title: '채소3' }, { img: img4, title: '버거1' }, { img: img5, title: '버거2' }, { img: img6, title: '버거3' }]);

    function createData(date, type, content) {
        return {
            date,
            type,
            content,
        };
    }

    function tableType(type) {
        switch (type) {
            case 'sys': return '시스템'
            case 'acd': return '구동장비'
            case 'atc': return '자동제어'
            case 'etc': return '기타'
            default: return '미분류'
        }
    }

    const rows = [
        createData(endTargetDate, tableType('atc'), '펌프 켬'),
        createData(endTargetDate, tableType('sys'), '목표치보다 수위가 낮음.'),
        createData(endTargetDate, tableType('acd'), 'LED 켬'),
        createData(endTargetDate, tableType('etc'), '물을 보충하는 날.'),
        createData(endTargetDate, tableType('etc'), '기기 온도가 높음.'),
        createData(endTargetDate, tableType('atc'), '히터 끔'),
        createData(endTargetDate, tableType('sys'), '목표치보다 온도가 높음'),
        createData(endTargetDate, tableType('sys'), '목표치보다 습도가 높음'),
        createData(endTargetDate, tableType('sys'), '목표치보다 ph가 높음'),
        createData(endTargetDate, tableType('etc'), '영양제를 보충하는 날.'),
        createData(endTargetDate, tableType('sys'), '목표치보다 수위가 높음.'),
        createData(endTargetDate, tableType('sys'), '목표치보다 EC가 높음'),
        createData(endTargetDate, tableType('acd'), 'LED 끔'),
        createData(endTargetDate, tableType('sys'), '점검 받음.'),
        createData(endTargetDate, tableType('atc'), '펌프 세기 낮춤'),
        createData(endTargetDate, tableType('sys'), '목표치보다 유속이 빠름.'),
        createData(endTargetDate, tableType('etc'), '펌프 청소하는 날.'),
    ]

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const headCells = [
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: '날짜',
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: '분류',
        },
        {
            id: 'content',
            numeric: false,
            disablePadding: false,
            label: '내용',
        },
    ];

    function EnhancedTableHead(props) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
            props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {

        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    function EnhancedTableToolbar(props) {
        const { numSelected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >

                <FormControlLabel sx={{ flex: '1 1 100%' }} control={<Checkbox defaultChecked />} label="시스템" />
                <FormControlLabel sx={{ flex: '1 1 100%' }} control={<Checkbox />} label="구동장비" />
                <FormControlLabel sx={{ flex: '1 1 100%' }} control={<Checkbox defaultChecked />} label="자동제어" />
                <FormControlLabel sx={{ flex: '1 1 100%' }} control={<Checkbox />} label="기타" />
            </Toolbar>
        );
    }

    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };

    function EnhancedTable() {
        const [order, setOrder] = useState('asc');
        const [orderBy, setOrderBy] = useState('calories');
        const [selected, setSelected] = useState([]);
        const [page, setPage] = useState(0);
        const [dense, setDense] = useState(false);
        const [rowsPerPage, setRowsPerPage] = useState(5);

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        };

        const handleSelectAllClick = (event) => {
            if (event.target.checked) {
                const newSelected = rows.map((n) => n.name);
                setSelected(newSelected);
                return;
            }
            setSelected([]);
        };

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleChangeDense = (event) => {
            setDense(event.target.checked);
        };

        const isSelected = (name) => selected.indexOf(name) !== -1;

        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =
            page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

        return (
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort(getComparator(order, orderBy))
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.content);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={row.content}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.date}
                                                </TableCell>
                                                <TableCell align="right">{row.type}</TableCell>
                                                <TableCell align="right">{row.content}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Box>
        );
    }

    function EventSystem(props) {
        const [checkEventCategory, setCheckEventCategory] = useState();

        return (
            <Card sx={{ width: 1000, minWidth: 300, m: 3, p: 1, backgroundColor: '#eceff1' }}>
                <CardHeader title={'시스템이벤트'} />
                <Box>
                    <Stack direction='row'>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="시스템" />
                        <FormControlLabel control={<Checkbox />} label="구동장비" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="자동제어" />
                        <FormControlLabel control={<Checkbox />} label="기타" />
                    </Stack>
                </Box>
                <EnhancedTable />
            </Card>
        )
    }

    function PlantImages(props) {
        return (
            <Card sx={{ width: 1000, minWidth: 300, m: 3, p: 1, backgroundColor: '#eceff1' }}>
                <CardHeader title={'식물이미지'} />
                <ImageList sx={{
                    gridAutoFlow: "column",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr)) !important",
                    gridAutoColumns: "minmax(200px, 1fr)"
                }}>
                    {testImageSet.map((item) => (
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

    function DataVisualization(props) {
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

    useEffect(() => {
        setstartTargetDate(Date);
    })
    return (
        <ThemeProvider theme={muiTheme}>
            <DataVisualization />
            <PlantImages />
            <EventSystem />
        </ThemeProvider>
    )
}