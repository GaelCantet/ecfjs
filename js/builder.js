/*=====CONSTRUCTION DES ELEMENTS DE LA LISTE RESULTAT DE RECHERCHE=====*/
function buildTitleList(title, artist, album, nb, titleLength, albumId, titleId, genreId) {
    //Création de la liste "Titre"
    let listItem = document.createElement('ul');
    //Création de l'item title
    let listItemTitle = document.createElement('li');
    listItemTitle.textContent = title;
    listItemTitle.classList.add('result-list-title');
    //Création de l'item artist
    let listItemArtist = document.createElement('li');
    listItemArtist.textContent = artist;
    listItemArtist.classList.add('result-list-artist');
    //Création de l'item album
    let listItemAlbum = document.createElement('li');
    listItemAlbum.textContent = album[0];
    listItemAlbum.classList.add('result-list-album');
    //Création de l'item numéro du résultat
    let listItemNumber = document.createElement('li');
    listItemNumber.classList.add('result-list-number');
    //Création de l'item button
    let listItemBtn = document.createElement('li');
    listItemBtn.classList.add('result-list-button');
    //Si on créée le header de la liste
    if (nb === "#") {
        listItemNumber.textContent = nb;
        listItemBtn.textContent = titleLength.toString() + " entries";
    } else { //Sinon
        nb++;
        listItemNumber.textContent = nb;
        //Création du bouton d'accès à la modale
        let listBtn = document.createElement('button');
        listBtn.textContent = "+";
        listBtn.classList.add('modal-btn', 'btn-primary');
        //Si on clique sur le bouton on bloque le scroll su body et on ouvre la modale
        listBtn.addEventListener('click', function() {
            modal.classList.add('open-modal');
            document.body.classList.add('no-scroll');
            displayModal(nb, title, artist, album, titleLength, albumId, titleId, genreId);
        });
        listItemBtn.appendChild(listBtn);
    }
    //On finalise la création de la liste et on retourne l'objet complet
    listItem.appendChild(listItemNumber);
    listItem.appendChild(listItemTitle);
    listItem.appendChild(listItemArtist);
    listItem.appendChild(listItemAlbum);
    listItem.appendChild(listItemBtn);
    listItem.classList.add('result-list-item');
    return listItem;
}

/*=====CONSTRUCTION DU DERNIER ELEMENT DE LA LISTE RESULTAT DE RECHERCHE=====*/
function buildLastItem() {
    //On créée la div qui se placera après le liste de résultats
    let lastItem = document.createElement('div');
    lastItem.setAttribute('id', 'last-item');
    return lastItem;
}

/*=====CONSTRUCTION D'UN ALBUM A AFFICHER DANS LA MODALE=====*/
function buildAlbumlist(albumItem) {
    //On créée un item de la liste album dans la modale
    let albumListItem = document.createElement('li');
    albumListItem.classList.add('album-list-item');
    albumListItem.textContent = albumItem;
    return albumListItem;
}

/*=====CONSTRUCTION D'UNE POCHETTE A AFFICHER DANS LA MODALE=====*/
function buildCoverArt(src, types) {
    //On créée un container d'image de la liste cover art de la modale
    let coverArtContainer = document.createElement('div');
    coverArtContainer.classList.add('cover-art-container');
    //On créée une img
    let coverArtImg = document.createElement('img');
    coverArtImg.setAttribute('src', src);
    let altText = types.join(", ");
    coverArtImg.setAttribute('alt', altText);
    coverArtContainer.appendChild(coverArtImg);
    return coverArtContainer;
}