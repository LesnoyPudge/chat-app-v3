import { logger } from '@utils';
import { FC, ReactElement, ReactNode } from 'react';
import { Descendant, Text } from 'slate';
import { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from 'slate-react';
import { Space, RTEModules, Emoji, Link, Memo, RTETypes } from '@components';



const InlineChromiumBugfix: FC = () => {
    return (
        <span
            contentEditable={false}
            className='text-[0px]'
        >
            <Space/>
        </span>
    );
};

export const Render = {
    renderElement: ({
        attributes,
        children,
        element,
    }: RenderElementProps): ReactElement => {
        switch (true) {
            case RTEModules.Emoji.isEmoji(element): {
                return (
                    <Memo>
                        <span
                            className='inline-block mx-0.5 message-emoji-wrapper-size'
                            data-emoji={element.code}
                            {...attributes}
                            contentEditable={false}
                        >
                            <InlineChromiumBugfix/>
                            {children}

                            <span
                                className='text-[0px]'
                                contentEditable={false}
                            >
                                {element.code}
                            </span>

                            <Emoji
                                className='inline-block w-full h-full'
                                code={element.code}
                            />
                            <InlineChromiumBugfix/>
                        </span>
                    </Memo>
                );
            }

            case RTEModules.Link.isLink(element): {
                return (
                    <Memo>
                        <span
                            className='text-color-link'
                            data-url={element.url}
                            {...attributes}
                        >
                            <InlineChromiumBugfix/>

                            {children}

                            <InlineChromiumBugfix/>
                        </span>
                    </Memo>
                );
            }

            case RTEModules.Paragraph.isParagraph(element): {
                return (
                    <Memo>
                        <p {...attributes}>
                            {children}
                        </p>
                    </Memo>
                );
            }

            default: {
                logger.error('unhandled rendering element type');
                return <></>;
            }
        }
    },

    renderLeaf: ({ 
        attributes, 
        children 
    }: RenderLeafProps): ReactElement => {
        return (
            <span {...attributes}>
                {children}
            </span>
        );
    },

    renderPlaceholder: ({
        attributes, 
        children
    }: RenderPlaceholderProps): ReactElement => {
        return (
            <span
                className='translate-y-1/2'
                {...attributes}
            >
                {children}
            </span>
        )
    },

    serialize: (() => {
        const loop = (node: Descendant): ReactNode => {
            const key = String(Math.random());

            if (Text.isText(node)) return (
                <span key={key}>{node.text}</span>
            );

            const value = node.children.map(loop);

            switch (true) {
                case RTEModules.Paragraph.isParagraph(node): {
                    return (
                        <p key={key}>
                            {value}
                        </p>
                    );
                }

                case RTEModules.Emoji.isEmoji(node): {
                    return (
                        <Emoji
                            className='mx-0.5 message-emoji-wrapper-size'
                            code={node.code}
                            key={key}
                        />
                    );
                }

                case RTEModules.Link.isLink(node): {
                    return (
                        <Link
                            className='text-color-link'
                            href={node.url}
                            label='Ссылка на внешний ресурс'
                            key={key}
                        >
                            {value}
                        </Link>
                    );
                }

                default: {
                    logger.error('unhandled element serialization');
                    return value;
                }
            }
        };

        return (nodes: RTETypes.Nodes) => {
            return nodes.map(loop);
        };
    })(),
};