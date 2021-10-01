
import Router from 'next/router';
import { stringify, parse } from 'qs';

import { decoder } from '@services/routing';
import { getType, onSnapshot } from 'mobx-state-tree';
import { getRandonKey, isObject } from '@services/general';
import { applySnapshot, getSnapshot, getChildType } from 'mobx-state-tree';

export const actionsHooks = (self) => {
  return {
    afterCreate(){
      self['component'] = getRandonKey();
      onSnapshot(self, snapshot => {
        this.changeControl('component', getRandonKey());
      })
    },
    changeControl(contol, value){
      self[contol] = value;
    },
    selectControl(value, skipFields=[]){
      const snapshot = value ? {...value} : {};
      skipFields.forEach(item=>snapshot[item] = self[item]);
      applySnapshot(self, snapshot);
    },
  }
}

export const actionsHooksRoute = (self) => {
  return {
    changeControl(contol, value){
      self[contol] = value;
    },
    push({params: params={}, shallow: shallow=false, router: router=false}){
      const config = {encode: false, skipNulls: true};
      const query = parse(stringify(Router['query']), {decoder});
      let model = {}; this.converModel(query); this.converModel(params);
      router === true ? model = {...query, ...params} : model = {...params};
      const mobx = getType(self).create(model); const snapshot = getSnapshot(mobx);

      console.log(Router['pathname']+'?'+stringify(snapshot, config));

      Router.push(Router['pathname']+'?'+stringify(snapshot, config), null, { shallow: shallow });
    },
    converModel(object, model = self){
      for (let key in object) {
        if (isObject(object[key]) && !!Object.keys(object[key]).length){
          model ? this.converModel(object[key], model[key]) : null;
        } else if(getChildType(model, key) && getChildType(model, key)['name'] === '(string | null)'){
          if (typeof object[key] !== 'string' || !(object[key] instanceof String)){
            object[key] = object[key] ? String(object[key]) : null;
          }
        }
      }
    }
  }
};

export const volatileHooks  = (self) => {
  return {
    suggests: [],
    component: null,
  }
}