/*
|--------------------------------------------------------------------------
| Elements
|--------------------------------------------------------------------------
*/

const moviesContainer =
document.getElementById('moviesContainer');

const loading =
document.getElementById('loading');

const searchInput =
document.getElementById('searchInput');

const toast =
document.getElementById('toast');

/*
|--------------------------------------------------------------------------
| Initial Load
|--------------------------------------------------------------------------
*/

fetchMovies();

/*
|--------------------------------------------------------------------------
| Live Search
|--------------------------------------------------------------------------
*/

let timeout;

searchInput.addEventListener('keyup', () => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

        const search =
        searchInput.value.trim();

        fetchMovies(search);

    }, 500);
});

/*
|--------------------------------------------------------------------------
| Fetch Movies
|--------------------------------------------------------------------------
*/

async function fetchMovies(search = ''){

    loading.classList.remove('hidden');

    moviesContainer.innerHTML = '';

    try{

        const response =
        await fetch(
            `api/movies.php?search=${search}`
        );

        if(!response.ok){

            throw new Error(
                'API Request Failed'
            );
        }

        const data =
        await response.json();

        console.log(data);

        /*
        |--------------------------------------------------------------------------
        | Validate Results
        |--------------------------------------------------------------------------
        */

        if(
            !data.results ||
            data.results.length === 0
        ){

            loading.classList.add('hidden');

            moviesContainer.innerHTML = `

                <div class="empty-state">

                    <h2>
                        😕 No Movies Found
                    </h2>

                    <p>
                        Try searching another movie.
                    </p>

                    <button
                        class="recommend-btn"
                        onclick="loadTrendingMovies()"
                    >
                        Show Recommended Movies
                    </button>

                </div>
            `;

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Render Movies
        |--------------------------------------------------------------------------
        */

        renderMovies(data.results);

    }catch(error){

        console.log(error);

        showToast(
            'Something Went Wrong',
            'error'
        );
    }

    loading.classList.add('hidden');
}

/*
|--------------------------------------------------------------------------
| Load Trending Movies
|--------------------------------------------------------------------------
*/

function loadTrendingMovies(){

    searchInput.value = '';

    fetchMovies();
}

/*
|--------------------------------------------------------------------------
| Render Movies
|--------------------------------------------------------------------------
*/

function renderMovies(movies){

    let output = '';

    movies.forEach(movie => {

        const poster =
        movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750';

        output += `

            <div class="movie-card">

                <img
                    src="${poster}"

                    alt="${movie.title}"

                    onerror="
                        this.src=
                        'https://via.placeholder.com/500x750'
                    "
                >

                <div class="movie-content">

                    <h2>
                        ${movie.title}
                    </h2>

                    <div class="movie-info">

                        <span>
                            ⭐ ${movie.vote_average}
                        </span>

                        <span>
                            📅 ${movie.release_date}
                        </span>

                    </div>

                    <p class="movie-description">

                        ${(movie.overview || '')
                        .substring(0,180)}...

                    </p>

                </div>

            </div>
        `;
    });

    moviesContainer.innerHTML = output;
}

/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

function showToast(message, type){

    toast.innerText = message;

    if(type === 'error'){

        toast.style.background = '#ef4444';

    }else{

        toast.style.background = '#22c55e';
    }

    toast.classList.add('show');

    setTimeout(() => {

        toast.classList.remove('show');

    }, 3000);
}