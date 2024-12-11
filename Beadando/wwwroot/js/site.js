// API hívás a filmek lekérdezéséhez
fetch('api/films/films') // Módosítva: A helyes URL-t használjuk
    .then(response => response.json())
    .then(data => {
        const filmList = document.getElementById('film-list');
        filmList.innerHTML = '';
        data.forEach(film => {
            const filmItem = document.createElement('div');
            filmItem.className = 'film-item';
            filmItem.innerHTML = `
                <h2>${film.title}</h2>
                <p><strong>Rendező:</strong> ${film.director}</p>
                <p><strong>Kiadás éve:</strong> ${film.releaseYear}</p>
                <button onclick="deleteFilm(${film.id})">Törlés</button>
                <button onclick="updateFilm(${film.id})">Frissítés</button>
            `;
            filmList.appendChild(filmItem);
        });
    })
    .catch(error => {
        document.getElementById('film-list').innerHTML = '<p>Hiba történt a filmek betöltése során.</p>';
        console.error(error);
    });

// Film hozzáadása
let isSubmitting =

document.getElementById('add-film-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Ha már folyamatban van a film hozzáadása, ne küldjük el újra a formot
    if (isSubmitting) {
        return;
    }

    isSubmitting = true;

    // 1. Film adatainak kinyerése a form-ból
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const releaseYear = parseInt(document.getElementById('releaseYear').value, 10); // Konvertáljuk számra

    // Ellenőrzés
    if (!title || !director || !releaseYear) {
        alert('Kérlek, töltsd ki az összes mezőt!');
        isSubmitting = false; // Ha nem sikerült, állítsuk vissza
        return;
    }

    // 2. API hívás
    fetch('api/films/add-film', {  // Módosítva: A helyes URL-t használjuk
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, director, releaseYear })
    })
        .then(response => response.json())
        .then(data => {
            alert('Film hozzáadva');
            location.reload(); // Frissíti az oldalt a filmek új betöltésével
            isSubmitting = false; // Újra engedélyezzük a form beküldését
        })
        .catch(error => {
            console.error(error);
            alert('Hiba történt a film hozzáadása során.');
            isSubmitting = false; // Hiba esetén is visszaállítjuk a flag-et
        });
});


// Film törlése
function deleteFilm(id) {
    fetch(`api/films/delete-film/${id}`, { // Módosítva: A helyes URL-t használjuk
        method: 'DELETE',
    })
        .then(response => {
            alert('Film törölve');
            location.reload(); // Frissíti az oldalt a filmek új betöltésével
        })
        .catch(error => console.error(error));
}

// Film frissítése
// Film frissítése
function updateFilm(id) {
    const newReleaseYear = prompt('Új kiadási év:');
    if (newReleaseYear) {
        fetch(`api/films/update-release-year/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReleaseYear) // Csak a releaseYear-t küldjük el, nem egy objektumot
        })
            .then(response => {
                if (response.ok) {
                    alert('Film frissítve');
                    location.reload(); // Frissíti az oldalt a filmek új betöltésével
                } else {
                    alert('Hiba történt a film frissítésekor');
                }
            })
            .catch(error => console.error(error));
    }
}


// Modal megnyitása
function openModal() {
    document.getElementById('add-film-modal').style.display = 'block';
}

// Modal bezárása
function closeModal() {
    document.getElementById('add-film-modal').style.display = 'none';
}
