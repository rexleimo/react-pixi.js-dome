import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

function useStateRef<T>(initialValue: T): [T, Dispatch<SetStateAction<T>>, RefObject<T>] {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref];
}

export default useStateRef;     