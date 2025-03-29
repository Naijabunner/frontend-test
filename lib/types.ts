export interface Position{
    x: number
    y: number
}

export interface Annotation{
    id?: string
    type: " highlight" | "underline" | "comment" | "signature"
    page: number
    position : Position
    content: string,
    color: string,
}

export interface Comment{
    id: string
    page: number
    position: Position
    content: string
    createdAt: Date
}