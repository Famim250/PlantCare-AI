import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/Toaster';
import { DevBadge } from './components/DevBadge';
import { DevSettings } from './components/DevSettings';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <DevBadge />
      <DevSettings />
    </>
  );
}