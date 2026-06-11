import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Notice from '../pages/Notice';
import Components from '../pages/Components';

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
]);