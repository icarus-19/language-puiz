// Simple memoization function
export function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Memoized component factory
export function memoizeComponent(Component, propsAreEqual) {
  return React.memo(Component, propsAreEqual);
}

// Cache expensive calculations
export function createMemoizedSelector(selectors, combiner) {
  let lastArgs = [];
  let lastResult = null;
  
  return function(...args) {
    const selectedValues = selectors.map(selector => selector(...args));
    
    if (lastResult !== null && 
        selectedValues.length === lastArgs.length &&
        selectedValues.every((val, i) => val === lastArgs[i])) {
      return lastResult;
    }
    
    lastArgs = selectedValues;
    lastResult = combiner(...selectedValues);
    return lastResult;
  };
}