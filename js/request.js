/*=====REQUETE DE RECHERCHE PAR TERME(S)=====*/
function getBySearch(type, term, callback, offset) {
    const searchRequest = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/?fmt=json&offset=" + offset + "&limit=100&query=";
    //Adaptation de la requête au type de recherche
    if (type === 'all') {
        searchUrl += 'recording:' + term + '%20OR%20artist:' + term + '%20OR%20release:' + term;
    } else if(type === 'recording') {
        searchUrl += term;
    } else {
        searchUrl += type + ':' + term;
    }
    console.log(searchUrl);
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
function getGenresAndRating(titleId, firstCallback, secondCallback) {
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
                firstCallback(response);
                secondCallback(response);
            } else {
                modalGenres.textContent = "Something went wrong";
                modalRating.textContent = "Something went wrong";
            }
        }
    });
    //Interruption de la requête si on ferme la modale
    closeModal.addEventListener('click', function() {
        genresRatingRequest.abort();
    });
    genresRatingRequest.send();
}

/*=====REQUETE DES POCHETTES ASSOCIEES A UN ID D'ALBUM=====*/
function getCoverArts(albumId, callback) {
    const coverArtsRequest = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://coverartarchive.org/release/" + encodeURIComponent(albumId);
    coverArtsRequest.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    coverArtsRequest.addEventListener('loadstart', function() {
        document.getElementById(albumId).textContent = "Loading...";
    });
    coverArtsRequest.addEventListener("readystatechange", function () {
        if (coverArtsRequest.readyState === XMLHttpRequest.DONE) {
            if (coverArtsRequest.status === 200) {
                let response = JSON.parse(coverArtsRequest.responseText);
                response = response.images;
                callback(response, albumId);
            } else if (coverArtsRequest.status === 404) {
                document.getElementById(albumId).textContent = "No cover art found";
            } else {
                document.getElementById(albumId).textContent = "Something went wrong";
            }
        }
    });
    //Interruption de la requête si on ferme la modale
    closeModal.addEventListener('click', function() {
        coverArtsRequest.abort();
    });
    coverArtsRequest.send();
}