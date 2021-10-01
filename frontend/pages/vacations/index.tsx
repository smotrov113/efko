import React from 'react';
import { observer } from 'mobx-react-lite';

import { types } from 'mobx-state-tree';
import { actionsHooksRoute } from '@models/hooks';

import { MainLayouts } from '@layouts/MainLayouts';
import { ListVacations } from '@app/vacations/ListVacations';

const index = observer((props) => (
  <MainLayouts {...props}>
    <ListVacations {...props}/> 
  </MainLayouts>
));

export const RouteModel = types.model({
  year: types.maybeNull(types.number),
  page: types.maybeNull(types.number),
  search: types.maybeNull(types.string),
}).actions(self =>({
...actionsHooksRoute(self)
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});

export default index;