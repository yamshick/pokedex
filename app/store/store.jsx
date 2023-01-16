import React, { createContext, useContext } from 'react'
import { useLocalStore } from 'mobx-react-lite'
import { pokemonRepository } from 'repositories/pokemon-repository'

const storeContext = createContext(null)

const createStore = () => ({
  isLoading: false,
  pokelist: [],
  page: 0,
  // TODO: rename count
  pageCount: 0,
  rowsPerPage: 10,
  filters: {},

  setPage (page) {
    this.page = page
    this.fetchPokelist()
  },

  async init () {
    this.isLoading = true
    await pokemonRepository.init()
    await this.fetchPokelist()
    this.isLoading = false
  },

  setRowsPerPage (rowsPerPage) { this.rowsPerPage = rowsPerPage; this.fetchPokelist() },

  async fetchPokelist () {
    this.isLoading = true
    this.pokelist = await pokemonRepository.getPokemons(this.getParams)
    this.pageCount = await pokemonRepository.getPageCount()
    this.isLoading = false
  },

  async setFilters (filters) {
    this.filters = filters
    this.page = 0
    await this.fetchPokelist()
  },

  get maxPage () {
    return this.pageCount && Math.ceil(this.pageCount / this.rowsPerPage)
  },

  get backButtonDisabled () {
    return this.isLoading || (this.page === 0)
  },

  get nextButtonDisabled () {
    return this.isLoading || (this.page + 1 >= this.maxPage)
  },

  // TODO: pokelistPar
  get getParams () {
    return {
      limit: this.rowsPerPage,
      offset: this.page * this.rowsPerPage,
      filters: this.filters
    }
  }
})

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(createStore)
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
  const store = useContext(storeContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}
