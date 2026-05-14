
export interface DraggableProps {
  children: React.ReactNode;
  className?: string;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}

export interface DragHandlers {
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}

export interface DraggableListProps<T extends Record<string, any>> {
  items: T[];
  onSort: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    dragHandlers: DragHandlers
  ) => React.ReactNode;
  keyField?: keyof T;
}