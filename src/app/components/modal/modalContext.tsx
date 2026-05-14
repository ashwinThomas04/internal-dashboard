import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ModalContextType, ModalEntry, ModalEventRegistry, ModalProviderProps } from "./modal";
import { ModalBackdrop } from "./modalHandler";
import { createPortal } from "react-dom";

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("ModalContext missing");
    return ctx;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [stack, setStack] = useState<ModalEntry[]>([]);
    const [activeModalId, setActiveModalId] = useState<string | null>(null);
    const prevActiveId = useRef<string | null>(null);

    const events = useRef<ModalEventRegistry>({
        open: new Set(),
        close: new Set(),
    });

    const append = (entry: ModalEntry) => {
        setStack(prev => {
            const filtered = prev.filter(e => e.id !== entry.id);
            return [...filtered, entry];
        });
    }

    const remove = (id: string) => {
        setStack(prev => prev.filter(e => e.id !== id));
    }

    const check = (id: string) => {
        if (activeModalId && activeModalId === id) return true;
        else return false;
    }

    const open = (id: string) => {
        setActiveModalId(prev => (prev === id ? prev : id));
    }

    const close = (id?: string) => {
        setActiveModalId(prev => {
            if (!prev) return prev;
            if (id && prev !== id) return prev;
            return null;
        });
    }

    const closeClicked = () => {
        if (activeModalId) {
            const activeItem = stack.filter(m => m.id === activeModalId);
            if (activeItem[0]?.onClose) activeItem[0].onClose();
            else close();
        }
    }

    const on: ModalContextType["on"] = (event, listener) => {
        events.current[event].add(listener);
        return () => {
            events.current[event].delete(listener);
        };
    };

    useEffect(() => {
        const prev = prevActiveId.current;
        const curr = activeModalId;
        if (prev !== curr) {
            if (curr && curr !== prev) events.current.open.forEach(fn => fn(curr));
            if (!curr && prev) events.current.close.forEach(fn => fn(prev));
        }
        prevActiveId.current = curr;
    }, [activeModalId]);

    useEffect(() => {
        return () => {
            events.current.open.clear();
            events.current.close.clear();
        };
    }, []);

    return (
        <ModalContext.Provider value={{ append, remove, check, open, close, closeClicked, on, activeModalId }}>
            {children}
            {createPortal(<ModalBackdrop activeModalId={activeModalId} />, document.body)}
        </ModalContext.Provider>
    )
}