import EventListener from './eventListener'
const global = global || {};
global.event = EventListener({});
export default global;