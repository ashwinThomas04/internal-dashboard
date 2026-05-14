import { TabsProps } from "./tab";

const Tabs = ({ tabs, fill = false, onTabClick }: TabsProps) => {

  return (
    <div className="d-flex p-1 gap-1 qb-br-64 qb-tabs-wrapper qb-border-solid-grey">
      {
        tabs.map((tab, i) => {
          const onClick = () => onTabClick(i);
          return <div className={`px-3 py-2 qb-fs-paragraph-sm d-flex justify-content-center qb-fw-regular qb-br-64 qb-tab-item ${fill ? "flex-fill " : ""}${tab.isActive ? "qb-tab-active qb-text-dark" : "qb-text-muted"}`} key={`heading-tab-${i}`} onClick={onClick}>{tab.label}</div>
        })
      }
    </div>
  )
}

export default Tabs;