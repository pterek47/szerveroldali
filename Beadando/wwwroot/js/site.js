//hivas
fetch('api/films/films') 
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
                <button onclick="updateFilm(${film.id})">Módosítás</button>
            `;
            filmList.appendChild(filmItem);
        });
    })
    .catch(error => {
        document.getElementById('film-list').innerHTML = '<p>Hiba történt a filmek betöltése során.</p>';
        console.error(error);
    });


let isSubmitting =

document.getElementById('add-film-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

   
    if (isSubmitting) {
        return;
    }

    isSubmitting = true;

    
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const releaseYear = parseInt(document.getElementById('releaseYear').value, 10); // biztos szam legyen

    // ellenorzes
    if (!title || !director || !releaseYear) {
        alert('Kérlek, töltsd ki az összes mezőt!');
        isSubmitting = false; 
        return;
    }

    //post
    fetch('api/films/add-film', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, director, releaseYear })
    })
        .then(response => response.json())
        .then(data => {
            alert('Film hozzáadva');
            location.reload(); 
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
        .then(response => {
            alert('Film törölve');
            location.reload(); 
        })
        .catch(error => console.error(error));
}

//film modostisasa

function updateFilm(id) {
    const title = prompt('Új cím :');
    const director = prompt('Új rendező :');
    const releaseYear = prompt('Új kiadási év :');

    const updatedFilm = {
        title: title || null,
        director: director || null,
        releaseYear: releaseYear ? parseInt(releaseYear, 10) : 0,
    };

    fetch(`api/films/update-film/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFilm),
    })
        .then(response => {
            if (response.ok) {
                alert('Film frissítve');
                location.reload();
            } else {
                alert('Hiba történt a film frissítésekor');
            }
        })
        .catch(error => console.error(error));
}


//  megnyitas
function openFilm() {
    document.getElementById('add-film').style.display = 'block';
}

//  zaras
function closeFilm() {
    document.getElementById('add-film').style.display = 'none';
}
