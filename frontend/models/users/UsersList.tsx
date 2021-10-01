import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { applySnapshot } from 'mobx-state-tree';

import { UsersModel } from '@models/users/UsersModel';
import { PaginatorModel } from '@models/paginator/PaginatorModel';

export const UsersList = types.model({
  search: types.maybeNull(types.string),
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({query: query=null}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const response = await request('/users/list?'+query, null, 'GET');
      //////////////////////////
      if(response['status'] === 200){
        this.changeControl('isFetching', false);
        this.setModelRow(response['data']['response']);
        this.changeControl('response', response['data']['response']);
        applySnapshot(self['paginator'], response['data']['paginator'])
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  initialModelDirectors({query: query=null}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const response = await request('/users/directors/list?'+query, null, 'GET');
      //////////////////////////
      if(response['status'] === 200){
        this.changeControl('isFetching', false);
        this.setModelRow(response['data']['response']);
        this.changeControl('response', response['data']['response']);
        applySnapshot(self['paginator'], response['data']['paginator'])
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  setModelRow(node){
    node.forEach((item, index) => {
      node[index] = UsersModel.create(item);
    });
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})