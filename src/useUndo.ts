import { useState } from 'react';

export default function useUndo<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = (value: T | ((prev: T) => T)) => {
    setPast((p) => [...p, state]);
    setState((prev) => (typeof value === 'function' ? (value as any)(prev) : value));
    setFuture([]);
  };

  const undo = () => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [state, ...f]);
      setState(prev);
      return p.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, state]);
      setState(next);
      return f.slice(1);
    });
  };

  return { state, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
