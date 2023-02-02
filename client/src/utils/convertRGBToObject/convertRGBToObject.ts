


export const convertRGBToObject = (rgb: string) => {
    const rbgArray = rgb.slice(4, -1).split(',').map((color) => Number(color.trim()));
    
    return {
        r: rbgArray[0],
        g: rbgArray[1],
        b: rbgArray[2],
    };
};