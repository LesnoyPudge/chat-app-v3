import { useEventListener } from 'usehooks-ts';



export const useDebug = () => {
    const handleKeydown = (e: KeyboardEvent) => {
        const toggleDebug = () => {
            const currentValue = document.documentElement.dataset.debug as 'false' | 'true';
            document.documentElement.dataset.debug = currentValue === 'false' ? 'true' : 'false';

            if (currentValue === 'false') {
                console.log(`${document.querySelectorAll('*').length} DOM elements`);


                // const buttons = document.getElementsByTagName('button');
                // const positionCounts: { [position: string]: {count: number, buttons: HTMLButtonElement[]} } = {};

                // for (let i = 0; i < buttons.length; i++) {
                //     const button = buttons[i] as HTMLButtonElement;
                //     const computedStyle = window.getComputedStyle(button);
                //     const position = computedStyle.getPropertyValue('position');

                //     if (positionCounts[position] && positionCounts[position].buttons) {
                //         positionCounts[position].count++;
                //         positionCounts[position].buttons.push(button);
                //     } else {
                //         positionCounts[position] = {
                //             count: 1,
                //             buttons: [button],
                //         };
                //     }
                // }

                // console.log('Button counts by position:');
                // for (const position in positionCounts) {
                //     // if (positionCounts.hasOwnProperty(position)) {
                //     console.log(`Position: ${position}, Count: ${positionCounts[position].count}`);
                //     // }

                //     if (position !== 'static' && position !== 'absolute') {
                //         console.log(positionCounts[position].buttons);
                //     }
                // }



                // const buttons = document.getElementsByTagName('button');
                // const buttonsWithAbsolutePosition: HTMLButtonElement[] = [];

                // for (let i = 0; i < buttons.length; i++) {
                //     const button = buttons[i] as HTMLButtonElement;
                //     const computedStyle = window.getComputedStyle(button);
                //     const position = computedStyle.getPropertyValue('position');

                //     if (position === 'absolute') {
                //         buttonsWithAbsolutePosition.push(button);
                //     }
                // }

                // if (buttonsWithAbsolutePosition.length === 0) {
                //     console.log('No buttons with position absolute found.');
                // } else {
                //     console.log(`${buttonsWithAbsolutePosition.length} buttons with position absolute`);
                //     console.log(buttonsWithAbsolutePosition[0]);
                //     console.log(buttonsWithAbsolutePosition.at(-1));
                // }
            }
        };

        if (e.key === '4') toggleDebug();
    };

    useEventListener('keydown', handleKeydown);
};