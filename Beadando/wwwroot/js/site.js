// Filmek betoltese
function loadAllFilms() {
    fetch('api/films/films')
        .then(response => response.json())
        .then(data => displayFilms(data))
        .catch(error => {
            document.getElementById('film-list').innerHTML = '<p>Hiba történt a filmek betöltése során.</p>';
            console.error(error);
        });
}

// film kereses
document.getElementById('search-input')?.addEventListener('input', function () {
    const query = this.value.trim(); // szoveg

    if (!query) {
        loadAllFilms(); // ha nem keres semmire akkor minden film kilistazva
        return;
    }

    fetch(`api/films/search?title=${encodeURIComponent(query)}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Hiba a keresés során.');
            }
        })
        .then(data => displayFilms(data))
        .catch(error => console.error(error.message));
});

// Filmek megjelenitese
function displayFilms(films) {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';

    films.forEach(film => {
        const filmItem = document.createElement('div');
        filmItem.className = 'film-item';
        filmItem.innerHTML = `
            <h2>${film.title}</h2>
            <p><strong>Rendező:</strong> ${film.director}</p>
            <p><strong>Kiadás éve:</strong> ${film.releaseYear}</p>
            <button onclick="deleteFilm(${film.id})">Törlés</button>
            <button onclick="updateFilm(${film.id})">Módosítás</button>
        `;
        filmList.appendChild(filmItem);
    });
}

// Film hozzaadasa
let isSubmitting;
document.getElementById('add-film-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    if (isSubmitting) {
        return;
    }

    isSubmitting = true;

    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const releaseYear = parseInt(document.getElementById('releaseYear').value, 10);

    if (!title || !director || !releaseYear) {
        alert('Kérlek, töltsd ki az összes mezőt!');
        isSubmitting = false;
        return;
    }

    fetch('api/films/add-film', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, director, releaseYear }),
    })
        .then(response => response.json())
        .then(() => {
            alert('Film hozzáadva');
            loadAllFilms();
            isSubmitting = false;
        })
        .catch(error => {
            console.error(error);
            alert('Hiba történt a film hozzáadása során.');
            isSubmitting = false;
        });
});

// Film torlese
function deleteFilm(id) {
    fetch(`api/films/delete-film/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            alert('Film törölve');
            loadAllFilms();
        })
        .catch(error => console.error(error));
}

// Film modositasa
function updateFilm(id) {
    fetch(`api/films/films/${id}`)
        .then(response => response.json())
        .then(film => {
            const title = prompt('Új cím:', film.title);
            const director = prompt('Új rendező:', film.director);
            const releaseYear = prompt('Új kiadási év:', film.releaseYear);

            const updatedFilm = {
                title: title,
                director: director,
                releaseYear: releaseYear ? parseInt(releaseYear, 10) : 0,
            };

            fetch(`api/films/update-film/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFilm),
            })
                .then(response => {
                    if (response.ok) {
                        alert('Film frissítve');
                        loadAllFilms();
                    } else {
                        alert('Hiba történt a film frissítésekor');
                    }
                })
                .catch(error => console.error(error));
        });
}

// filmek hozzadasa
function openFilm() {
    document.getElementById('add-film').style.display = 'block';
    document.getElementById('title').value = '';
    document.getElementById('director').value = '';
    document.getElementById('releaseYear').value = '';
}
//filmek bezarasa
function closeFilm() {
    document.getElementById('add-film').style.display = 'none';
}

// jelenjen meg alapbol mindegyik
loadAllFilms();