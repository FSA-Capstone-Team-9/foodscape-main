import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Slider from "@material-ui/core/Slider"
import Divider from "@material-ui/core/Divider"
import { Switch } from "@material-ui/core"
const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        margin: 5,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    optionsOne: {
        display: "flex",
        flexDirection: "row",
    },
    prices: {
        height: "50%",
    },
}))

const marks = [
    {
        value: 0,
        label: "0",
    },
    {
        value: 0.5,
        label: "0.5",
    },
    {
        value: 1,
        label: "1.0",
    },
    {
        value: 1.5,
        label: "1.5",
    },
    {
        value: 2.0,
        label: "2.0",
    },
    {
        value: 2.5,
        label: "2.5",
    },
    {
        value: 3.0,
        label: "3.0",
    },
    {
        value: 3.5,
        label: "3.5",
    },
    {
        value: 4.0,
        label: "4.0",
    },
    {
        value: 4.5,
        label: "4.5",
    },
    {
        value: 5.0,
        label: "5.0",
    },
]

function valuetext(value) {
    return `${value}`
}
export default function SimpleAccordion(props) {
    const classes = useStyles()
    const [value, setValue] = React.useState("3")
    const [prices, setPrices] = React.useState(() => [])
    const [rating, setRating] = React.useState([2.5, 5])

    const handleChange = event => {
        setValue(event.target.value)
        props.onChange(`restaurants-${event.target.value}`)
    }

    const handlePriceOptions = (event, newPrices) => {
        setPrices(newPrices)
        props.onPriceChange(newPrices)
    }
    const handleRatingOptions = (event, newRating) => {
        setRating(newRating)
        props.onRatingChange(newRating)
    }
    return (
        <div className={classes.root} style={{ zIndex: "10" }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Filters</Typography>
                </AccordionSummary>
                <AccordionDetails
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className={classes.optionsOne}>
                        <div>
                            <Typography
                                gutterBottom
                                style={{
                                    textDecoration: "underline",
                                }}
                            >
                                Visualizations
                            </Typography>
                            <FormControl component="fieldset">
                                <FormLabel component="legend"></FormLabel>
                                <RadioGroup
                                    aria-label="tests"
                                    name="tests"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="3"
                                        control={<Radio />}
                                        label="Default"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="Alternate"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Divider
                            orientation="vertical"
                            flexItem
                            style={{ marginLeft: "20px", marginRight: "20px" }}
                        />
                        <div style={{}}>
                            <Typography
                                gutterBottom
                                style={{
                                    marginLeft: "20px",
                                    textDecoration: "underline",
                                }}
                            >
                                Price
                            </Typography>
                            <ToggleButtonGroup
                                label="Price"
                                aria-label="text alignment"
                                value={prices}
                                onChange={handlePriceOptions}
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "20px",
                                    marginRight: "20px",
                                    height: "55%",
                                    alignSelf: "center",
                                }}
                            >
                                <ToggleButton value="1" aria-label="$">
                                    $
                                </ToggleButton>
                                <ToggleButton value="2" aria-label="$$">
                                    $$
                                </ToggleButton>
                                <ToggleButton value="3" aria-label="$$$">
                                    $$$
                                </ToggleButton>
                                <ToggleButton value="4" aria-label="$$$$">
                                    $$$$
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <Typography
                            id="discrete-slider-custom"
                            gutterBottom
                            style={{
                                textDecoration: "underline",
                                alignSelf: "center",
                            }}
                        >
                            Rating
                        </Typography>
                        <Slider
                            value={rating}
                            aria-labelledby="range-slider"
                            onChange={handleRatingOptions}
                            defaultValue={0}
                            getAriaValueText={valuetext}
                            // aria-labelledby="discrete-slider-custom"
                            step={0.5}
                            valueLabelDisplay="auto"
                            marks={marks}
                            max={5}
                            style={{
                                marginBottom: "20px",
                            }}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
