import axios from 'axios';

const API = 'https://pixabay.com/api/';
const API_KEY = '31277829-041385667a49103701e539b4a';
export const PHOTOS_ON_SCREEN = 40;

export async function fetchPhotos(name, pageNumber) {
  try {
    // console.log('виклик фетч');
    const URL = `${API}?key=${API_KEY}&q=${name}&page=${pageNumber}&per_page=${PHOTOS_ON_SCREEN}&image_type=photo&orientation=horizontal&safesearch=true`;
    return await axios.get(URL)
  } catch (error) {console.log(error)}   
} 