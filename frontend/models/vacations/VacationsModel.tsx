import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { UsersModel } from '@models/users/UsersModel';
import { actionsHooks, volatileHooks } from '@models/hooks';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

export const VacationsModel = types.model({
  id: types.maybeNull(types.string),
  year: types.maybeNull(types.Date),
  date_end: types.maybeNull(types.Date),
  date_start: types.maybeNull(types.Date),
  is_agreed: types.maybeNull(types.boolean),
  user: types.maybeNull(types.late(()=>UsersModel)),
}).volatile(self => ({
...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  ////////////////////
  changeControl(contol, value){
    ////////////////////
    if(contol === 'is_agreed') {
      if(!self['date_end'] || !self['date_start']) {
        alert('Для согласования требуется указать даты'); return;
      }
    }
    ////////////////////
    self[contol] = value;
    ////////////////////
    if(contol === 'is_agreed') {
      this.createModel();
    }; if(contol === 'date_end' || contol === 'date_start') {
      this.createModel();
    }
    ////////////////////
  },
  ////////////////////
  createModel(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/vacations/update', snapshot);
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
  getMinDate(){
    return new Date(self['year'].getFullYear(), 0, 1);
  },
  getMaxDate(){
    return new Date(self['year'].getFullYear(), 11, 31);
  },
  getOnlyView(RootStore){
    const user = RootStore['session']['user'];
    if(user['is_director'] === false) {
      if(user['id'] !== self['user']['id']) {
        return true;
      } 
    }
    return self['is_agreed'];
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})