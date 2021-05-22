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
const modalTitle = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(1) p');
const modalTitleLength = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(2) p');
const modalArtist = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(3) p');
const modalGenres = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(4) p');
const modalAlbum = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(5) p');
const modalRating = modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(6) p');

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