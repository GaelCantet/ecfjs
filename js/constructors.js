//Constructeur de la liste Title
function constructTitleList(title, artist, album, nb, titleLength, albumId, titleId, genreId) {
    let listItem = document.createElement('ul');
    let listItemTitle = document.createElement('li');
    listItemTitle.textContent = title;
    listItemTitle.classList.add('result-list-title');
    let listItemArtist = document.createElement('li');
    listItemArtist.textContent = artist;
    listItemArtist.classList.add('result-list-artist');
    let listItemAlbum = document.createElement('li');
    if (typeof album == 'string') {
        listItemAlbum.textContent = album;
    } else {
        listItemAlbum.textContent = album[0];
    }
    listItemAlbum.classList.add('result-list-album');
    let listItemNumber = document.createElement('li');
    listItemNumber.classList.add('result-list-number');
    let listItemBtn = document.createElement('li');
    listItemBtn.classList.add('result-list-button');
    //Pour le header de la liste
    if (nb === "#") {
        listItemNumber.textContent = nb;
        listItemBtn.textContent = titleLength.toString() + " entries";
    } else {
        listItemNumber.textContent = nb + 1;
        let listBtn = document.createElement('button');
        listBtn.textContent = "+";
        listBtn.classList.add('modal-btn', 'btn-primary');
        listBtn.addEventListener('click', function() {
            modal.classList.add('open-modal');
            displayModal(nb, title, artist, album, titleLength, albumId, titleId, genreId);
        });
        listItemBtn.appendChild(listBtn);
    }
    listItem.appendChild(listItemNumber);
    listItem.appendChild(listItemTitle);
    listItem.appendChild(listItemArtist);
    listItem.appendChild(listItemAlbum);
    listItem.appendChild(listItemBtn);
    listItem.classList.add('result-list-item');
    return listItem;
}

//Constructeur du dernier élément de la liste
function constructLastItem() {
    let lastItem = document.createElement('div');
    lastItem.setAttribute('id', 'last-item');
    return lastItem;
}

//Constructeur liste d'albums
function constructAlbumlist(albumArray) {
    for (i = 0; i < albumArray.length; i++) {
        let albumListItem = document.createElement('li');
        albumListItem.classList.add('album-list-item');
        albumListItem.textContent = albumArray[i];
        modalAlbum.appendChild(albumListItem);
    }
}

//Constructeur d'une image cover art
function constructCoverArt(src) {
    let coverArt = document.createElement('img');
    coverArt.setAttribute('src', src);
    coverArt.setAttribute('alt', src);
    coverArt.classList.add('cover-art');
    return coverArt;
}