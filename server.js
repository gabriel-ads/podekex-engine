import { fastify } from 'fastify'

const server = fastify()

server.listen({
  port: process.env.PORT || 3333,
})

server.get('/', async () => {
  const pokemonList = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=1017',
  )

  const parsedPokemonList = await pokemonList.json()

  const pokemons = parsedPokemonList.results.map(async ({ url }) => {
    const pokemon = await fetch(url)
    return await pokemon.json()
  })

  return Promise.all(pokemons).then((values) => {
    return values.map(({ name, sprites, types, id }) => {
      const type = types.map(({ type }) => {
        return type.name
      })

      return {
        name,
        image: sprites.other['official-artwork'].front_default,
        type,
        id,
      }
    })
  })
})
