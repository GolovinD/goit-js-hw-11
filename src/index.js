import './css/styles.css';
// import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = new SimpleLightbox('.gallery a');
import axios from 'axios';

const API = 'https://pixabay.com/api/';
const API_KEY = '31277829-041385667a49103701e539b4a';
const PHOTOS_ON_SCREEN = 40;

let requestData = ``;
let totalFoundPhotos = null;

const axios = require('axios');

const fetchPhotos = (name, pageNumber) => {
    
    const URL = `${API}?key=${API_KEY}&q=${name}&page=${pageNumber}&per_page=${PHOTOS_ON_SCREEN}&image_type=photo&orientation=horizontal&safesearch=true`;
    return axios.get(URL)
        .then(response => {
            return response;
        });
} 

const formRef = document.querySelector('#search-form');
const photoGalleryRef = document.querySelector('.gallery');
const btnLoadMoreRef = document.querySelector('.load-more');

formRef.addEventListener('submit', onSubmit);
window.addEventListener('scroll', onListenScroll);

function onSubmit(evt) {

    evt.preventDefault();
    photoGalleryRef.innerHTML = '';
    pageNumber = 1;
    totalFoundPhotos = null;
    // btnLoadMoreRef.addEventListener('click', onLoadMore)
    
    requestData = evt.currentTarget.elements.searchQuery.value.trim();
    console.log(requestData);
    if (!formRef.searchQuery.value) {
        Notiflix.Notify.warning(`Please enter data to search.`);  
        return
    }

    
    fetchPhotos(requestData, pageNumber)
    .then(data => {
        photos = data.data.hits
        totalFoundPhotos = data.data.totalHits
        if (photos < 1) {
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            return
            }
        console.log(data.data.hits);  
        Notiflix.Notify.info(`Hooray! We found ${totalFoundPhotos} images.`);
        createMarkupPhotos(photos); 
        lightbox.refresh();
    })
}

function onListenScroll() {
    console.log('скрол працює');
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    console.log(`сторінка`, scrollHeight);
    console.log(scrollTop);
    console.log(clientHeight);
    if (scrollTop === scrollHeight - clientHeight) {
        console.log('скрол приїхав');
        onLoadMore();
        console.log(clientHeight);
    }
}

function onLoadMore(evt) { 
    pageNumber += 1;
    numberOfPhotos = pageNumber * PHOTOS_ON_SCREEN;
    console.log(pageNumber);
    console.log(numberOfPhotos);
    if (numberOfPhotos > totalFoundPhotos) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        // btnLoadMoreRef.removeEventListener('click', onLoadMore);
        // window.removeEventListener('scroll', onListenScroll);
        return
    }

    fetchPhotos(requestData, pageNumber)
        .then(data => {         
            const newPhotos = data.data.hits        
            createMarkupPhotos(newPhotos);      
            lightbox.refresh();
        })
        .catch(error => {
     
    });
}

function createMarkupPhotos(data) {
    let photos = data.map(item =>
        `<div class="photo-card">
        <a class="gallery__item" href="${item.largeImageURL}">
        <img class="gallery__image"
        src="${item.webformatURL}" 
        alt="${item.tags}"
        loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${item.likes}
        </p>
        <p class="info-item">
        <b>Views</b>
        ${item.views}
        </p>
        <p class="info-item">
        <b>Comments</b>
        ${item.comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${item.downloads}
        </p>
        </div>
        </div>`).join('');
    photoGalleryRef.insertAdjacentHTML('beforeend', photos);
}


