import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"

// for alert
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"

// autocomplete
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"

import axios from "axios"

export const useStyles = makeStyles(theme => ({
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 600,
        margin: 5,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}))

export default function SearchBar(props) {
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    const notificationTimer = 4000 // ms

    const classes = useStyles()

    const [inputValue, setInputValue] = useState("")
    const [value, setValue] = useState("")
    const [searchTerms, setSearchTerms] = useState("")
    const [location, setLocation] = useState("")
    const [open, setOpen] = useState(false)
    const [results, setResults] = useState([])
    const [choice, setChoice] = useState(0)

    const badSearch = () => {
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setOpen(false)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const result = await axios.get(
                `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    location
                )}.json?access_token=${process.env.MAPBOX_TOKEN}&country=us`
            )
            console.log("Mapbox Geolocate API results -->", result)
            let coordinates = []
            if (choice === undefined) {
                coordinates = result.data.features[0].center // [longitude,latitude]
            } else {
                coordinates = result.data.features[choice].center // [longitude,latitude]
            }
            props.handleSearchSubmit(coordinates, searchTerms)
        } catch (error) {
            badSearch()
            console.log(error)
        }
    }
    async function onSearchChange(event) {
        setLocation(event.target.value)
        try {
            const result = await axios.get(
                `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    location
                )}.json?access_token=${process.env.MAPBOX_TOKEN}&country=us`
            )
            setResults(result.data.features)
        } catch (error) {}
    }

    return (
        <React.Fragment>
            <Paper component="form" className={classes.root}>
                {/* <h3>Cuisine</h3> */}
                <TextField
                    className={classes.input}
                    placeholder="Cuisine/Food Type"
                    inputProps={{ "aria-label": "Food Type" }}
                    // variant="outlined"
                    // margin="normal"
                    value={searchTerms}
                    onChange={event => setSearchTerms(event.target.value)}
                />
                {/* <Divider className={classes.divider} orientation="vertical" /> */}
                {/* <h3>At</h3> */}
                <Autocomplete
                    freeSolo
                    className={classes.input}
                    id="location"
                    disableClearable
                    options={results.map((results, index) => {
                        return results.place_name
                    })}
                    value={value}
                    onChange={(event, newValue) => {
                        setChoice(event.target.dataset.optionIndex)
                        setValue(newValue)
                        setLocation(newValue)
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        onSearchChange(event)
                        setInputValue(newInputValue)
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            placeholder="Location"
                            // label="Search input"
                            value={location}
                            // margin="normal"
                            // variant="outlined"
                            required={true}
                            InputProps={{
                                ...params.InputProps,
                                type: "search",
                            }}
                        />
                    )}
                />

                <IconButton
                    onClick={handleSubmit}
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
            <Snackbar
                open={open}
                autoHideDuration={notificationTimer}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="warning">
                    We couldn't find the the location you were looking for.
                    Please try again!
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}
