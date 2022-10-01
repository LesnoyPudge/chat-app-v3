import { createSoftBreakPlugin } from '@udecode/plate';


  
export const softBreakPlugin = createSoftBreakPlugin({
    options: {
        rules: [
            { hotkey: 'ctrl+enter', query: {} },
        ],
    },
});