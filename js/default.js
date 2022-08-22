// Função responsável pela conexão com a API e retorno do pokémon escolhido.
const pokeAPI = async (pokeId) => {
    let p = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
        .then(
            (response) => response.json()
        )
    return p;
}

// Função responsável por renderizar as informações do pokémon.
const renderPokemon = async (pokeId) => {
    let p_img = document.querySelector(".pokemon > img:first-child");
    let p_info = document.querySelector(".pokemon_info > p:first-child");

    p_info.innerHTML = "Loading...";

    await pokeAPI(pokeId)
        .then(
            (p) => {
                setPoke(JSON.stringify(p));
                if (!p_img.classList.contains("shiny")) {

                    p_img.setAttribute(
                        "src",
                        p['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
                    );
                }
                else {
                    p_img.setAttribute(
                        "src",
                        p['sprites']['versions']['generation-v']['black-white']['animated']['front_shiny']
                    );
                }
                p_info.innerHTML = p['id'] + ' - ' + p['name'];
            }
        )
        .catch(
            (err) => p_info.innerHTML = "not found"
        );
}
const setPoke = (pokeInfo) => sessionStorage.setItem('pokeCurrent', pokeInfo);

const getPoke = () => sessionStorage.getItem('pokeCurrent');

const getCurrentId = () => {
    let p = JSON.parse(getPoke());
    return p['id'];
}

// Controle para saber em qual pokémon está.
renderPokemon(1);

document.querySelector(".form form").addEventListener("submit", (event) => {
    event.preventDefault();
    let p_name = document.getElementById("p_name");
    renderPokemon(p_name.value.toLowerCase());
});

document.getElementById('dex_prev').addEventListener("click", (event) => {
    event.preventDefault();
    if (parseInt(getCurrentId()) - 1 > 0) {
        renderPokemon(parseInt(getCurrentId()) - 1);
    }
})

document.getElementById('dex_next').addEventListener("click", (event) => {
    event.preventDefault();
    renderPokemon(parseInt(getCurrentId()) + 1)
        .catch((err) => {
            renderPokemon(1);
        })
})

document.getElementById('dex_shiny').addEventListener("click", (event) => {
    event.preventDefault();
    let p_info = JSON.parse(getPoke());
    let p_img = document.querySelector(".pokemon > img:first-child");
    try {
        if (p_img.classList.contains('shiny')) {
            p_img.classList.toggle('shiny')
            p_img.setAttribute(
                "src",
                p_info['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
            );
        }
        else {
            p_img.classList.toggle('shiny')
            p_img.setAttribute(
                "src",
                p_info['sprites']['versions']['generation-v']['black-white']['animated']['front_shiny']
            );
        }
    }
    catch (err) {
        console.error("Não foi possível realizar esta ação.")
    }
})