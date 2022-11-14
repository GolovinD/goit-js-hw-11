

import axios from 'axios';

const API = 'https://pixabay.com/api/';
const API_KEY = '31277829-041385667a49103701e539b4a';
export const PHOTOS_ON_SCREEN = 40;


export async function fetchPhotos(name, pageNumber) {
    console.log('виклик фетч');
    const URL = `${API}?key=${API_KEY}&q=${name}&page=${pageNumber}&per_page=${PHOTOS_ON_SCREEN}&image_type=photo&orientation=horizontal&safesearch=true`;
    return await axios.get(URL)
        
} 


// const fetchCountries = (name) => {
//     const URL = `https://restcountries.com/v3.1/name/${name}/?fields=name,capital,languages,flags,population`;
//     return fetch(URL).then(response => {
//         if (!response.ok) {
//         throw new Error(response.status);
//       }
//         return response.json();
//     });
// }
// return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,languages,flags,population`)

// export { fetchCountries };