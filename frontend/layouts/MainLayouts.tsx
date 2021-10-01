import React from 'react';
import styles from './class.module.css';
import { observer } from 'mobx-react-lite';
import { MenuLayouts } from './MenuLayouts';
import { ToolbarLayouts } from './ToolbarLayouts';

export const MainLayouts = React.memo<any>(observer((props) => {
  return (
    <div className={styles['main-layouts']}>
      <ToolbarLayouts {...props}/>

      <div className={styles['wrapper']}>
        <div className={styles['menu']}>
          <MenuLayouts {...props}/>
        </div>

        <div className={styles['container']}>
          {props['children']}
        </div>
      </div>
    </div>
  )
}));