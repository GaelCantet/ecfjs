function getBySearch(type, term, callback, offset) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/recording/?query=";
    //Adaptation de la requête au type de recherche
    switch (type) {
        case 'artist':
            searchUrl += 'artist:' + encodeURIComponent(term);
            break;
        case 'release':
            searchUrl += 'release:' + encodeURIComponent(term);
            break;
        case 'recording':
            searchUrl += encodeURIComponent(term);
            break;
        default:
            searchUrl += "recording:" + encodeURIComponent(term) + "%20OR%20artist:" + encodeURIComponent(term) + "%20OR%20release:" + encodeURIComponent(term);
            break;
    }
    searchUrl += "&limit=100&offset=" + offset + "&fmt=json";
    console.log(searchUrl);
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        if (offset > 0) {
            let loading = constructLastItem();
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

function getGenres(id, callback) {
    const request = new XMLHttpRequest();
    //URL de la requête
    let searchUrl = "https://musicbrainz.org/ws/2/release-group/" + encodeURIComponent(id) + "?inc=genres&fmt=json";
    request.open("GET", searchUrl, true);
    //Affichage LOADING pendant le chargement de la requête
    request.addEventListener('loadstart', function() {
        modalBody.querySelector('.modal-list .modal-list-genres p').textContent = "Loading...";
    });
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                response = response.genres;
                callback(response);
            } else {
                modalBody.querySelector('.modal-list .modal-list-item:nth-of-type(4) p').textContent = "Something went wrong";
            }
        }
    });
    request.send();
}