/*=====REQUETE DE RECHERCHE PAR TERME(S)=====*/
function getBySearch(type, term, callback, offset) {
    const searchRequest = new XMLHttpRequest();

    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/?fmt=json&offset=" + offset + "&limit=100&query=";

    //Adaptation de la requête au type de recherche
    if (type === 'all') {
        searchUrl += 'recording:' + term + '%20OR%20artist:' + term + '%20OR%20release:' + term;
    } else {
        searchUrl += type + ':' + term;
    }
    searchRequest.open("GET", searchUrl, true);

    //Affichage LOADING pendant le chargement de la requête
    searchRequest.addEventListener('loadstart', function() {
        if (offset > 0) {
            let loading = buildLastItem();
            loading.textContent = "Loading...";
            resultList.appendChild(loading);
        } else {
            resultHeader.textContent = "Loading...";
        }
    });

    searchRequest.addEventListener("readystatechange", function () {
        if (searchRequest.readyState === XMLHttpRequest.DONE) {
            if (searchRequest.status === 200) {
                let response = JSON.parse(searchRequest.responseText);
                callback(response, type, term, offset);
            } else {
                resultHeader.textContent = "Something went wrong, try again later";
            }
        }
    });

    searchRequest.send();
}

/*=====REQUETE DES GENRES & DE LA NOTE ASSOCIES A UN ID D'ALBUM=====*/
function getGenresAndRating(titleId, suggestions, firstCallback, secondCallback) {
    const genresRatingRequest = new XMLHttpRequest();

    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/" + encodeURIComponent(titleId) + "?inc=genres+ratings&fmt=json";
    genresRatingRequest.open("GET", searchUrl, true);

    //Affichage LOADING pendant le chargement de la requête
    genresRatingRequest.addEventListener('loadstart', function() {
        modalGenres.textContent = "Loading...";
        modalRating.textContent = "Loading...";
    });

    genresRatingRequest.addEventListener("readystatechange", function () {
        if (genresRatingRequest.readyState === XMLHttpRequest.DONE) {
            if (genresRatingRequest.status === 200) {
                let response = JSON.parse(genresRatingRequest.responseText);
                firstCallback(response, suggestions);
                secondCallback(response);
            } else {
                modalGenres.textContent = "Something went wrong";
                modalRating.textContent = "Something went wrong";
            }
        }
    });

    //Interruption de la requête si on ferme la modale
    closeModalBtn.addEventListener('click', function() {
        genresRatingRequest.abort();
    });

    genresRatingRequest.send();
}

/*=====REQUETE DES SUGGESTIONS EVENTUELLES=====*/
function getSuggestions(suggestions, callback) {
    const suggestionsRequest = new XMLHttpRequest();

    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/artist/?fmt=json&offset=0&limit=10&query=tag:" + encodeURIComponent(suggestions);
    suggestionsRequest.open("GET", searchUrl, true);

    //Affichage LOADING pendant le chargement de la requête
    suggestionsRequest.addEventListener('loadstart', function() {
        modalSuggestions.textContent = 'Loading...'
    });

    suggestionsRequest.addEventListener("readystatechange", function () {
        if (suggestionsRequest.readyState === XMLHttpRequest.DONE) {
            if (suggestionsRequest.status === 200) {
                let response = JSON.parse(suggestionsRequest.responseText);
                callback(response.artists);
            } else {
                modalSuggestions.textContent = "No suggestion for this title";
            }
        }
    });

    //Interruption de la requête si on ferme la modale
    closeModalBtn.addEventListener('click', function() {
        suggestionsRequest.abort();
    });

    suggestionsRequest.send();
}

/*=====REQUETE DES POCHETTES ASSOCIEES A UN ID D'ALBUM=====*/
function getCoverArts(albumArray, index, callback) {
    if (index < albumArray.length) {//S'il reste des des items à traiter dans le tableau
        const coverArtsRequest = new XMLHttpRequest();

        //URL de la requête
        let searchUrl = "https://coverartarchive.org/release/" + encodeURIComponent(albumArray[index][1]);
        coverArtsRequest.open("GET", searchUrl, true);

        //Affichage LOADING pendant le chargement de la requête
        coverArtsRequest.addEventListener('loadstart', function() {
            document.getElementById(albumArray[index][1]).textContent = "↳ Loading...";
        });

        coverArtsRequest.addEventListener("readystatechange", function () {
            if (coverArtsRequest.readyState === XMLHttpRequest.DONE) {
                let coverArtDestination = document.getElementById(albumArray[index][1]); //Le container des pochettes

                if (coverArtsRequest.status === 200) {
                    let response = JSON.parse(coverArtsRequest.responseText);
                    response = response.images;
                    callback(response, albumArray[index][1]);
                } else if (coverArtsRequest.status === 404 && coverArtDestination !== null) {//Si la réponse n'est pas valide et que les containers des messages sont bien créés
                    coverArtDestination.textContent = "↳ No cover art available";
                } else if(coverArtDestination !== null) {
                    coverArtDestination.textContent = "↳ Something went wrong";
                }

                //On attend que la requête d'une pochette soit terminée pour lancer la suivante
                index++;
                getCoverArts(albumArray, index, displayCoverArt);
            }
        });

        //Interruption de la requête si on ferme la modale
        closeModalBtn.addEventListener('click', function() {
            coverArtsRequest.abort();
        });

        coverArtsRequest.send();
    }
}