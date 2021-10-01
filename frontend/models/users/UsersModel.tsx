import { get } from 'lodash';
import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { setQuery } from '@services/routing';
import { actionsHooks, volatileHooks } from '@models/hooks';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

export const UsersModel = types.model({
  id: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  position: types.maybeNull(types.string),
  last_name: types.maybeNull(types.string),
  first_name: types.maybeNull(types.string),
  middle_name: types.maybeNull(types.string),
  is_director: types.maybeNull(types.boolean),
}).volatile(self => ({
  errors: {},
  isFetching: false,
...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  ////////////////////
  async setSuggests({value: value=null}){
    if(value && value.length >= 3){
      const query = setQuery({ search: value });
      const response = await request('/users/suggests?'+query, null, 'GET');
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
  ////////////////////
  async setSuggestsDirectors({value: value=null}){
    if(value && value.length >= 3){
      const query = setQuery({ search: value });
      const response = await request('/users/directors/suggests?'+query, null, 'GET');
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
  ////////////////////
  getModel(){
    return new Promise(async(resolve) => {
      const query = setQuery({ id: self['id'] });
      const response = await request('/users?'+query, null, 'GET');
      response['status'] === 200 && applySnapshot(self, response['data']); resolve(response);
    })
  },
  ////////////////////
  createModel(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/users/update', snapshot);
      //////////////////////////
      if(response['status'] === 200){
        this.changeControl('errors', {});
        applySnapshot(self, response['data']);
      } else if(response['status'] === 400) {
        const error = response['data'] ? response['data'] : '';
        try { this.changeControl('errors', JSON.parse(error.replace(/'/g, '"'))) } catch {};
      }
      this.changeControl('isFetching', false);
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  ////////////////////
})).views(self => ({
  getError(path){
    return get(self['errors'], path);
  },
  getUserLabel(){
    let result = '';
    let userModel = self;
    if(userModel['last_name']){
      result = userModel['last_name']
    }
    //////////////////////////
    if(userModel['first_name']){
      if(userModel['first_name'].charAt(0)){
        result = result+' '+userModel['first_name'].charAt(0)+'.'
      }
    }
    //////////////////////////
    if(userModel['middle_name']){
      if(userModel['middle_name'].charAt(0)){
        let separator = '';
        if(result.charAt(result.length-1) !== '.'){
          separator = ' '
        }
        result = result+separator+userModel['middle_name'].charAt(0)+'.'
      }
    }
    //////////////////////////
    return result;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})