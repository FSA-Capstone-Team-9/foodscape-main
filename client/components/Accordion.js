import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Button from "@material-ui/core/Button"

import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
const useStyles = makeStyles(theme => ({
    root: {
        width: "50%",
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

    const handleChange = event => {
        setValue(event.target.value)
        props.onChange(`restaurants-${event.target.value}`)
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
                    {/* <Button onClick={() => props.onChange("restaurants-1")}>
                        Filter 1
                    </Button>

                    <Button>Filter 2</Button> */}

                    {/* Radio */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Tests</FormLabel>
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
                                value="2"
                                control={<Radio />}
                                label="Version 2"
                            />
                            <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="Version 3"
                            />
                        </RadioGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
