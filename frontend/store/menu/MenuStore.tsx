import { types } from 'mobx-state-tree';
import { HelpCircleIcon } from '@components/icons';
import { CalendarIcon, UsersIcon } from '@components/icons';

export const MenuLeft = [
  {
    link: '/',
    label: 'О проекте',
    icon: <HelpCircleIcon/>,
  },
  {
    link: '/vacations',
    label: 'Календарь',
    icon: <CalendarIcon/>,
  },
  {
    link: '/directors',
    label: 'Руководители',
    icon: <UsersIcon/>,
  },
];

export const MenuModel = types.model({
  link: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
}).volatile(self => ({
  icon: null,
  select: false,
})).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const MenuStore = types.model({
  left: types.optional(types.array(types.late(()=>MenuModel)), []),
}).actions(self =>({
  afterCreate(){
    MenuLeft.forEach(item => {
      const model = MenuModel.create(item);
      model.changeControl('icon', item['icon']); self['left'].push(model);
    });
  },
  setSelect({menu: menu, router: router}){
    menu.forEach(row => {
      /////////////////////////////////////////////////
      row.changeControl('select', false);
      if(row['link'] !== '/' ){
        if(router['pathname'].indexOf(row['link']) > -1){
          row.changeControl('select', true);
        }
      } else {
        if(router['pathname'] === row['link']){
          row.changeControl('select', true);
        }
      }
      /////////////////////////////////////////////////
      (row['children'] || []).forEach(subRow => {
        subRow.changeControl('select', false);
        if(router['pathname'] === subRow['link']){
          subRow.changeControl('select', true);
        }
      })
      /////////////////////////////////////////////////
    });
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})