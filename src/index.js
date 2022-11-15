import './css/styles.css';
import {PHOTOS_ON_SCREEN, fetchPhotos} from "./js/fetchCountries"

import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = new SimpleLightbox('.gallery a');

let requestData = ``;
let totalFoundPhotos = null;
let pageNumber = 1;

const formRef = document.querySelector('#search-form');
const photoGalleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
    evt.preventDefault();
    clearRequest();     
    requestData = evt.currentTarget.elements.searchQuery.value.trim();

    if (!formRef.searchQuery.value) {
        Notiflix.Notify.warning(`Please enter data to search.`);  
        return
    }
    try {
        const response = await fetchPhotos(requestData, pageNumber)
        const photos = response.data.hits
        totalFoundPhotos = response.data.totalHits
    
        if (photos < 1) {
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            return
        }
        Notiflix.Notify.info(`Hooray! We found ${totalFoundPhotos} images.`);
        createMarkupPhotos(photos);
        lightbox.refresh();
        window.addEventListener('scroll', onInfiniteScroll);
    } catch (error) {console.log(error)}       
}

function onInfiniteScroll() {
    
    const { scrollHeight, scrollTop, clientHeight, deltaY } = document.documentElement;
    if (1000 > scrollHeight - scrollTop) {
        onLoadMore();
    }
}

async function onLoadMore(evt) {
    
    pageNumber += 1;
    const numberOfPhotos = pageNumber * PHOTOS_ON_SCREEN;

    if (numberOfPhotos > totalFoundPhotos) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        window.removeEventListener('scroll', onInfiniteScroll);
        return
    }
    try {
    const response = await fetchPhotos(requestData, pageNumber)        
    const newPhotos = response.data.hits        
    createMarkupPhotos(newPhotos);      
    lightbox.refresh();
    console.log('завантаження сторінки', pageNumber);
    console.log('завантаженно фото', numberOfPhotos);
    }
    catch (error) {
        console.log(error); 
    };
}

function clearRequest() {
    
    window.removeEventListener('scroll', onInfiniteScroll);
    photoGalleryRef.innerHTML = '';
    pageNumber = 1;
    totalFoundPhotos = null;
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