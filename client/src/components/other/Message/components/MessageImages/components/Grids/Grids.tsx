import { List } from '@components';
import { FC } from 'react';
import { Item, OneItem, ThreeItems, TwoItems } from '..';



interface Grid {
    images: {src: string, index: number}[];
}

export const Grid9: FC<Grid> = ({ images }) => {
    return (
        <ThreeItems>
            <List list={images}>
                {(image) => (
                    <Item 
                        images={images} 
                        imageIndex={image.index} 
                        size='square'
                    />
                )}
            </List>
        </ThreeItems>
    );
};

export const Grid8: FC<Grid> = ({ images }) => {
    return (
        <>
            <TwoItems>
                <List list={images.slice(0, 2)}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='square'
                        />
                    )}
                </List>
            </TwoItems>

            <ThreeItems>
                <List list={images.slice(2)}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='square'
                        />
                    )}
                </List>
            </ThreeItems>
        </>
    );
};

export const Grid7: FC<Grid> = ({ images }) => {
    return (
        <>
            <OneItem>
                <Item 
                    images={images} 
                    imageIndex={0} 
                    size='rectangleSmaller'
                />
            </OneItem>

            <ThreeItems>
                <List list={images.slice(1)}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='square'/>
                    )}
                </List>
            </ThreeItems>
        </>
    );
};

export const Grid6: FC<Grid> = ({ images }) => {
    return (
        <ThreeItems>
            <List list={images}>
                {(image) => (
                    <Item 
                        images={images} 
                        imageIndex={image.index} 
                        size='square'
                    />
                )}
            </List>
        </ThreeItems>
    );
};

export const Grid5: FC<Grid> = ({ images }) => {
    return (
        <>
            <TwoItems>
                <List list={images.slice(0, 2)}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='square'/>
                    )}
                </List>
            </TwoItems>

            <ThreeItems>
                <List list={images.slice(2)}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='square'
                        />
                    )}
                </List>
            </ThreeItems>
        </>
    );
};

export const Grid4: FC<Grid> = ({ images }) => {
    return (
        <>
            <TwoItems>
                <List list={images}>
                    {(image) => (
                        <Item 
                            images={images} 
                            imageIndex={image.index} 
                            size='rectangle'
                        />
                    )}
                </List>
            </TwoItems>
        </>
    );
};

export const Grid3: FC<Grid> = ({ images }) => {
    return (
        <>
            <ThreeItems>
                <Item 
                    className='col-start-1 col-end-3' 
                    images={images} 
                    imageIndex={0}
                    size='square'
                />
            
                <div className='grid grid-rows-2 gap-1'>
                    <Item 
                        images={images} 
                        imageIndex={1} 
                        size='square'/>
                    
                    <Item 
                        images={images} 
                        imageIndex={2} 
                        size='square'
                    />
                </div>
            </ThreeItems>
        </>
    );
};

export const Grid2: FC<Grid> = ({ images }) => {
    return (
        <TwoItems>
            <Item 
                images={images} 
                imageIndex={0} 
                size='square'
            />

            <Item 
                images={images} 
                imageIndex={1} 
                size='square'
            />
        </TwoItems>
    );
};

export const Grid1: FC<Grid> = ({ images }) => {
    return (
        <OneItem>
            <Item 
                className='w-fit'
                imageClassName='w-auto h-auto min-w-[50px] min-h-[50px] max-h-[350px]'
                images={images} 
                imageIndex={0}
            />
        </OneItem>
    );
};