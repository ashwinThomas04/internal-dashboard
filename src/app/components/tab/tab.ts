export type TabItem = {
  label: string;
  value: string;
  isActive: boolean;
}

export type TabsProps = {
  tabs: TabItem[];
  fill?: boolean;
  onTabClick: (index: number) => void;
}