import React from 'react';

export function useReload(): [VoidFunction, number] {
  const [count, setCount] = React.useState<number>(0);

  return React.useMemo(() => ([
    () => setCount(count => count + 1),
    count,
  ]), [count]);
}