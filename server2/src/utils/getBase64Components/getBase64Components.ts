


export const getBase64Components = (base64url: string) => {
    const type = base64url.split(':')[1].split(';')[0];
    const base64String = base64url.split(',')[1];
        
    const urlPart = base64url.split(',') + ',';
    const base64StringLength = base64url.length - urlPart.length;
    const padding = base64String.slice(-2).match(/=/ig)?.length || 0;

    const sizeInBytes = Math.ceil(base64StringLength / 4) * 3 - padding;

    return {
        type,
        size: sizeInBytes,
        base64String,
    };
};