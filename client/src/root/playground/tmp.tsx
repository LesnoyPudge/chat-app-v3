import { Conditional, List, Scrollable } from '@components';
import { useAnimationFrame, useSharedIntersectionObserver } from '@hooks';
import { deepEqual, getRandomNumber } from '@utils';
import { FC, useRef, useState } from 'react';
import { useLatest } from 'react-use';



const ChunkItemPlaceholder: FC = () => {
    return (
        <div className='h-11'>
            placeholder
        </div>
    );
};

interface Item {
    id: string;
    content: string;
    order: number;
    height: number;
}

const itemsArr: Item[] = Array(150).fill(null).map((_, i) => ({
    id: String(i),
    content: String(i),
    order: i,
    height: getRandomNumber(24, 240),
}));

const props = {
    chunkSize: 50,
    chunkItemPlaceholder: <ChunkItemPlaceholder/>,
    items: itemsArr,
};


interface Chunk {
    type: 'top' | 'middle' | 'bottom';
}

const Chunk: FC<Chunk> = ({ type }) => {
    return (
        <div>
            <>chunk {type}</>
        </div>
    );
};

const ChunkItem = ({
    content,
    height,
}: Item) => {
    
    return (
        <div style={{ height }}>
            <>item: {content}</>
        </div>
    );
};

export const ChunkedList: FC = () => {
    const {
        chunkItemPlaceholder,
        chunkSize,
        items,
    } = props;

    const totalChunks = Math.ceil(items.length / chunkSize);
    const chunkIntersection = useRef({
        top: false,
        middle: false,
        bottom: false,
    });
    const previousChinkIntersection = useRef({ ...chunkIntersection.current });
    const [chunkedList, setChunkedList] = useState({
        top: [] as Item[],
        middle: [] as Item[],
        bottom: [] as Item[],
    });

    const chunkedItems = useLatest(Array(totalChunks).fill(null).map((_, i) => {
        return items.slice((i * chunkSize), (i * (2 * chunkSize))); 
    }));

    const [_, topChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.top = isIntersecting;
    });

    const [__, middleChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.middle = isIntersecting;
    });

    const [___, bottomChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.bottom = isIntersecting;
    });

    useAnimationFrame(() => {
        if (!deepEqual(
            previousChinkIntersection.current, 
            chunkIntersection.current,
        )) return;

        console.log('frame');
    
        // setChunkedList((prev) => ({
        //     top: chunkIntersection.current.top ? ,
        // }));
    });

    return (
        <div className='h-full'>
            <Scrollable className='h-full'>
                <div aria-hidden='true'>
                    {/* <List list={Array(totalChunks)}>
                        {(_, chunkIndex) => (
                            <>
                            
                            </>
                        )}
                    </List> */}

                    <div ref={topChunkRef}>
                        <Conditional isRendered={!chunkedList.top.length}>
                            <List list={Array(chunkSize).fill(null)}>
                                <ChunkItemPlaceholder/>
                            </List>
                        </Conditional>

                        <Conditional isRendered={!!chunkedList.top.length}>
                            <List list={chunkedList.top}>
                                {(props) => <ChunkItem {...props}/>}
                            </List>
                        </Conditional>
                    </div>

                    <div ref={middleChunkRef}>
                        <Conditional isRendered={!chunkedList.middle.length}>
                            <List list={Array(chunkSize).fill(null)}>
                                <ChunkItemPlaceholder/>
                            </List>
                        </Conditional>

                        <Conditional isRendered={!!chunkedList.middle.length}>
                            <List list={chunkedList.middle}>
                                {(props) => <ChunkItem {...props}/>}
                            </List>
                        </Conditional>
                    </div>

                    <div ref={bottomChunkRef}>
                        <Conditional isRendered={!chunkedList.bottom.length}>
                            <List list={Array(chunkSize).fill(null)}>
                                <ChunkItemPlaceholder/>
                            </List>
                        </Conditional>

                        <Conditional isRendered={!!chunkedList.middle.length}>
                            <List list={chunkedList.middle}>
                                {(props) => <ChunkItem {...props}/>}
                            </List>
                        </Conditional>
                    </div>
            
                    {/* <Chunk type='top'/>

            <Chunk type='middle'/>

            <Chunk type='bottom'/> */}
                </div>
            </Scrollable>
        </div>
    );
};