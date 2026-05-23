import { useHomePresenter } from '../presenters/useHomePresenter';
import HomeView from '../views/home/HomeView';

export default function Home() {
  const { stats } = useHomePresenter();
  return <HomeView stats={stats} />;
}
