import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class NextDocument extends Document {
  render(){    
    return (
      <Html lang='ru'>
        <Head>
          {this['props']['materialStyle']}
          <meta name='theme-color' content='#000000'/>
          <link href='/favicon.ico' rel='shortcut icon' type='image/x-icon'/>
          <link href='//fonts.gstatic.com' rel='preconnect' crossOrigin='anonymous'/>
          <link href='//fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800,900&display=swap' rel='stylesheet'/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

export default NextDocument;