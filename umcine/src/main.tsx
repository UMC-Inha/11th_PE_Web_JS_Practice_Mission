//React app을 HTML의 root 요소에 연결하는 시작 파일

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App /> 
  </StrictMode>,
)
//App 컴포넌트를 StrictMode로 감싸서 렌더링.
//StrictMode는 개발 모드에서만 활성화되며, 잠재적인 문제를 감지하고 경고를 표시하는 데 도움을 준다.