import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Notice from '../pages/Notice';
import Components from '../pages/Components';

// element 단위 페이지 라우팅 
import ButtonPage from '../pages/UISystem/ButtonPage';

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
]);