function displayTitleList(response, type, term, offset) {
    let i;
    //Gestion des erreurs
    let title = "Unknown title";
    let titleId = "";
    let artist = "Unknow artist";
    let album = "Unknown artist";
    let albumId = "";
    let genreId = "";
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
            titleId = recordings[i].id;
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
                album = [];
                albumId = [];
                genreId = recordings[i].releases[0]["release-group"].id;
                for (j = 0; j < recordings[i].releases.length; j++) {
                    album.push(recordings[i].releases[j].title);
                    albumId.push(recordings[i].releases[j].id);
                }
            }
            if (recordings[i].hasOwnProperty('length')) {
                titleLength = new Date(recordings[i].length).toISOString().substr(11, 8)
            }
            //Construction de la liste du titre
            let listItem = constructTitleList(title, artist, album, offset + i, titleLength, albumId, titleId, genreId);
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

function displayModal(nb, title, artist, album, titleLength, albumId, titleId, genreId) {
    nb++;
    modalHeader.textContent = "#" + nb;
    modalTitle.textContent = title;
    modalTitleLength.textContent = "(" + titleLength + ")";
    modalArtist.textContent = artist;
    constructAlbumlist(album);
    getRating(titleId, displayRating);
    console.log(albumId[0]);
    for(i = 0; i < albumId.length; i++) {
        getCoverArts(albumId[i], displayCoverArt);
    }
    getGenres(genreId, displayGenres);
    
}

function displayRating(ratings) {
    let rating = "";
    //Réinitialisation de bakground-size à 0
    modalRating.style.backgroundSize = 0;
    //Si des votes sont disponibles
    if (ratings["votes-count"] > 0) {
        rating = ratings.value;
        //Conversion de la note sur 100
        rating *= 20;
        //Conversion en chaine de caractères + pourcentage
        rating += "%";
        //Changement du background-size en fonction de la note
        modalRating.style.backgroundSize = rating;
    } else { //Si aucun vote n'est disponible
        rating = "No rating found for this title";
    }
    //Affichage de la valeur rating
    modalRating.textContent = rating;
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

function displayCoverArt(response) {
    //Si on obtient une réponse mais qu'aucune image n'est diponible 
    if (response.length < 1) {
        modalFooterMessage.textContent = "No cover art found for this album";
    } else { //Sinon
        modalFooterMessage.textContent = "";
        //Pour chaque image disponible
        for (i = 0; i < response.length; i++) {
            let coverArt = "";
            //On cherche d'abord les plus petites
            if(response[i].thumbnails.hasOwnProperty('250')) {
                coverArt = response[i].thumbnails['250'];
            } else if(response[i].thumbnails.hasOwnProperty('small')) {
                coverArt = response[i].thumbnails['small'];
            } else { //Ou on prend l'image par défaut
                coverArt = response[i].image;
            }
            //On construit l'élément image et ses attributs
            coverArt = constructCoverArt(coverArt);
            //On affiche l'image dans le container
            coverArtsContainer.appendChild(coverArt);
        }
    }
}