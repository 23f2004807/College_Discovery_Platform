/** Page container — MVP wiring for college list */
import { useCollegeListPresenter } from '../presenters/useCollegeListPresenter';
import CollegeListView from '../views/colleges/CollegeListView';

export default function CollegeList() {
  const presenter = useCollegeListPresenter();
  return <CollegeListView {...presenter} />;
}
