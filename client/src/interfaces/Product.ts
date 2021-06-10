export interface Product {
  id: string;
  quantity: number;
  price: number;
  prices: number[];
  name: string;
  createdAt: string;
  updatedAt: string;
  expirationDate: string | null;
  userId: string;
  categoryId: string | null;
}
