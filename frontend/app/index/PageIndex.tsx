import React from 'react';
import ReactDom from 'react-dom';
import styles from './class.module.css';

import { observer } from 'mobx-react-lite';
import { serverURL } from '@services/request';

import Frame from 'react-frame-component';
import ReactMarkdown from 'react-markdown';

export const PageIndex = observer((props) => {
  React.useEffect(() => {
    fetch(serverURL+'/storage/readme')
    .then((response) => response.text())
    .then((markdown) => {
      fetch('/css/readme.css')
      .then((response) => response.text())
      .then((style) => MarkdownDOM(markdown, style));
    });
  }, []);

  const MarkdownDOM = (markdown, style) => ReactDom.render(
    <Frame>
      <ReactMarkdown children={markdown}/>
      <style type="text/css">{style}</style>
      <style type="text/css">
        {`
        ::-webkit-scrollbar {
          width: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background: #F2F2F2;
          border: 1px solid #D7D7D7;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        `}
      </style>
    </Frame>
  , document.getElementById("markdown"));

  return (
    <div className={styles['page-index']}>
      <div id="markdown" className={styles['markdown']}></div>
    </div>
  )
})

