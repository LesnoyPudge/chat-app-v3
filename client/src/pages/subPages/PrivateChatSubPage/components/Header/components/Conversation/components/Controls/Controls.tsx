import { Button } from "@components";
import { FC } from "react";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";



const styles = {
    button: 'size-14 rounded-full bg-red-900 shrink-0'
}

export const Controls: FC = () => {
    return (
        <ScrollableV2 
            className='flex gap-4'
            direction="horizontal" 
            size="hidden"
        >
            <Button
                className={styles.button}
            >
                mute
            </Button>

            <Button
                className={styles.button}
            >
                deaf
            </Button>

            <Button
                className={styles.button}
            >
                hangup
            </Button>
        </ScrollableV2>
    )
}