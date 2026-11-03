export type Photo = {
  id: string;
  title: string;
  category: string;
  folder?: string;
  photographer: string;
  image: string;
  location: string;
  description: string;
  funTag?: string;
  uploaderId?: string;
  uploaderEmail?: string;
  isPrivate?: boolean;
  createdAt?: string | Date;
  likesCount?: number;
};
