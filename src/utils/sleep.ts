const sleep = (millis: number) => new Promise((r) => setTimeout(r, millis));

export default sleep;
