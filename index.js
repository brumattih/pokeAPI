const axios = require('axios')
const user = require('readline-sync')
var fs = require('fs')
const pokemon = new Object()

function menu() {
    console.log('--------------------------ESCOLHA--------------------------')
    console.log('Insira "A" para saber mais sobre um Pokemon')
    console.log('Insira "B" para saber mais sobre uma habilidade')
    console.log('Insira "C" para saber mais sobre um tipo')
    console.log('Insira "POKEDEX" para exibir a pokedex local')
    console.log('Insira "Z" para encerrar o programa')

    choice = user.question("Escolha : ").toUpperCase().trim()
}

function displayPoke() {
    const idNamePokemon = user.question('Digite o nome do Pokemon ou sua ID da Pokedex: ').trim().toLowerCase()

    axios.get(`https://pokeapi.co/api/v2/pokemon/${idNamePokemon}`)
        .then(result => {
            const name = result.data.name

            const typeList = result.data.types
            const types = typeList.map((type) => {
                return type.type.name
            })

            const abilityList = result.data.abilities
            const abilities = abilityList.map((ability) => {
                return ability.ability.name
            })

            console.log(`Nome: ${name},\nTipo(s): ${types.join(' / ')},\nHabilidades: ${abilities.join(' / ')}\n`)

            localPokedex = user.question("Digite 'S' para salver o Pokémon em sua Pokédex Local ou 'N' para encerrar o programa: ").toUpperCase().trim()

            if (localPokedex === "S") {            
                pokemon.name = name
                pokemon.type = types
                pokemon.abilities = abilities

                const pokemonToString = JSON.stringify(pokemon)
                var filePath = 'data/localPokedex.json'
                fs.writeFileSync(filePath, pokemonToString)

            } else if (localPokedex === "N") {
                process.exit()
            } else {
                console.log("Opção inválida")
            }

        })
        .catch(error => {
            console.log(error, 'Pokémon inválido!')
        })

}

function pokedex() {
    const readPokemon = fs.readFileSync('data/localPokedex.json')
    const pokemons = JSON.parse(readPokemon)

    console.log(pokemons)
}

function displayAbility() {
    const idNameAbility = user.question('Digite o nome da habilidade (ex: blaze, synchronize etc): ').trim().toLowerCase()

    axios.get(`https://pokeapi.co/api/v2/ability/${idNameAbility}`)
        .then(result => {
            const abilityName = result.data.effect_entries[0].effect

            console.log(abilityName)
        })
        .catch(error => {
            console.log('Habilidade inválida!')
        })
}

function displayType() {
    const idNameType = user.question('Digite o nome do tipo (ex: poison, fire etc): ').trim().toLowerCase()

    axios.get(`https://pokeapi.co/api/v2/type/${idNameType}`)
        .then(result => {
            const noDamageList = result.data.damage_relations.no_damage_to
            const noDamage = noDamageList.map((no_damage) => {
                return no_damage.name
            })

            const halfDamageList = result.data.damage_relations.half_damage_to
            const halfDamage = halfDamageList.map((half_damage) => {
                return half_damage.name
            })

            const doubleDamageList = result.data.damage_relations.double_damage_to
            const doubleDamage = doubleDamageList.map((double_damage) => {
                return double_damage.name
            })

            console.log(`O tipo ${idNameType}:\nNão causa dano para o(s) tipo(s): ${noDamage}\nCausa metade de dano para o(s) tipo(s): ${halfDamage}\nCausa o dobro de dano para o(s) tipo(s): ${doubleDamage}`)
        })
        .catch(error => {
            console.log('Tipo inválido!')
        })
}


console.clear()
menu()

if (choice === "A") {
    console.clear()
    displayPoke()

} else if (choice === "B") {
    console.clear()
    displayAbility()

} else if (choice === "C") {
    console.clear()
    displayType()

} else if (choice === "POKEDEX") {
    console.clear()
    pokedex()

} else if (choice === "Z") {
    process.exit()

} else {
    console.log("Opção inválida")

}