class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    subscribe(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    }
  
    emit(eventName, data) {
      const eventCallbacks = this.events[eventName];
      if (eventCallbacks) {
        eventCallbacks.forEach(callback => callback(data));
      }
    }
  }

  const eventEmitter = new EventEmitter();
export default eventEmitter;