import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Notice from '../pages/Notice';
import Components from '../pages/Components';

// element 단위 페이지 라우팅 
import ButtonPage from '../pages/UISystem/ButtonPage';
import InputPage from '../pages/UISystem/InputPage';
import RadioPage from '../pages/UISystem/RadioPage';
import CheckboxPage from '../pages/UISystem/CheckboxPage';
import SelectPage from '../pages/UISystem/SelectPage';
import ModalPage from '../pages/UISystem/ModalPage';
import TablePage from '../pages/UISystem/TablePage';

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
]);