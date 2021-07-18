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
}))

export default function SimpleAccordion(props) {
    const classes = useStyles()
    const [value, setValue] = React.useState("1")
    const [prices, setPrices] = React.useState(() => [])

    const handleChange = event => {
        setValue(event.target.value)
        props.onChange(`restaurants-${event.target.value}`)
    }

    const handlePriceOptions = (event, newPrices) => {
        setPrices(newPrices)
        props.onPriceChange(newPrices)
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
                <AccordionDetails>
                    <FormControl component="fieldset">
                        <FormLabel component="legend"></FormLabel>
                        <RadioGroup
                            aria-label="tests"
                            name="tests"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="Version 1"
                            />
                            <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="Version 3"
                            />
                        </RadioGroup>
                    </FormControl>
                    <ToggleButtonGroup
                        label="Price"
                        aria-label="text alignment"
                        value={prices}
                        onChange={handlePriceOptions}
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
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
