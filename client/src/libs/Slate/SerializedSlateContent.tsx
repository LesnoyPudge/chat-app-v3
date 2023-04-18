import { parseSlateContent } from '@utils';
import { FC, useRef, ReactElement, useCallback } from 'react';
import { Descendant, Text } from 'slate';
import { SlateEmoji, SlateLink, SlateParagraph } from './components';



interface SerializedSlateContent {
    nodes?: string;
}

export const SerializedSlateContent: FC<SerializedSlateContent> = ({ 
    nodes = '', 
}) => {
    const keyRef = useRef(0);

    const serialize = useCallback((nodes: Descendant[]): ReactElement[] => {
        const getKey = () => {
            const current = keyRef.current;
            keyRef.current++;
            return current;
        };

        return nodes.map((node) => {
            const key = getKey();

            if (Text.isText(node)) return <span key={key}>{node.text}</span>;
        
            const serialized = node.children.map((childrenNode) => serialize([childrenNode]));
            
            switch (node.type) {
            case 'paragraph':
                return (
                    <SlateParagraph 
                        serialized
                        key={key}
                    >
                        {serialized}
                    </SlateParagraph>
                );
            case 'emoji':
                return (
                    <SlateEmoji 
                        serialized 
                        code={node.code}
                        key={key}
                    />
                );
            case 'link':
                return (
                    <SlateLink 
                        serialized
                        url={node.url}
                        key={key}
                    >
                        {serialized}
                    </SlateLink>
                );
            default:
                return <>{serialized}</>;
            }

            // switch (node.type) {
            // case 'paragraph':
            //     return <span key={key}>{serialized}</span>;

            // case 'emoji':
            //     return <Emoji className='mx-0.5' code={node.code} key={key}/>;

            // case 'link': 
            //     return <Link href={node.url} key={key}>{node.url}</Link>;

            // default:
            //     return <>{serialized}</>;
            // }
        });
    }, []);

    const value = serialize(parseSlateContent(nodes));
    
    return (
        <>{value}</>
    );
};