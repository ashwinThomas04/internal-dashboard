import { useEffect } from "react";
import CONFIG from "../../config";

class TitleHandler {
    private defualt: string;
    private title: string | undefined;
    constructor(defualt: string) {
        this.defualt = defualt;
    }

    update(title: string) {
        this.title = title;
        window.queueMicrotask(this.updateMeta.bind(this));
    }

    clear() {
        this.title = this.defualt;
        window.queueMicrotask(this.updateMeta.bind(this));
    }

    private updateMeta() {
        document.title = this.title ? this.title : this.defualt;
    }
}

const titleManager = new TitleHandler(CONFIG.appMetaTitle);

const Title = ({ children }: { children: string | undefined }) => {

    useEffect(() => {
        if (children) titleManager.update(children);
        return () => titleManager.clear();
    }, [children]);

    return null;
}

export default Title;