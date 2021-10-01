import React from 'react';
import styles from './class.module.css';

import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';
import { removeNookie } from 'next-nookies-persist';

import { Clsx } from '@components/core';
import { Menu } from './ToolbarMenuStore';
import { GitIcon } from '@components/icons';
import { PopoverProps } from '@components/props';
import { MuiPopover, MuiSkeleton } from '@components/core';

export const ToolbarLayouts = React.memo<any>(observer((props) => {
  const router = useRouter();
  const user = RootStore['session']['user'];
  const [ openMenu, setOpenMenu ] = React.useState(null);

  const onClickRow = (row) => {
    setOpenMenu(null);
    if(row['key'] === 1){
      removeNookie('certificate'); 
      setTimeout(()=>router.push('/login'), 0);
    }; 
  }

  return (
    <div className={Clsx(styles['toolbar-layouts'], 'h-[40px]')}>
      <div>
        {user.getUserLabel() ? 
          <div className={Clsx(styles['app-label'], 'animated fadeIn')}>
            {'ЭФКО ИС "Календарь отпусков"'}
          </div>
        :
          <div className={styles['skeleton-left']}>
            <MuiSkeleton width={'150px'} height={'3px'}
              animation={'wave'} className={styles['skeleton']}
            />

            <MuiSkeleton width={'150px'} height={'3px'}
              animation={'wave'} className={Clsx(styles['skeleton'], 'mt-[6px]')}
            />
          </div>
        }

        <div className={'flex ml-auto'}>
          {user.getUserLabel() ? 
            <div onClick={(event)=>setOpenMenu(event['currentTarget'])}>
              <div className={styles['user-block']}>
                <GitIcon strokeWidth={2} size={'18px'} color={'#FFF'}/>
                <div className={styles['user-label']}>{user.getUserLabel()}</div>
              </div>
            </div> 
          : 
            <div className={styles['skeleton-right']}>
              <MuiSkeleton width={'150px'} height={'3px'}
                animation={'wave'} className={styles['skeleton']}
              />

              <MuiSkeleton width={'100px'} height={'3px'}
                animation={'wave'} className={Clsx(styles['skeleton'], 'mt-[6px]')}
              />
            </div>
          }
        </div>

        <MuiPopover {...PopoverProps({className: styles['menu-popover']})} open={openMenu} onClose={()=>setOpenMenu(null)}>
          {(Menu || []).map((row, index) => (
            <div className={styles['row']} key={index} onClick={()=>onClickRow(row)}>
              <div className={styles['icon']}>{row['icon']}</div>
              <div className={styles['label']}>{row['label']}</div>
            </div>
          ))}
        </MuiPopover>
      </div>
    </div>
  )
}));