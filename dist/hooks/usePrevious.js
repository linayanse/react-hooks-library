import { useRef, useEffect } from 'react';
export function usePrevious(value) {
    var ref = useRef(undefined);
    useEffect(function () {
        ref.current = value;
    });
    return ref.current;
}
