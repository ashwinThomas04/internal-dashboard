import { TabsProps } from "./tab";

const HeadingTabs = ({ tabs, onTabClick }: TabsProps) => {

  return (
    <div className="d-flex p-1 gap-1 qb-br-64 qb-heading-tabs-wrapper qb-border-solid-grey">
      {
        tabs.map((tab, i) => {
          const onClick = () => onTabClick(i);
          return <div className={`px-3 py-2 qb-fs-paragraph-sm qb-fw-regular qb-br-64 qb-tab-item ${tab.isActive ? "qb-tab-active qb-text-light" : "qb-text-muted"}`} key={`heading-tab-${i}`} onClick={onClick}>{tab.label}</div>
        })
      }
    </div>
  )
}

export default HeadingTabs;