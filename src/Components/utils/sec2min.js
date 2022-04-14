export const secs2min = (seconds) => {
    let mins = (seconds / 60) <= 9 ? "0" + Math.floor(seconds / 60).toString() :
        (seconds / 60).toPrecision(2).toString();
    let secs = (seconds % 60) <= 9 ? "0" + Math.round(seconds % 60).toString() :
        (seconds % 60).toPrecision(2).toString();
    return mins + ":" + secs;
}