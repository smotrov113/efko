import React from 'react';
import { observer } from 'mobx-react-lite';

import { types } from 'mobx-state-tree';
import { actionsHooksRoute } from '@models/hooks';

import { RootStore } from '@store/RootStore';

import { Page401 } from '@pages/_app';
import { MainLayouts } from '@layouts/MainLayouts';
import { ListDirectors } from '@app/directors/ListDirectors';

const user = RootStore['session']['user'];
const index = observer((props) => (
  <MainLayouts {...props}>
    {!user['is_director'] ?
      <Page401 {...props}/>
    :
      <ListDirectors {...props}/>
    }
  </MainLayouts>
));

export const RouteModel = types.model({
  page: types.maybeNull(types.number),
}).actions(self =>({
...actionsHooksRoute(self)
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});

export default index;