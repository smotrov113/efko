import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getQuery } from '@services/routing';
import { applySnapshot } from 'mobx-state-tree';

import { VacationsModel } from '@models/vacations/VacationsModel';
import { PaginatorModel } from '@models/paginator/PaginatorModel';

export const VacationsList = types.model({
  year: types.maybeNull(types.integer),
  search: types.maybeNull(types.string),
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
}).actions(self =>({
  afterCreate(){
    if(!self['year']) {
      self['year'] = new Date().getFullYear();
    }
  },
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({query: query=null}){
    return new Promise(async(resolve) => {
      const params = getQuery(query);
      this.changeControl('isFetching', true);
      const response = await request('/vacations/list?'+query, null, 'GET');
      //////////////////////////
      if(response['status'] === 200){
        const year = params['year'];
        this.changeControl('isFetching', false);
        this.setModelRow(response['data']['response'], year);
        this.changeControl('response', response['data']['response']);
        applySnapshot(self['paginator'], response['data']['paginator'])
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  setModelRow(node, year){
    node.forEach((item, index) => {
      const date = new Date(0); date.setFullYear(year);
      node[index] = VacationsModel.create({...item, year: date });
    });
  },
})).views(self => ({
  getMaxDate(){
    return new Date(self['year'], 11, 31);
  },
  getMinDate(){
    return new Date(self['year'], 0, 1);
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})