


export const getDecodedImage = async(url: string) => {
    const img = new Image();
    img.src = url;
    await img.decode();  
    return img;
};