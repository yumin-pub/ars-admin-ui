import { StrictMode } from 'react'; //검사기 같은 기능
import { createRoot } from 'react-dom/client'; //리액트야 여기를 작업공간으로 두고 써 라는 명령어

import { RouterProvider } from 'react-router-dom'; //주소 관리 담당
import { router } from './routes/router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import './styles/main.scss';

const queryClient = new QueryClient(); // 우리 프로젝트 전체가 같은 냉장고를 사용하게 해줘
createRoot(document.getElementById('root')!).render( //.render : 화면 그려
									// !는 개발자가 root가 없으면 어떡하냐고 묻는 TS에게 무조건 있다고 확신시켜주는 표시
	<StrictMode>  {/* 검사모드 돌림 */}
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />     {/* 실질적인 현재 프로젝트 시작점 */}
		</QueryClientProvider>
	</StrictMode>,
);