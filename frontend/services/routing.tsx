import Router from 'next/router';
import { stringify, parse } from 'qs';
import { request } from '@services/request';

export const getQuery = (query) => {
  return parse(query, {decoder});
}

export const setQuery = (query) => {
  return stringify(query, { encode: false, skipNulls: true });
}

export const decoder = (str, decoder, charset) => {
  const strPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
    return strPlus.replace(/%[0-9a-f]{2}/gi, unescape)
  };

  if (/^(\d+|\d*\.\d+)$/.test(str)) { return parseFloat(str) };
  const keywords = { true: true, false: false, null: null, undefined};
  
  if (str in keywords) { return keywords[str] }
  try { return decodeURIComponent(strPlus) } catch (e) { return strPlus }
}

export const AuthControl = async (context) => {
  ////////////////////////////////////////////////////
  const response = await request('/auth', {}, context);
  ////////////////////////////////////////////////////
  if(response['status'] === 403){
    if(context['pathname'] === '/'){
      const param = {location: '/requests'};
      context['res'].writeHead(302, param);
      setTimeout(()=>context['res'].end(),0);  
    }

    if(context['pathname'] === '/requests'){
      return response;
    }

    if(context['pathname'] !== '/login'){
      const param = {location: '/login'};
      context['res'].writeHead(302, param);
      setTimeout(()=>context['res'].end(),0);  
    }
  }  
  return response;
}

export const RouterLoading = (setLoading) => {
  const routeChange = (value) => setLoading(value);
  Router['events'].on('routeChangeError', ()=>routeChange(true));
  Router['events'].on('routeChangeComplete', ()=>routeChange(false));
  Router['events'].on('routeChangeStart', (url,{shallow})=>!shallow?routeChange(true):false);
  return () => {
    Router['events'].off('routeChangeError', ()=>routeChange(false));
    Router['events'].off('routeChangeComplete', ()=>routeChange(false));
    Router['events'].on('routeChangeStart', (url,{shallow})=>!shallow?routeChange(false):false);
  }
};