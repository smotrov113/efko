import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { setNookie } from 'next-nookies-persist';
import { removeNookie } from 'next-nookies-persist';

import { get } from 'lodash';
import { getSnapshot } from 'mobx-state-tree';

export const LoginModel = types.model({
  username: types.maybeNull(types.string),
}).volatile(self => ({
  errors: {},
  isFetching: false,
})).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  controlAuth(){
    return new Promise(async(resolve) => {
      const response = await request('/auth', null);
      //////////////////////////
      if(response['status'] !== 200) {
        removeNookie('certificate');
      }
      //////////////////////////
      setTimeout(() => resolve(response), 0);
    })
  },
  controlLogin(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/login', snapshot);
      //////////////////////////
      if(response['status'] === 200){
        this.changeControl('errors', {});
        setNookie('certificate', response['data']['certificate']);
      } else if(response['status'] === 400) {
        const error = response['data'] ? response['data'] : '';
        try { this.changeControl('errors', JSON.parse(error.replace(/'/g, '"'))) } catch {};
      }
      //////////////////////////
      this.changeControl('isFetching', false); 
      setTimeout(() => resolve(response), 0);      
    })
  }
})).views(self => ({
  getError(path){
    return get(self['errors'], path);
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})