import React from 'react';
import Head from 'next/head'

import { useRouter } from 'next/router';
import { RootStore } from '@store/RootStore';
import { applySnapshot } from 'mobx-state-tree';

import colors from '@config/colors.module.css';
import { createTheme } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

import stylesError from '@config/errors.module.css';
import { LoginModel } from '@models/login/LoginModel';

import '@config/app.css';
import 'tailwindcss/tailwind.css';

export const MuiTheme = createTheme({
  palette: {
    primary: {
      main: colors['primary']
    }
  }
})

const NextApp = (props) => {
  const router = useRouter();
  const { Component } = props;
  React.useEffect(() => {
    const login = async() => {
      const model = LoginModel.create();
      const user = RootStore['session']['user'];
      const response = await model.controlAuth();
      response['status'] !== 200 ? applySnapshot(user, {}) : null;
      response['status'] === 200 ? applySnapshot(user, response['data']) : null;
      (response['status'] !== 200 && response['status'] === 403) ? router.push('/login') : null;
    }; login();
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{'EFKO'}</title>
        <link rel='manifest' href='/manifest.json'/>
        <meta name='viewport' content='width=device-width, user-scalable=no'/>
      </Head>

      <MuiThemeProvider theme={MuiTheme}>
        <StylesProvider injectFirst={true}>
          <CssBaseline/>
          <Component {...props['pageProps']}/>
        </StylesProvider>
      </MuiThemeProvider>
    </React.Fragment>
  )
}

export default NextApp;

export const Page404 = (props) => {
  return (
    <div className={stylesError['page-404']}>
      <img src={'/errors/404.svg'} width={200}/>
      <div className={stylesError['description']}>
        {'Страница не найдена'}
      </div>
    </div>
  )
}

export const Page401 = (props) => {
  return (
    <div className={stylesError['page-401']}>
      <img src={'/errors/401.svg'} width={200}/>
      <div className={stylesError['description']}>
        {'Доступ запрещен'}
      </div>
    </div>
  )
}