import React, { useState, useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import { fade, makeStyles } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

export const NameFilter = observer(() => {
  const [searchText, setSearchText] = useState('')
  const store = useStore()

  const onChange = event => {
    const value = event.target.value
    setSearchText(value)
  }

  useEffect(() => {
    const filterPokemonsBySubstring = async () => { await store.setFilters({ ...store.filters, searchText }) }
    filterPokemonsBySubstring()
  }, [searchText])

  const classes = useStyles()

  return (<div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder="Search "
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput
      }}
      inputProps={{ 'aria-label': 'search' }}
      onChange={onChange}
    />
  </div>
  )
})
