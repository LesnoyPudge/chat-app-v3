import { Entities, Prettify, StrictOmit } from "@shared"



interface FileDTO {
    encoded: (
        file: Prettify<Entities.File.Encoded & Partial<StrictOmit<
            Entities.File.Default,
            keyof Entities.File.Encoded
        >>>
    ) => Entities.File.Encoded;
}

export const FileDTO: FileDTO = {
    encoded: (file) => ({
        base64: file.base64,
        name: file.name,
        size: file.size,
        type: file.type,
    })
}