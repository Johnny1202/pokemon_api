import React from 'react';
import PokemonList from './pokemonList';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='titulo'>Lista de Pokemon</h1>
      <PokemonList />
    </>
  )
}

export default App
