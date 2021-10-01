export { debounce as debounce } from 'lodash';
import { getNookie } from 'next-nookies-persist';

////////////////////////
export const devURL = 'http://89.223.67.216:3030';
export const prodURL = 'https://api.smotrov.webtm.ru';
export const serverURL = process['env']['NODE_ENV'] === 'production' ? prodURL : devURL;
////////////////////////

export const maxAge = 60*60*24*365*10;
export const request = async (url, body, method = 'POST') => {
  try {
    const response = await fetch(serverURL+url,
      {
        method: method,
        body: method === 'POST' ? JSON.stringify(body) : null,
        headers: {'Content-Type': 'application/json', 'Certificate': getNookie('certificate')}
      }
    )
    const result = await response.json();
    ////////////////////////
    if(!response['ok']){
      if(response['status'] !== 403){
        if(response['status'] !== 400){
          alert(result['error']);
        } else if(response['status'] === 400){
          console.log(result['error']);
        }
      }
    };
    ////////////////////////
    return response['ok'] ? {
      'data': result,
      'status': response['status']
    } : {
      'data': result['error'],
      'status': response['status']
    }
    ////////////////////////
  } catch (error) {
    ////////////////////////
    alert(error['message']);
    ////////////////////////
    return {
      'status': 503,
      'data': error['message']
    }
  }
}