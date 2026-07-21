import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './app/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AnimationPage = lazy(() => import('./pages/AnimationPage'));

function RouteFallback() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center text-neutral-400">
      加载中…    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Suspense fallback={<RouteFallback />}> <Outlet /> </Suspense>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/animation/:id" element={<AnimationPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}