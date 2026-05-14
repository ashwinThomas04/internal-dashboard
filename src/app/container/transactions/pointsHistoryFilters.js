import { HeadingTabs } from "../../components/tab";

const PointsHistoryFilters = ({ tabs, onTabClick }) => {
  return (
    <div className="w-100 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 pb-4">
      <HeadingTabs tabs={tabs} onTabClick={onTabClick} />


    </div>
  )
}

export default PointsHistoryFilters;
