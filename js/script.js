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
const modalAlbum = modalBody.querySelector('.modal-list .modal-list-album p');
const modalRating = modalBody.querySelector('.modal-list .modal-list-rating div');

closeModal.addEventListener('click', function() {
    modal.classList.remove('open-modal');
});

document.querySelector('.search-form').addEventListener('submit', function(ev) {
    ev.preventDefault();
    resultHeader.innerHTML = "";
    resultList.innerHTML = "";
    if (inputSearch.value === "" || !inputSearch.value.replace(/\s/g, '').length) {
        resultHeader.textContent = "Your query is incorrect";
    } else {
        let term = inputSearch.value.split(" ").join("+");
        getBySearch(typeSearch.value, term, displayTitleList, 0);
    }
});