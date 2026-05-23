/**
 * Page container — wires Auth presenter to Auth view.
 * MVP: Presenter (useAuthPagePresenter) + View (AuthView)
 */
import { useAuthPagePresenter } from '../presenters/useAuthPagePresenter';
import AuthView from '../views/auth/AuthView';

export default function Auth() {
  const presenter = useAuthPagePresenter();
  return <AuthView {...presenter} />;
}
