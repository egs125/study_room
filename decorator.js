export function readOnly(target, property, descriptor) {
  return {
    ...descriptor,
    writable: false,
    configurable: false,
  };
}

function instanceProperty(Target, ...constructorArgs) {
  if (!Target._instance) {
    Object.defineProperty(Target, '_instance', {
      value: new Target(...constructorArgs),
      writable: false,
      configurable: false,
      enumerable: false,
    });
  }

  return {
    get() {
      return Target._instance;
    },
    configurable: false,
  };
}

export function instance(...args) {
  if (args.length === 3 && typeof args[0] === 'function' && typeof args[1] === 'string' && typeof args[2] === 'object') {
    return instanceProperty(args[0]);
  } else {
    return Target => instanceProperty(Target, ...args);
  }
}

export function singleton(target) {
  let instant = false;

  class Singleton extends targt {
    constructor(...params) {
      super(...params);

      if (instant || target._instance) {
        throw new Error('This class use only singleton');
      }
      instant = true;
    }
  }

  const propNames = Object.getOwnPropertyNames(target);
  const props = propNames.reduce((currentProps, propName) => ({
    ...currentProps,
    [propName]: Object.getOwnPropertyDescriptor(target, propName),
  }), {});

  Object.defineProperties(Singleton, props);

  return Singleton;
}

export default singleton;

