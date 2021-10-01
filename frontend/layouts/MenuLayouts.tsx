import React from 'react';
import styles from './class.module.css';

import { useRouter } from 'next/router';

import { Clsx } from '@components/core';
import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

export const MenuLayouts = React.memo<any>(observer((props) => {
  const router = useRouter();
  /////////////////////////////////////////////////////
  React.useEffect(() => {
    const menu = RootStore['menu']['left'];
    RootStore['menu'].setSelect({menu: menu, router: router});
  }, [router['asPath']])
  /////////////////////////////////////////////////////
  const onClick = (row) => router.push({pathname: row['link']});
  /////////////////////////////////////////////////////
  return (
    <div className={Clsx(styles['menu-layouts'])}>
      <div>
        {RootStore['menu']['left'].map((row, index) => (
          <div key={index} className={styles['row']} onClick={()=>onClick(row)} data-select={row['select']}>
            <div>{row['icon']}</div> <div>{row['label']}</div>
          </div>
        ))}
      </div>
    </div>
  )
}));