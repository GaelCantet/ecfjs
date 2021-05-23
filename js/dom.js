/*=====AFFICHER LA LISTE DES RESULTATS=====*/
function displayTitleList(response, type, term, offset) {
    //Gestion des erreurs
    title = "Unknown title";
    titleId = "";
    artist = "Unknow artist";
    album = ["Unknown album"];
    albumId = "";
    genreId = "";
    titleLength = "Unknown length";
    count = response.count;
    recordings = response.recordings;
    //S'il n'y a aucun résultat
    if (count == 0) {
        resultHeader.textContent = "No result";
    } else { //Sinon
        //Suppression last-item
        if (document.getElementById('last-item') !== null) {
            document.getElementById('last-item').remove();
        }
        //Gestion header
        resultHeader.innerHTML = "";
        let headerContent = constructTitleList("Title", "Artist", ["Album"], "#", count);
        resultHeader.appendChild(headerContent);
        //Pour chaque titre trouvé via la recherche
        for (i = 0; i < recordings.length; i++) {
            //L'ID du titre
            titleId = recordings[i].id;
            if (recordings[i].hasOwnProperty('title')) {
                //Le nom du titre
                title = recordings[i].title;
            }
            if (recordings[i].hasOwnProperty('artist-credit')) {
                //Le(s) nom(s) de(s) l'artiste(s)
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
                    //Tableau contenant les noms d'albums associés au titre
                    album.push(recordings[i].releases[j].title);
                    //Tableau contenant les id associés aux albums
                    albumId.push(recordings[i].releases[j].id);
                }
            }
            if (recordings[i].hasOwnProperty('length')) {
                //La longueur du titre convertie au format HH:MM:SS
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

/*=====AFFICHER LES INFORMATIONS DANS LA MODALE=====*/
function displayModal(nb, title, artist, album, titleLength, albumId, titleId, genreId) {
    //On incrémente le numéro du résultat de recherche avant d l'afficher
    nb++;
    modalHeader.textContent = "#" + nb;
    //On affiche le titre, sa durée et l'artiste(s) associé(s)
    modalTitle.textContent = title;
    modalTitleLength.textContent = "(" + titleLength + ")";
    modalArtist.textContent = artist;
    //On affiche les albums associés au titre
    album.map(function(albumItem) {
        modalAlbum.appendChild(constructAlbumlist(albumItem));
    });
    //On requête une note associée au titre
    getRating(titleId, displayRating);
    //On requête les genres associés à l'album principal
    getGenres(genreId, displayGenres);
    //On requête les pochettes associées aux albums
    if (albumId.length > 0) {
        albumId.map(function(albumIdItem) {
            getCoverArts(albumIdItem, displayCoverArt);
        });
    } else { //Si aucun album n'est associé au titre
        modalFooterMessage.textContent = "No album available for this title";
    }
}

/*=====AFFICHER LA NOTE SI ELLE EST DISPONIBLE=====*/
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

/*=====AFFICHER LES GENRES S'ILS SONT DISPONIBLES=====*/
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
            return b[1] - a[1];
        });
        //On construit le tableau final avec les uniquement les genres par ordre de popularité
        genreArrayTemp.map(function(genreTempItem) {
            genreArrayFinal.push(genreTempItem[0]);
        });
        //On créée une chaine de caractères à partir du tableau final
        genreArrayFinal = genreArrayFinal.join(", ");
        //On affiche la chaine de caractères
        modalGenres.textContent = genreArrayFinal;
    }
}

/*=====AFFICHER LES POCHETTES SI ELLES SONT DISPONIBLES=====*/
function displayCoverArt(response) {
    //Si on obtient une réponse mais qu'aucune image n'est diponible 
    if (response.length < 1) {
        modalFooterMessage.textContent = "No cover art found";
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