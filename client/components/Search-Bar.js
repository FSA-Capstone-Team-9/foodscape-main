import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 600,
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
}));

export default function SearchBar() {
  const classes = useStyles();

  const [searchTerms, setSearchTerms] = useState('')
  const [location, setLocation] = useState('')

  async function handleSubmit(event){
      event.preventDefault()
      console.log('handleSubmit on form', searchTerms, location)
      try {
            const result = await axios.get(
              `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              location)}.json?access_token=${process.env.MAPBOX_TOKEN}`
            );
            // console log prints --> [longitude,latitude]
            console.log(result.data.features[0].center);
            


          } catch (error) {
            console.log(error);
          }
  }

  return (
    <Paper component="form" className={classes.root}>
      <h3>Cuisine</h3>
      <InputBase
        className={classes.input}
        placeholder="Food Type"
        inputProps={{ 'aria-label': 'Food Type' }}
        value={searchTerms}
        onChange={event => setSearchTerms(event.target.value)}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <h3>At</h3>
      <InputBase
        className={classes.input}
        placeholder="Location"
        inputProps={{ 'aria-label': 'Location' }}
        value={location}
        onChange={event => setLocation(event.target.value)}
      />
      <IconButton onClick={handleSubmit}
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
