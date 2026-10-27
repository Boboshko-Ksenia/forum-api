export type Post = {
    id: number;
    name: string;      
    content: string;   
    authorId: number;
    author?: {
        id: number;
        email: string;
    };
    categoryId: number;
    category?: {
        id: number;
        name: string;
    };
};
