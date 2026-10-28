import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Notice from '../pages/Notice';
import Components from '../pages/Components';

// element 단위 페이지 라우팅 
import BadgePage from '../pages/UISystem/BadgePage';
import PostsPage from '../pages/Posts/PostsPage';
import ButtonPage from '../pages/UISystem/ButtonPage';
import InputPage from '../pages/UISystem/InputPage';
import RadioPage from '../pages/UISystem/RadioPage';
import CheckboxPage from '../pages/UISystem/CheckboxPage';
import SelectPage from '../pages/UISystem/SelectPage';
import ModalPage from '../pages/UISystem/ModalPage';
import TablePage from '../pages/UISystem/TablePage';
import PaginationPage from '../pages/UISystem/PaginationPage';
import LoadingPage from '../pages/UISystem/LoadingPage';
import NotFound from '../pages/NotFound';

/**
 * 라우터 basename
 * Vite base(import.meta.env.BASE_URL)를 따른다. 로컬 개발은 '/', GitHub Pages 데모 빌드는 '/ars-admin-ui/demo/'.
 * React Router에는 끝의 '/'를 뗀 값을 준다. ('/'이면 기본값과 같다)
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
    },
    {
        path: '/notice',
        element: <Notice />,
    },
    {
        path: '/components',
        element: <Components />,
    },
    {
        path: '/ui/button',
        element: <ButtonPage />,
    },
    {
        path: '/ui/input',
        element: <InputPage />,
    },
    {
        path: '/ui/radio',
        element: <RadioPage />,
    },
    {
        path: '/ui/checkbox',
        element: <CheckboxPage />,
    },
    {
        path: '/ui/select',
        element: <SelectPage />,
    },
    {
        path: '/ui/modal',
        element: <ModalPage />,
    },
    {
        path: '/ui/table',
        element: <TablePage />,
    },
    {
        path: '/ui/pagination',
        element: <PaginationPage />,
    },
    {
        path: '/ui/loading',
        element: <LoadingPage />,
    },
    {
        path: '/ui/badge',
        element: <BadgePage />,
    },
    {
        path: '/ui/posts',
        element: <PostsPage />,
    },
    {
        // 위 경로에 없는 주소 (직접 입력, 오래된 링크 등)
        path: '*',
        element: <NotFound />,
    },
], { basename });