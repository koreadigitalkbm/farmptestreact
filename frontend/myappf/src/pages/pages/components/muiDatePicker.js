import { forwardRef } from 'react';
import { Button } from '@mui/material';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { ko, enUS } from 'date-fns/locale';

import {useState} from 'react';

import "react-datepicker/dist/react-datepicker.css"

const supportLanguage = [
    { locale: 'ko', format: 'yyyy년 MM월 dd일' },
    { locale: 'enUS', format: 'MM/dd/yyyy' }
]

registerLocale('ko', ko);
registerLocale('enUS', enUS);
setDefaultLocale('ko');

const MuiCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref}>{value}</Button>
));

export default function MuiCustomDatePicker(props) {

    const oneDay = 86400000;
    const targetDate = Date.now();
    const [period, setPeriod] = useState([targetDate - (oneDay * 7), targetDate]);
    const [startDate, endDate] = period;

    const form = props.props;
    const mode = form.mode;
    const locale = form.locale;
    const selected = new Date(form.selected);
    const handleDatePicker = form.handleDatePicker;
    const dateformat = supportLanguage.find(e => e.locale === locale)

    const handlePeriodpicker = (p) => {
        setPeriod(p)

        if(p[1] !== null) {
            handleDatePicker(p);
        }
    }

    if (mode === "date") {
        return (
            <DatePicker
                customInput={<MuiCustomInput />}
                dateFormat={dateformat.format}
                locale={locale}
                onChange={(date) => handleDatePicker(date)}
                selected={selected}
            />
        )
    } else if (mode === "period") {
        return (
            <DatePicker
                customInput={<MuiCustomInput />}
                dateFormat={dateformat.format}
                endDate={endDate}
                locale={locale}
                onChange={(period) => {handlePeriodpicker(period)}}
                selectsRange={true}
                startDate={startDate}
            />
        )
    }

}