export const getBuildFromString = (build, evilities) => {
    const evilityNumbers = build.split("_");
    const ret = [];
    for (const num of evilityNumbers) {
        const intNum = parseInt(num, 10);
        if (!isNaN(intNum)) {
            const ev = evilities.filter(x => x.number === intNum)[0];
            if (ev) {
                ret.push(ev);
            }
        }
    }

    return ret;
};
