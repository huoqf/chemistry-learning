import { Outlet, useLocation, Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { getAnimationConfig } from '@/data/animationRegistry';
import { getGaokaoModel } from '@/data/gaokaoModels';

const PATH_TO_LABEL: Record<string, string> = {};

function getAnimationLabel(id: string): string {
  if (PATH_TO_LABEL[id]) return PATH_TO_LABEL[id];
  const config = getAnimationConfig(id);
  if (config) {
    PATH_TO_LABEL[id] = config.title;
    return config.title;
  }
  return id;
}

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isGaokaoHome = isHome && location.search.includes('view=gaokao');
  const isTreeHome = isHome && !location.search.includes('view=gaokao');

  // 从 URL 解析动画 ID（/animation/:id）
  const animMatch = location.pathname.match(/^\/animation\/(.+)$/);
  const animId = animMatch ? animMatch[1] : null;
  const animLabel = animId ? getAnimationLabel(animId) : null;

  // 从 URL 解析高考母题 ID（/gaokao-tool/:id）
  const gaokaoMatch = location.pathname.match(/^\/gaokao-tool\/(.+)$/);
  const gaokaoId = gaokaoMatch ? gaokaoMatch[1] : null;
  const gaokaoModel = gaokaoId ? getGaokaoModel(gaokaoId) : null;

  return (
    <div className="h-screen bg-neutral-50 flex flex-col overflow-hidden">
      <header className="h-14 shrink-0 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              ChemViz
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium border border-neutral-200">
              高中化学交互学习系统
            </span>
          </div>

          {animLabel && (
            <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-600 font-semibold">{animLabel}</span>
            </div>
          )}

          {gaokaoModel && (
            <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
              <span className="text-neutral-300">/</span>
              <Link to="/?view=gaokao" className="text-neutral-500 hover:text-amber-700 transition-colors font-medium">
                高考提分母题
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-700 font-semibold">{gaokaoModel.title}</span>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold py-4 px-1 border-b-2 transition-colors ${
              isTreeHome
                ? 'text-primary-600 border-primary-500'
                : 'text-neutral-400 border-transparent hover:text-neutral-600 hover:border-neutral-300'
            }`}
          >
            知识地图
          </Link>
          <Link
            to="/?view=gaokao"
            className={`text-sm font-semibold py-4 px-1 border-b-2 transition-colors ${
              isGaokaoHome || Boolean(gaokaoModel)
                ? 'text-amber-600 border-amber-500'
                : 'text-neutral-400 border-transparent hover:text-neutral-600 hover:border-neutral-300'
            }`}
          >
            高考提分母题
          </Link>
        </nav>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
