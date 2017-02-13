module.exports = () => {
    let s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
