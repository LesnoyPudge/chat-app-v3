import { FC } from "react";
import styles from "./ScrollableV2.module.scss";
import { cn } from "@utils";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type ScrollableV2 = (
    {

    } 
    & RT.PropsWithChildrenAndClassName
);

export const ScrollableV2: FC<ScrollableV2> = ({
    className = '',
    children,
}) => {
    return (
        <div 
            className={[styles.scrollable, className].join(' ')}
        >
            {children}
        </div>
    )
}