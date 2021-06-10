export interface Product {
  id: string;
  quantity: number;
  price: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  expirationDate: string;
  userId: string;
  categoryId: string | null;
}
