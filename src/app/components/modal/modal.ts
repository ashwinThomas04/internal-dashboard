import { ReactNode } from "react";

type ModalSizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ModalEvent = "open" | "close";
export type ModalEventListener = (id: string) => void;
export type ModalEventRegistry = {
  open: Set<ModalEventListener>;
  close: Set<ModalEventListener>;
};
export interface ModalEntry {
  id: string;
  width?: ModalSizeType
  onClose?: () => void
};
export interface ModalPropsType {
  id: string,
  children: ReactNode,
  width?: ModalSizeType,
  onClose?: () => void
}
export interface ModalProviderProps {
  children: ReactNode,
}
export interface ModalContainerProps extends ModalPropsType {
  activeModalId: string | null,
  onClose: () => void,
}
export interface ModalContextType {
  activeModalId: string | null
  append: (entry: ModalEntry) => void;
  remove: (id: string) => void;
  open: (id: string) => void;
  close: (id?: string | undefined) => void;
  closeClicked: () => void;
  check: (id: string) => boolean;
  on: (
    event: ModalEvent,
    listener: ModalEventListener
  ) => () => void;
};
export interface ModalHandlerProps {
  entry: ModalPropsType
}
