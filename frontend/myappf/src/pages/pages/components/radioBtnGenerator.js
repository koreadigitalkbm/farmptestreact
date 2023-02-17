import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
export default function RadioBtnGenerator(props) {
    const form = props.props;
    const id = form.id;
    const label = form.label;
    const value = form.defaultValue;
    const selectOptions = form.selectOptions;
    const onChange = form.onChange;

    return (
        <FormControl>
            <FormLabel id={id + "-label"}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={id + "-label"}
                name={id + "-name"}
                value={value}
                onChange={onChange}
            >
                {selectOptions.map((option) => (
                    <FormControlLabel value={option} label={option} control={<Radio />} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

