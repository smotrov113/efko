import React from 'react';
import { MainLayouts } from '@layouts/MainLayouts';

import { Page404 } from '@pages/_app';
import { observer } from 'mobx-react-lite';

const index = observer((props) => {
  return (
    <MainLayouts {...props}>
      <Page404 {...props}/>
    </MainLayouts>
  )
})

export default index;