//ITERATEURS
let i;
let j;

//INITIALISATION VARIABLES
let title;
let titleId;
let artist;
let album;
let albumId;
let genreId;
let titleLength;
let count;
let recordings;

//SEARCH FORM
const inputSearch = document.getElementById('search-input');
const typeSearch = document.getElementById('type-input');
//RESULT LIST
const resultHeader = document.querySelector('.result-header .container');
const resultList = document.getElementById('search-result');
//MODAL
const modal = document.querySelector('.modal');
const modalHeader = modal.querySelector('.modal-header-title');
const modalBody = modal.querySelector('.modal-body');
const closeModal = modal.querySelector('header button');
const modalTitle = modalBody.querySelector('.modal-list .modal-list-title p');
const modalTitleLength = modalBody.querySelector('.modal-list .modal-list-length p');
const modalArtist = modalBody.querySelector('.modal-list .modal-list-artist p');
const modalGenres = modalBody.querySelector('.modal-list .modal-list-genres p');
const modalAlbum = modalBody.querySelector('.modal-list .album-list');
const modalRating = modalBody.querySelector('.modal-list .modal-list-rating div');
const modalFooterMessage = modal.querySelector('.modal-footer-message');
const coverArtsContainer = modal.querySelector('.cover-arts');

//EVENT AU CLICK SUR LA FERMETURE DE LA MODALE
closeModal.addEventListener('click', function() {
    document.body.classList.remove('no-scroll');
    //On fermeture de la modale
    modal.classList.remove('open-modal');
    //On supprime la liste d'albums
    modalAlbum.innerHTML = "";
    //On supprime les cover arts
    coverArtsContainer.innerHTML = "";
    //On supprime le message du footer
    modalFooterMessage.textContent = "";
});

//EVENT A LA VALIDATION DU FORMAULAIRE DE RECHERCHE
document.querySelector('.search-form').addEventListener('submit', function(ev) {
    ev.preventDefault();
    //On vide la liste de résultats et son header
    resultHeader.innerHTML = "";
    resultList.innerHTML = "";
    //Si le champ de recherche est vide ou uniquement composé d'espaces, on affiche un message d'erreur
    if (inputSearch.value === "" || !inputSearch.value.replace(/\s/g, '').length) {
        resultHeader.textContent = "Your query is incorrect";
    } else { //Sinon on remplace les espaces de la chaine de caractères par des "+" pour optimiser la recherche et on lance la requête
        let term = inputSearch.value.split(" ").join("+");
        getBySearch(typeSearch.value, term, displayTitleList, 0);
    }
});