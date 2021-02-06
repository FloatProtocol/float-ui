import React from 'react';

export function useAsyncEffect(effect: () => Promise<Function | void>, deps?: React.DependencyList): void {
  React.useEffect(() => {
    let handler: Function | void;

    (async () => {
      handler = await effect();
    })();

    return () => {
      if (handler instanceof Function) {
        handler();
      }
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}