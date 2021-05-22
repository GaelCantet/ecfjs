function displayTitleList(response, type, term, offset) {
    let i;
    //Gestion des erreurs
    let title = "Unknown title";
    let artist = "Unknow artist";
    let album = "Unknown artist";
    let albumId = "";
    let rating = "Unkown rating";
    let titleLength = "Unknown length";
    let count = response.count;
    let recordings = response.recordings;
    //Gestion pas de résultat
    if (count == 0) {
        resultHeader.textContent = "No result";
    } else {
        //Suppression last-item
        if (document.getElementById('last-item') !== null) {
            document.getElementById('last-item').remove();
        }
        //Gestion header
        resultHeader.innerHTML = "";
        let headerContent = constructTitleList("Title", "Artist", "Album", "#", count);
        resultHeader.appendChild(headerContent);
        //Pour chaque titre trouvé via la recherche
        for (i = 0; i < recordings.length; i++) {
            if (recordings[i].hasOwnProperty('title')) {
                title = recordings[i].title;
            }
            if (recordings[i].hasOwnProperty('artist-credit')) {
                artist = [];
                for (let j = 0; j < recordings[i]["artist-credit"].length; j++) {
                    artist.push(recordings[i]["artist-credit"][j].name);
                }
                artist = artist.join(" & ");
            }
            if (recordings[i].hasOwnProperty('releases')) {
                album = recordings[i].releases[0].title;
                albumId = recordings[i].releases[0].id;
                if (recordings[i].releases[0].hasOwnProperty('release-group')) {
                    albumId = recordings[i].releases[0]["release-group"].id;
                }
            }
            if (recordings[i].hasOwnProperty('score')) {
                rating = recordings[i].score;
            }
            if (recordings[i].hasOwnProperty('length')) {
                titleLength = new Date(recordings[i].length).toISOString().substr(11, 8)
            }
            //Construction de la liste du titre
            let listItem = constructTitleList(title, artist, album, offset + i, rating, titleLength, albumId);
            //Intégration de la liste
            resultList.appendChild(listItem);
        }
        //Incrémentation de l'offset pour préparer la suite de la liste
        offset += 100;
        //Si il reste des éléments dans la recherche, on affiche un bouton pour charger la suite
        if (offset < count) {
            let getMoreBtn = document.createElement('button');
            getMoreBtn.textContent = "Load more";
            //Au clic sur le bouton on relance une requête sur la même recherche avec le nouvel offset
            getMoreBtn.addEventListener('click', function() {
                document.getElementById('last-item').remove();
                getBySearch(type, term, displayTitleList, offset);
            });
            let lastItem = constructLastItem();
            lastItem.appendChild(getMoreBtn);
            resultList.appendChild(lastItem);
        }
    } 
}


//Constructeur de la liste Title
function constructTitleList(title, artist, album, nb, rating, titleLength, albumId) {
    let listItem = document.createElement('ul');
    let listItemTitle = document.createElement('li');
    listItemTitle.textContent = title;
    listItemTitle.classList.add('result-list-title');
    let listItemArtist = document.createElement('li');
    listItemArtist.textContent = artist;
    listItemArtist.classList.add('result-list-artist');
    let listItemAlbum = document.createElement('li');
    listItemAlbum.textContent = album;
    listItemAlbum.classList.add('result-list-album');
    let listItemNumber = document.createElement('li');
    listItemNumber.classList.add('result-list-number');
    let listItemBtn = document.createElement('li');
    listItemBtn.classList.add('result-list-button');
    //Pour le header de la liste
    if (nb === "#") {
        listItemNumber.textContent = nb;
        listItemBtn.textContent = rating.toString() + " entries";
    } else {
        listItemNumber.textContent = nb + 1;
        let listBtn = document.createElement('button');
        listBtn.textContent = "+";
        listBtn.classList.add('modal-btn', 'btn-primary');
        listBtn.addEventListener('click', function() {
            modal.classList.add('open-modal');
            displayModal(title, artist, album, rating, titleLength, albumId);
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


function displayModal(title, artist, album, rating, titleLength, albumId) {
    modalHeader.textContent = "";
    modalTitle.textContent = title;
    modalTitleLength.textContent = titleLength;
    modalArtist.textContent = artist;
    modalAlbum.textContent = album;
    modalRating.textContent = displayRating(rating);
    getGenres(albumId, displayGenres);
}

function displayRating(score) {
    return score;
}

function displayGenres(genres) {
    //Initialisation tableaux temporaire et final
    let genreArrayTemp = [];
    let genreArrayFinal = [];
    //Si aucun genre n'est retourné
    if (genres.length === 0) {
        modalGenres.textContent = "No genre found for this album";
    } else { //Si la réponse retourne au moins un genre
        for (i = 0; i < genres.length; i++) {
            //On ne garde que les genres ayant un nombre positif de votes
            if (genres[i].count > 0) {
                //On créée un tableau à deux dimensions de forme [nomDuGenre, nbDeVotes]
                let genreArrayItem = [genres[i].name, genres[i].count]
                genreArrayTemp.push(genreArrayItem);
            }
        }
        //On trie le tableau par ordre décroissant du nombre de votes
        genreArrayTemp.sort(function(a, b){
            return b[1]-a[1]
        });
        //On construit le tableau final avec les uniquement les genres par ordre de popularité
        for (i = 0; i < genreArrayTemp.length; i++) {
            genreArrayFinal.push(genreArrayTemp[i][0]);
        }
        //On créée une chaine de caractères à partir du tableau final
        genreArrayFinal = genreArrayFinal.join(", ");
        //On affiche la chaine de caractères
        modalGenres.textContent = genreArrayFinal;
    }
}