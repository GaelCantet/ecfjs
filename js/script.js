//INITIALISATION ITERATEURS
let i;
let j;

//BOUTON DE RETOUR EN HAUT DE PAGE
const toTopBtn = document.querySelector('.to-top');

//SEARCH FORM
const inputSearch = document.getElementById('search-input');
const typeSearch = document.getElementById('type-input');
const previousQueryBtn = document.querySelector('.previous-query');
const queriesHistory = [];
let previousQuery = [];
//RESULT LIST
const resultHeader = document.querySelector('.result-header .container');
const resultList = document.getElementById('search-result');


//MODALE
const modal = document.querySelector('.modal');
const modalHeader = modal.querySelector('.modal-header-title');
const modalBody = modal.querySelector('.modal-body');
const closeModalBtn = modal.querySelector('header button');
const modalTitle = modalBody.querySelector('.modal-list .modal-list-title p');
const modalYoutube = modalBody.querySelector('.youtube-link');
const modalTitleLength = modalBody.querySelector('.modal-list .modal-list-length p');
const modalArtist = modalBody.querySelector('.modal-list .modal-list-artist p');
const modalGenres = modalBody.querySelector('.modal-list .modal-list-genres p');
const modalSuggestions = modalBody.querySelector('.modal-list .modal-list-suggestions p');
const modalRating = modalBody.querySelector('.modal-list .modal-list-rating div');
const albumsContainer = modal.querySelector('.albums-container');


//EVENT AU CLICK SUR LA FERMETURE DE LA MODALE
closeModalBtn.addEventListener('click', closeModal);

function closeModal() {
    document.body.classList.remove('no-scroll');
    //On fermeture de la modale
    modal.classList.remove('open-modal');
    //On remet le background-size du rating à 0
    modalRating.style.backgroundSize = 0;
    //On vide les suggestions
    modalSuggestions.innerHTML = "";
    //On vide les genres
    modalGenres.innerHTML = "";
}


//EVENT A LA VALIDATION DU FORMAULAIRE DE RECHERCHE
document.querySelector('.search-form').addEventListener('submit', function(ev) {
    ev.preventDefault();

    //Si le champ de recherche est vide ou uniquement composé d'espaces, on affiche un message d'erreur
    if (inputSearch.value === "" || !inputSearch.value.replace(/\s/g, '').length) {
        resultHeader.textContent = "Your query is incorrect";
    } else { 
        submitRequest(typeSearch.value, inputSearch.value);
    }
});

//VIDE LA LISTE DE RESULTATS, TRAITE LA CHAINE DE CARACTERES ET APPELLE LA FONCTION DE REQUETE
function submitRequest(type, term) {
    //On vide la liste de résultats et son header
    resultHeader.innerHTML = "";
    resultList.innerHTML = "";

    //On traite l'input.value sous la forme: ("chaine de caractères" || (chaine && de && caractères))
    term = '("' + term + '" || (' + term.split(" ").join(" && ") + '))';

    //Puis on encode le résultat et on appelle la requête
    term = encodeURIComponent(term);
    getBySearch(type, term, displayTitleList, 0);

    //On ajoute la query à queriesHistory et on gère l'affichage de previousQueryBtn
    queriesHistory.push([type, term]);
    if (queriesHistory.length > 1) {
        previousQueryBtn.style.display = "flex";
    } else {
        previousQueryBtn.style.display = "none";
    }
}

//EVENT DE QUERY PRECEDENTE
previousQueryBtn.addEventListener('click', function() {
    queriesHistory.pop();//On supprime la dernière query de l'hitorique
    previousQuery = queriesHistory.pop();//On relance la recherche précédente et on la supprime de l'historique
    submitRequest(previousQuery[0], previousQuery[1]);

    //On affiche la query originale dans le search-form
    previousQuery[1] = decodeURIComponent(previousQuery[1]).match(/(".+"){1}/);
    typeSearch.value = previousQuery[0];
    inputSearch.value = previousQuery[1];
});

//EVENT D'APPARITION DU BOUTTON TO-TOP AU SCROLL
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 600) { //Si on scroll au délà de 600px du haut de page
        toTopBtn.classList.remove('to-top-hide');
        toTopBtn.classList.add('to-top-show');
    } else { //Sinon
        toTopBtn.classList.remove('to-top-show');
        toTopBtn.classList.add('to-top-hide');
    }
});

//EVENT DE RETOUR EN HAUT DE PAGE
toTopBtn.addEventListener('click', function() {
    window.scrollTo(0, 0);
});