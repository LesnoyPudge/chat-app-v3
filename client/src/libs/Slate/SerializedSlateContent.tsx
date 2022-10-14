import { FC, useRef, ReactElement, useCallback, useMemo } from 'react';
import { Descendant, Text } from 'slate';
import { Emoji, Link, Paragraph, TextComponent } from './components';



interface ISerializedNode {
    nodes?: Descendant[];
}

export const SerializedSlateContent: FC<ISerializedNode> = ({ 
    nodes = [{ text: '' }], 
}) => {
    const keyRef = useRef(0);

    const key = () => {
        const current = keyRef.current;
        keyRef.current++;
        return current;
    };

    const serialize = useCallback((nodes: Descendant[]): ReactElement[] => {
        return nodes.map((node) => {
            if (Text.isText(node)) {
                return (
                    <TextComponent
                        text={node.text} 
                        bold={!!node.bold} 
                        italic={!!node.italic}
                        key={key()}
                    />
                );
            }
        
            const serialized = node.children.map((childrenNode) => serialize([childrenNode]));
            
            switch (node.type) {
            case 'paragraph':
                return <Paragraph isSerialized key={key()}>{serialized}</Paragraph>;

            case 'emoji':
                return <Emoji isSerialized code={node.code} key={key()}/>;

            case 'link': 
                return <Link isSerialized url={node.url} key={key()}>{node.url}</Link>;

            default:
                return <>{serialized}</>;
            }
        });
    }, []);

    const value = useMemo(() => serialize(nodes), [nodes, serialize]);
    
    return (
        <>{value}</>
    );
};