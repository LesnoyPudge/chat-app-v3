import { RTEModules, RTETypes } from '@components';
import { isProd } from '@utils';
import { Editor, Transforms, Element, Range, Text, Node } from 'slate';



export const Dev = {
    withDevWindow: ({ editor }: RTETypes.Helpers.WithEditor) => {
        if (isProd()) return editor;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!window.slate) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.slate = {
                editor,
                Editor,
                RTEModules,
                Node,
                Text,
                Range,
                Element,
                Transforms,
            };
        }

        return editor;
    },
};