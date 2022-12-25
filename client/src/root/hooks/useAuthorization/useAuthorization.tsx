import { useState, useRef, useEffect } from 'react';



export const useAuthorization = () => {
    const [isAuthorized, setIsisAuthorized] = useState(false);
    const timeoutRef = useRef(0);

    
    // useEffect(() => {
    //     timeoutRef.current = setTimeout(() => {
    //         setIsisAuthorized(true);
    //     }, 4000);

    //     return () => {
    //         clearTimeout(timeoutRef.current);
    //     };
    // }, []);
};