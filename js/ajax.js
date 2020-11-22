import UiKit from "uikit";
import { urls } from "./http";
const cards = document.getElementById("cards");
const cardMovie = document.getElementById("cardMovie");
let params = {};

const getMovies = async (params) => {
  try {
    params.title = params.title || '';
    params.type = params.type || '';
    params.page = params.page || 1;
    const res = await fetch(`${urls.search}&s=${params.title}&type=${params.type}&page=${params.page}`);
    const parsedRes = await res.json();
    return parsedRes;
  } catch (error) {
    UiKit.notify({ message: error, status: "danger" });
  }
};

const getMovieById = async (movie_id) => {
  try {
    const res = await fetch(`${urls.search}&i=${movie_id}`);
    const parsedRes = await res.json();
    return parsedRes;
  } catch (error) {
    UiKit.notify({ message: error, status: "danger" });
  }
};

const getFavotitesMovies = async () => {
  try {
    let data = {};
    let favorites = getFavouritesItems();
    if (favorites.length > 0) {
      data.Response = "True";
      data.totalResults = favorites.length;
      data.Search = [];

      async function processArray(favorites) {
        for (const favorite of favorites) {
          const item = await getMovieById(favorite);
          data.Search.push(item);
        }
      }
      await processArray(favorites);
    } else {
      data.Response = "False";
      data.Error = "Your Favirite list is empty.";
    }
    renderCards(data, true);
  } catch (error) {
    console.log(error);
    UiKit.notify({ message: error, status: "danger" });
  }
};

const links = () => {
  [].forEach.call(document.querySelectorAll('.details-btn'), function(el) {
    el.addEventListener('click', async function(e) {
      e.preventDefault();
      const targetElement = e.target || e.srcElement;
      const movieId = targetElement.getAttribute('data-movie-id');
      const data = await getMovieById(movieId);
      renderMovieCard(data);
      scrollTo(cardMovie);
    })
  });
  [].forEach.call(document.querySelectorAll('.favorite_movie'), function(el) {
    el.addEventListener('click', async function(e) {
      e.preventDefault();
      const targetElement = e.target || e.srcElement;
      const movieId = targetElement.getAttribute('data-movie-id');
      addMovieToFavourite(movieId, targetElement);
    })
  })
};

const addMovieToFavourite = (id, el) => {
  if (!id) return;
  let favorites = getFavouritesItems();
  const index = favorites.indexOf(id);
  // item is not favorite
  if (index == -1) {
    favorites.push(id);
    el.classList.add("active_add");
  // item is already favorite
  } else {
    favorites.splice(index, 1);
    el.classList.remove("active_add");
  }
  // store array in local storage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  let favBtnEl = document.getElementsByClassName('favorite_btn');
  if (favBtnEl.length) {
    favBtnEl = favBtnEl[0];
  }
  if (!favorites.length) {
    favBtnEl.style.display = "none";
  } else {
    favBtnEl.style.display = "inline-block";
  }
}
const getFavouritesItems = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites;
} 
const scrollTo = (el) => {
  window.scroll({top: el.offsetTop, left: 0, behavior: 'smooth'});
}
const renderCards = (data = [], allItems = false) => {
  if (data.Response.toLowerCase() == 'true') {
    if (data.Search.length) {
      cards.innerHTML = data.Search
        .map(({ Title: title, Poster: thumb, Year: year, imdbID: id }) => {
          let favorites = getFavouritesItems();
          const index = favorites.indexOf(id);
          let inFavorites = false;
          if (index != -1) {
           inFavorites = true; 
          }
          return `
          <div>
            <div class="uk-card uk-card-default uk-height-viewport="expand: true"">
              <div class="uk-card-media-top uk-text-center">
                <img data-src="${thumb}" data-width="1000" data-height="500" width="100%" alt="UIkit cards" uk-img>           
              </div>
              <div class="uk-card-body uk-text-center">
                <h3 class="uk-card-title">${title} (${year})</h3>
                <p class="uk-text-primary">Add to favorite</p>
                <span class="favorite_movie ${(inFavorites ? 'active_add' : '')} " data-movie-id="${id}"></span>
              </div>
              <div class="uk-card-footer uk-text-center">
                <a class="uk-button uk-button-default details-btn" data-movie-id="${id}" href="#">Details</a>
              </div>
            </div>
          </div>`;
        })
        .join("");
      data.totalResults = +data.totalResults;
      if (!allItems && data.totalResults > 10) {
        buidPagination({
          items:data.totalResults,
          itemsOnPage:10,
          displayedPages:3,
          currentPage: params.page
        });
      }
      links();
    }
  } else {
    cards.innerHTML = `
    <div class="uk-alert-danger uk-width-1-1" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>${data.Error}</p>
    </div>`;
  }
};

const renderMovieCard = (data = []) => {
  if (data.Response.toLowerCase() == 'true') {
    let favorites = getFavouritesItems();
    const index = favorites.indexOf(data.imdbID);
    let inFavorites = false;
    if (index != -1) {
      inFavorites = true; 
    }
    cardMovie.innerHTML = 
    `
          <div class="uk-flex uk-flex-center">
            <div class="uk-card uk-card-default  uk-width-1-2@m uk-width-1-1">
              <div class="uk-card-media-top uk-text-center">
                <img data-src="${data.Poster}" data-width="1000" data-height="500" width="100%" alt="UIkit cards" uk-img>           
              </div>
              <div class="uk-card-body uk-text-left">
                <h3 class="uk-card-title uk-text-center">${data.Title} (${data.Year})</h3>
                <p>Actors: ${data.Actors}</p>
                <p>Plot: ${data.Plot}</p>
                <p>Rating: ${data.imdbRating}</p>
                <p>Writer: ${data.Writer}</p>
                <p>Released: ${data.Released}</p>
                <p>Awards: ${data.Awards}</p>
                <p>Genre: ${data.Genre}</p>
                <p class="uk-text-center">Add to favorite</p>
                <p class="favorite_movie uk-text-center ${(inFavorites ? 'active_add' : '')}" data-movie-id="${data.imdbID}"></p>
              </div>
            </div>
          </div>`;
    [].forEach.call(document.querySelectorAll('#cardMovie .favorite_movie'), function(el) {
      el.addEventListener('click', async function(e) {
        e.preventDefault();
        const targetElement = e.target || e.srcElement;
        const movieId = targetElement.getAttribute('data-movie-id');
        addMovieToFavourite(movieId, targetElement);
      })
    })
  } else {
    cardMovie.innerHTML = `
    <div class="uk-alert-danger uk-width-1-1" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>${data.Error}</p>
    </div>`;
  }
};
const clearMovieCard = () => {
  const element = document.querySelector('#cardMovie');
  element.innerHTML = "";
}
const buidPagination = (data = {}) => {
    if (data.currentPage > 0) data.currentPage--;
    const paginationElement = document.querySelector('.uk-pagination');
    const pagination = UIkit.pagination(paginationElement, data);
    $('.uk-pagination').on('select.uk.pagination', async function(e, pageIndex){
        params.page = (pageIndex+1);
        await paginate(params);
    });
}
const clearPagination = () => {
  const paginationElement = document.querySelector('.uk-pagination');
  paginationElement.remove();
  let el = document.createElement("ul");
  el.setAttribute('class', 'uk-pagination');
  el.innerHTML = "";
  insertAfter(cards, el);
}
const insertAfter = (referenceNode, newNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
const paginate = async (params = {}) => {
  clearMovieCard();
  const data = await getMovies(params);
  renderCards(data);
}
document.addEventListener("DOMContentLoaded", async () => {
  const isFavoritePage = document.getElementsByClassName('favorite_page');
  if (isFavoritePage.length) {
    await getFavotitesMovies();
  } else {
    const favorites = getFavouritesItems();
    if (!favorites.length) {
      let favBtnEl = document.getElementsByClassName('favorite_btn')[0];
      favBtnEl.style.display = "none";
    }
  }
  const form = document.getElementById("form");
  if (form && form.length) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        params = {
          title: document.querySelector("[name='title']").value,
          type: document.querySelector("[name='type']:checked").value,
          page: 1,
        };
        clearPagination();
        clearMovieCard();
        const data = await getMovies(params);
        console.log(data);
        renderCards(data);
        return;
      } catch (error) {
        console.log(error);
        UIkit.notify({ message: error, status: "danger" });
      }
    });
  }
});
