/*=====CONSTRUCTION DES ELEMENTS DE LA LISTE RESULTAT DE RECHERCHE=====*/
function buildTitleList(title, artist, album, nb, titleLength, titleId) {
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
    listItemAlbum.textContent = album[0][0];
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

        //Si on clique sur le bouton on bloque le scroll du body et on ouvre la modale
        listBtn.addEventListener('click', function() {
            modal.classList.add('open-modal');
            document.body.classList.add('no-scroll');
            displayModal(nb, title, artist, album, titleLength, titleId);
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
function buildLastItem(type, term, offset) {
    //On créée la div qui se placera après le liste de résultats
    let lastItem = document.createElement('div');
    lastItem.setAttribute('id', 'last-item');

    //Si les paramètres type, term et offset sont définis, on crée un bouton
    if ((type !== undefined) && (term !== undefined) && (offset !== undefined)) {
        let getMoreBtn = document.createElement('button');
        getMoreBtn.textContent = "Load more";

        //Au clic sur le bouton on relance une requête sur la même recherche avec le nouvel offset
        getMoreBtn.addEventListener('click', function() {
            document.getElementById('last-item').remove();
            getBySearch(type, term, displayTitleList, offset);
        });
        lastItem.appendChild(getMoreBtn);
    }
    return lastItem;
}

/*=====CONSTRUCTION D'UN ALBUM A AFFICHER DANS LA MODALE=====*/
function buildAlbumlist(albumItem) {
    //On crée le titre de l'album
    let albumTitle =  document.createElement('h4');
    albumTitle.classList.add('album-title');
    albumTitle.textContent = albumItem[0];

    //On crée la description de l'album
    let albumDescription = document.createElement('span');
    albumDescription.classList.add('album-description');
    albumDescription.textContent = ' (' + albumItem[2] + ')';
    albumTitle.appendChild(albumDescription);

    //On crée le container de ses pochettes
    let albumArtsContainer = document.createElement('div');
    albumArtsContainer.classList.add('album-arts-container');
    albumArtsContainer.setAttribute('id', albumItem[1]);
    return [albumTitle, albumArtsContainer];
}

/*=====CONSTRUCTION D'UNE POCHETTE A AFFICHER DANS LA MODALE=====*/
function buildCoverArt(src, types) {
    //On créée un container d'image de la liste cover art de la modale
    let coverArtContainer = document.createElement('div');
    coverArtContainer.classList.add('cover-art-container');

    //On créée une img
    let coverArtImg = document.createElement('img');
    coverArtImg.classList.add('cover-art');
    coverArtImg.setAttribute('src', src);
    coverArtImg.addEventListener('load', function(ev){//Quand l'image est chargée
        ev.target.classList.add('cover-art-loaded');//Son opacité passe à 1
    });
    coverArtImg.addEventListener('error', function(ev){//Ou si elle retourne une erreur
        ev.target.classList.add('cover-art-loaded');//Son opacité passe à 1
    });
    let coverArtText = types.join(", ");//On crée l'alt de l'image
    coverArtImg.setAttribute('alt', coverArtText);
    coverArtContainer.appendChild(coverArtImg);
    return coverArtContainer;
}