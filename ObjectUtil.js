// 객체의 속성명으로 속성값 찾아 반환. 같은 속성명 존재 시 depth가 깊은 속성값 반환
function getLastProp(object, propName) {
  let propNames;

  if (typeof propName === 'string') {
    propNames = propName.split('.');
  } else if (Array.isArray(propName)) {
    propNames = propName;
  } else {
    throw new Error(`[object-util] Arguement must be a string or array (ex, 'user.address.city' or ['user', 'address', 'city]) -> propName: ${propName}`);
  }

  let currentProp = object;

  propNames.some((name, index) => {
    if (index === propName.length - 1) {
      return true;
    }

    if (typeof currentProp[name] === 'object') {
      currentProp[name] = {
        ...currentProp[name],
      };
    } else if (Array.isArray(currentProp[name])) {
      currentProp[name] = [
        ...currentProp[name],
      ];
    } else {
      throw new Error(`[object-util] Object and propNames do not match -> propName: ${propName}, target: ${name}`);
    }

    currentProp = currentProp[name];
    return false;
  });

  return {
    lastProp: currentProp,
    lastPropName: propNAmes[propNames.length - 1],
  };

}

// 객체의 속성명으로 속성값 세팅
function setPropValue(object, propName, propValue) {
  const { lastProp, lastPropName } = getLastProp(object, propName);
  
  lastProp[lastPropName] = propValue;

  return { ...object };
}

function togglePropValue(object, propName) {
  const { lastProp, lastPropName } = getLastProp(object, propName);

  lastProp[lastPropName] = !lastProp[lastPropName];

  return { ...object };
}

function setPropValueInArray(array, index, propName, propValue) {
  const __array = [...array];

  setPropValue(__array[index], propName, propValue);
  return __array;
}

function toNameValueList(object) {
  const nameValueList = {};
  const nameValues = [];

  Object.keys(object).map(attr => {
    if (typeof object[attr] === 'object' || Array.isArray(object[attr])) {
      nameValues.push({
        name: attr,
        value: JSON.stringify(object[attr]),
      });
    } else {
      nameValues.push({
        name: attr,
        value: object[attr],
      })
    }
  });

  nameValueList.nameValues = nameValues;
  return nameValueList;
}

export default {
  setPropValueInArray,
  setPropValue,
  togglePropValue,
  toNameValueList,
};

export {
  setPropValueInArray,
  setPropValue,
  togglePropValue,
  toNameValueList,
};
