const axios = require('axios')
const user = require('readline-sync')
var fs = require('fs')
const pokemon = new Object()
const pokemonList = []


function menu() {
    console.log('--------------------------ESCOLHA--------------------------')
    console.log('Insira "A" para saber mais sobre um Pokemon')
    console.log('Insira "B" para saber mais sobre uma habilidade')
    console.log('Insira "C" para saber mais sobre um tipo')
    console.log('Insira "POKEDEX" para exibir a pokedex local')
    console.log('Insira "Z" para encerrar o programa')

    choice = user.question("Escolha : ").toUpperCase().trim()

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
        console.log("Opção inválida\n")
        menu()    
    }
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


                const readPokemon = fs.readFileSync('data/localPokedex.json')
                //Verificando se a lista está cheia ou vazia
                if (readPokemon.length > 0) {
                    const pokemonList = JSON.parse(readPokemon)
                    pokemonList.push(pokemon)

                    const pokemonToString = JSON.stringify(pokemonList)
                    var filePath = 'data/localPokedex.json'
                    fs.writeFileSync(filePath, pokemonToString)

                    console.log("Pokémon salvo com sucesso!")
                    menu()
                } else {
                    pokemonList.push(pokemon)

                    const pokemonToString = JSON.stringify(pokemonList)
                    var filePath = 'data/localPokedex.json'
                    fs.writeFileSync(filePath, pokemonToString)

                    console.log("Pokémon salvo com sucesso!")
                    menu()
                }

            } else if (localPokedex === "N") {
                process.exit()
            } else {
                console.log("Opção inválida. Reiniciando o programa\n")
                menu()
                
            }

        })
        .catch(error => {
            console.log('Pokémon inválido!\n')
            menu()
        })

}

function pokedex() {
    const readPokemon = fs.readFileSync('data/localPokedex.json')
    if (readPokemon.length > 0) {
        const pokemons = JSON.parse(readPokemon)
        const pokeNames = pokemons.map((pokemon) => {
            return pokemon.name
        })
        console.log('Pokemons salvos na Pokedex:', pokeNames, '\n')
        menu()
    } else {
        console.log("Pokedex vazia!\n")
        menu()
    }

}

function displayAbility() {
    const idNameAbility = user.question('Digite o nome da habilidade (ex: blaze, synchronize etc): ').trim().toLowerCase()

    axios.get(`https://pokeapi.co/api/v2/ability/${idNameAbility}`)
        .then(result => {
            const abilityName = result.data.effect_entries[0].effect

            console.log(abilityName)
            menu()
        })
        .catch(error => {
            console.log('Habilidade inválida!\n')
            menu()
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

            console.log(`O tipo ${idNameType}:\nNão causa dano para o(s) tipo(s): ${noDamage}\nCausa metade de dano para o(s) tipo(s): ${halfDamage}\nCausa o dobro de dano para o(s) tipo(s): ${doubleDamage}\n`)
            menu()
        })
        .catch(error => {
            console.log('Tipo inválido!\n')
            menu()
        })
}

console.clear()
menu()

