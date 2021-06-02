/*=====AFFICHER LA LISTE DES RESULTATS=====*/
function displayTitleList(response, type, term, offset) {
    //Gestion des erreurs
    let title = "Unknown title";
    let titleId = "";
    let artist = "Unknow artist";
    let album = ["Unknown album"];
    let titleLength = "Unknown length";
    let suggestions = "";
    let count = response.count;
    let recordings = response.recordings;

    //S'il n'y a aucun résultat
    if (count === 0) {
        resultHeader.textContent = "No result";
    } else { //Sinon

        //Suppression last-item si il existe
        if (document.getElementById('last-item') !== null) {
            document.getElementById('last-item').remove();
        }

        //Si le offset = 0, on affiche le header
        if (offset === 0) {
            resultHeader.innerHTML = "";
            let headerContent = buildTitleList("Title", "Artist", [["Album", ""]], "#", count);
            resultHeader.appendChild(headerContent);
        }

        //Pour chaque titre trouvé via la recherche
        for (i in recordings) {
            //L'ID du titre
            titleId = recordings[i].id;
            if (recordings[i].hasOwnProperty('title')) {
                //Le nom du titre
                title = recordings[i].title;
            }

            //La longueur du titre
            if (recordings[i].hasOwnProperty('length')) {
                //La longueur du titre convertie au format HH:MM:SS
                titleLength = new Date(recordings[i].length).toISOString().substr(11, 8)
            }

            //Le(s) nom(s) de(s) l'artiste(s)
            if (recordings[i].hasOwnProperty('artist-credit')) {
                artist = [];
                for (let j = 0; j < recordings[i]["artist-credit"].length; j++) {
                    artist.push(recordings[i]["artist-credit"][j].name);
                }
                artist = artist.join(" & ");
            }

            //Le(s) album(s)
            if (recordings[i].hasOwnProperty('releases')) {
                album = [];
                albumId = [];

                //Pour chaque album associé au titre
                for (j = 0; j < recordings[i].releases.length; j++) {
                    //On réinitialise le tableau à vide
                    albumDescription = [];

                    if (recordings[i].releases[j].hasOwnProperty('media')) {
                        albumDescription.push(recordings[i].releases[j].media[0].format);
                    }
                    if (recordings[i].releases[j].hasOwnProperty('status')) {
                        albumDescription.push(recordings[i].releases[j].status);
                    }
                    if (recordings[i].releases[j].hasOwnProperty('date')) {
                        albumDescription.push(recordings[i].releases[j].date);
                    }
                    if (recordings[i].releases[j].hasOwnProperty('country')) {
                        albumDescription.push(recordings[i].releases[j].country);
                    }

                    //Si aucune propriété n'est présente
                    if (albumDescription.length == 0) {
                        albumDescription.push('No details available');
                    }

                    //On transforme la descrition en chaine de caractères
                    albumDescription = albumDescription.join(", ");
                    
                    //Tableau contenant les noms d'albums, leur id et leur description
                    album.push([
                        recordings[i].releases[j].title,//Le nom de l'album
                        recordings[i].releases[j].id,//L'id de l'album
                        albumDescription//La description de l'album
                    ]);
                }
            }
            //Construction de la liste du titre
            i = parseInt(i); //On s'assure que i est un entier pour l'additioner à l'offset
            let listItem = buildTitleList(title, artist, album, offset + i, titleLength, titleId);

            //Intégration de la liste
            resultList.appendChild(listItem);
        }
        
        //Incrémentation de l'offset pour préparer la suite de la liste
        offset += 100;

        //Si il reste des éléments dans la recherche, on affiche un bouton pour charger la suite
        if (offset < count) {
            let lastItem = buildLastItem(type, term, offset);
            resultList.appendChild(lastItem);
        }
    }
}

/*=====AFFICHER LES INFORMATIONS DANS LA MODALE=====*/
function displayModal(nb, title, artist, album, titleLength, titleId) {
    //On affiche l'index de la recherche
    modalHeader.textContent = "#" + nb;

    //On affiche le titre, sa durée et l'artiste(s) associé(s)
    modalTitle.textContent = title;
    modalTitleLength.textContent = "(" + titleLength + ")";
    modalArtist.textContent = artist;

    //On requête le(s) genre(s) et la note du titre
    getGenresAndRating(titleId, displayGenres, displayRating);

    //Si au moins un album est associé au titre
    if (album[0][0] !== "Unknown album") {
        album.map(function(albumItem) {
            //On affiche les albums associés au titre et les containers des pochettes
            let albumListItem = buildAlbumlist(albumItem);
            albumsContainer.appendChild(albumListItem[0]).insertAdjacentElement("afterend", albumListItem[1]);
        });

        //On requête la pochette du 1er album (la fonction boucle pour afficher les autres)
        getCoverArts(album, 0, displayCoverArt);
    } else { //Si aucun album n'est associé au titre
        albumsContainer.appendChild(buildAlbumlist(album[0][0]));//Affiche "Unknown album"
    }
}

/*=====AFFICHER LA NOTE SI ELLE EST DISPONIBLE=====*/
function displayRating(response) {
    let ratings = response.rating;
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

/*=====AFFICHER LES GENRES S'ILS SONT DISPONIBLES ET PREPARER LES SUGGESTIONS=====*/
function displayGenres(response) {
    let genres = response.genres;

    //Initialisation tableaux temporaire et final
    let genreArrayTemp = [];
    let genreArrayFinal = [];
    let suggestions = [];

    //Si aucun genre n'est retourné
    if (genres.length == 0) {
        modalGenres.textContent = "No genre found for this title";
        modalSuggestions.textContent = "No suggestion for this title";
    } else { //Si la réponse retourne au moins un genre
        for (i in genres) {
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

        //On construit le tableau final avec uniquement les genres par ordre de popularité
        genreArrayTemp.map(function(genreTempItem) {
            genreArrayFinal.push(genreTempItem[0]);
        });

        //On requête les éventuelles suggestions selon les genres
        suggestions = genreArrayFinal.join("+");
        getSuggestions(suggestions, displaySuggestions);

        //On créée une chaine de caractères à partir du tableau final
        genreArrayFinal = genreArrayFinal.join(", ");

        //On affiche la chaine de caractères
        modalGenres.textContent = genreArrayFinal;
    }
}

/*=====AFFICHER UNE LISTE DE SUGGESTIONS SI DISPONIBLE=====*/
function displaySuggestions(artists) {
    if (artists.length > 0) {
        modalSuggestions.textContent = "";
        for (i in artists) {
            modalSuggestions.appendChild(buildSuggestions(artists[i].name));
        }
    } else {
        modalSuggestions.textContent = "No suggestion for this title";
    }
}

/*=====AFFICHER LES POCHETTES SI ELLES SONT DISPONIBLES=====*/
function displayCoverArt(coverArtResponse, albumId) {
    let singleAlbumContainer = document.getElementById(albumId);

    //Si on obtient une réponse mais qu'aucune image n'est diponible 
    if (coverArtResponse.length < 1) {
        singleAlbumContainer.textContent = "↳ No cover art found";
    } else { //Sinon
        singleAlbumContainer.textContent = "";

        //Pour chaque image disponible
        for (i in coverArtResponse) {
            //On récupère le(s) type(s) d'image pour en faire le alt de l'img
            let altText = coverArtResponse[i].types;
            let coverArt = "";

            //On cherche d'abord les plus petites
            if(coverArtResponse[i].thumbnails.hasOwnProperty('250')) {
                coverArt = coverArtResponse[i].thumbnails['250'];
            } else if(coverArtResponse[i].thumbnails.hasOwnProperty('small')) {
                coverArt = coverArtResponse[i].thumbnails['small'];
            } else { //Ou on prend l'image par défaut
                coverArt = coverArtResponse[i].image;
            }

            //On construit l'élément image et ses attributs
            coverArt = buildCoverArt(coverArt, altText);

            //On affiche l'image dans le container
            singleAlbumContainer.appendChild(coverArt);
        }
    }
}