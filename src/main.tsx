import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ImgUtil } from './utils/imgUtils';
//  缓存图片
ImgUtil.storageImgList();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
