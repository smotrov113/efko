import React from 'react';
import { MainLayouts } from '@layouts/MainLayouts';

import { observer } from 'mobx-react-lite';
import { PageIndex } from '@app/index/PageIndex';

const index = observer((props) => {
  return (
    <MainLayouts {...props}>
      <PageIndex {...props}/>
    </MainLayouts>
  )
})

export default index;