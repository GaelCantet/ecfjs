/*=====REQUETE DE RECHERCHE PAR TERME(S)=====*/
function getBySearch(type, term, callback, offset) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/?query=";
    //Adaptation de la requête au type de recherche
    switch (type) {
        case 'artist':
            searchUrl += 'artist:' + term;
            break;
        case 'release':
            searchUrl += 'release:' + term;
            break;
        case 'recording':
            searchUrl += term;
            break;
        default:
            searchUrl += "recording:" + term + "%20OR%20artist:" + term + "%20OR%20release:" + term;
            break;
    }
    searchUrl += "&limit=100&offset=" + offset + "&fmt=json";
    console.log(searchUrl);
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        if (offset > 0) {
            let loading = buildLastItem();
            loading.textContent = "Loading...";
            resultList.appendChild(loading);
        } else {
            resultHeader.textContent = "Loading...";
        }
    });
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                callback(response, type, term, offset);
            } else {
                resultHeader.textContent = "Something went wrong, try again later";
            }
        }
    });
    request.send();
}

/*=====REQUETE DES GENRES ASSOCIES A UN ID D'ALBUM=====*/
function getGenres(albumId, callback) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/release-group/" + encodeURIComponent(albumId) + "?inc=genres&fmt=json";
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        modalGenres.textContent = "Loading...";
    });
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                response = response.genres;
                callback(response);
            }  else if (request.status === 404) {
                modalGenres.textContent = "No genre found for this album";
            } else {
                modalGenres.textContent = "Something went wrong";
            }
        }
    });
    //Interruption de la requête si on ferme la modale
    closeModal.addEventListener('click', function() {
        request.abort();
    });
    request.send();
}

/*=====REQUETE DE NOTE ASSOCIEE A UN ID DE TITRE=====*/
function getRating(titleId, callback) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/" + encodeURIComponent(titleId) + "?inc=ratings&fmt=json";
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        modalRating.textContent = "Loading...";
    });
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                response = response.rating;
                callback(response);
            } else {
                modalRating.textContent = "Something went wrong";
            }
        }
    });
    //Interruption de la requête si on ferme la modale
    closeModal.addEventListener('click', function() {
        request.abort();
    });
    request.send();
}

/*=====REQUETE DES POCHETTES ASSOCIEES A UN ID D'ALBUM=====*/
function getCoverArts(albumId, callback) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://coverartarchive.org/release/" + encodeURIComponent(albumId);
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        modalFooterMessage.textContent = "Loading...";
    });
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                response = response.images;
                callback(response);
            } else if (request.status === 404) {
                modalFooterMessage.textContent = "No cover art found";
            } else {
                modalFooterMessage.textContent = "Something went wrong";
            }
        }
    });
    //Interruption de la requête si on ferme la modale
    closeModal.addEventListener('click', function() {
        request.abort();
    });
    request.send();
}