export interface Post {
  id: number;
  name: string;
  content: string;
  author: string;
  categoryId: number;
  category?: { 
    id: number;
    name: string 
  };
}