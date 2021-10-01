import React from 'react';
import styles from './class.module.css';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';
import { getNookie } from 'next-nookies-persist';

import { useRouter } from 'next/router';
import { applySnapshot } from 'mobx-state-tree';
import { LoginModel } from '@models/login/LoginModel';

import { MuiTextField, MuiButton } from '@components/core';

export const PageLogin = observer((props) => {
  const router = useRouter();
  const [ model ] = React.useState(LoginModel.create());
  React.useEffect(() => { getNookie('certificate') && router.push('/') }, []);

  /////////////////////////////////////////////////////
  const keydown = (event) => {
    event['keyCode'] === 13 && login();
  }

  React.useEffect(() => {
    document.addEventListener('keydown', keydown);  
    return () => document.removeEventListener('keydown', keydown);  
  });
  /////////////////////////////////////////////////////

  const login = async () => {
    const user = RootStore['session']['user'];
    const response = await model.controlLogin();
    response['status'] === 200 && router.push('/');
    response['status'] === 200 ? applySnapshot(user, response['data']) : null;
    response['status'] === 403 && alert('Ошибка авторизации, повторите попытку или обратитесь к системному администратору');
  }

  return (
    <div className={styles['page-login']}>
      <div className={styles['container']}>
        <img src={'/logo/original.svg'} height={100}/>

        <div className={styles['form']}>
          <MuiTextField
            required={true}
            className={'!mt-[10px]'}
            value={model['username']}
            label={'Имя пользователя'}
            helperText={model.getError('username')}
            error={Boolean(model.getError('username'))}
            onChange={(value)=>model.changeControl('username', value)}
          />

          <MuiButton
            onClick={()=>login()}
            label={'Авторизоваться'}
            loading={model['isFetching']}
            className={'mx-[auto] mt-[20px]'}
          />
        </div>

      </div>
    </div>
  )
})