export const rand2B = () => {
    let out = "";
    for (let i = 0; i < 2; i++) {
        out += Math.floor(Math.random() * 36).toString(36);
    };
    return out.toUpperCase();
}

export const rand4B = () => {
    let out = "";
    for (let i = 0; i < 4; i++) {
        out += Math.floor(Math.random() * 36).toString(36);
    };
    return out.toUpperCase();
}

export const chrono10 = () => {
    const tt = Date.now().toString(36).toUpperCase();
    const r2b = rand2B();
    return tt + r2b;
}

export const chrono12 = () => {
    const tt = Date.now().toString(36).toUpperCase();
    const r4b = rand4B();
    return tt + r4b;
}