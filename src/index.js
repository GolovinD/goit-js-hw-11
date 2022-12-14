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
const btnLoadMoreRef = document.querySelector('.btn-load-more')

formRef.addEventListener('submit', onSubmit);
btnLoadMoreRef.addEventListener('click', onLoadMore);

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
        btnLoadMoreRef.classList.remove('visually-hidden');
        // document.addEventListener('scroll', onInfiniteScroll);
        addIntersectionObserver();
    } catch (error) {console.log(error)}       
}

function addIntersectionObserver() {
    const lastFoto = document.querySelector('.photo-card:last-child');
    if (lastFoto) {
        onInfiniteObserver.observe(lastFoto);
    }
}

const onInfiniteObserver = new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        onLoadMore();
    }
})

// function onInfiniteScroll() {
    
//     const { scrollHeight, scrollTop, clientHeight} = document.documentElement;
//     // console.log('scrollHeight', scrollHeight);
//     // console.log('scrollTop', scrollTop);
//     if (2000 > Number(scrollHeight) - Number.parseInt(scrollTop)) {
//         onLoadMore();
//     }
// }

async function onLoadMore(evt) {
    
    pageNumber += 1;
    const numberOfPhotos = pageNumber * PHOTOS_ON_SCREEN;

    if (numberOfPhotos > totalFoundPhotos) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        // document.removeEventListener('scroll', onInfiniteScroll)
        btnLoadMoreRef.classList.add('visually-hidden');
        return
    }
    try {
        const response = await fetchPhotos(requestData, pageNumber);        
        const newPhotos = response.data.hits        
        createMarkupPhotos(newPhotos);      
        lightbox.refresh();
        addIntersectionObserver();
        console.log('???????????????????????? ????????????????', pageNumber);
        console.log('???????????????????????? ????????', numberOfPhotos);
        console.log('totalFoundPhotos', totalFoundPhotos);
    }
    catch (error) {
        console.log(error); 
    };
}

function clearRequest() {
    
    // document.removeEventListener('scroll',onInfiniteScroll);
    btnLoadMoreRef.classList.add('visually-hidden'),
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