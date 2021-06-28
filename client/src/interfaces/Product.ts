export interface Product {
  id: string;
  quantity: number;
  warnOnQuantity: number;
  ignoreQuantityWarning: boolean;
  price: number;
  prices: number[];
  name: string;
  createdAt: string;
  updatedAt: string;
  expirationDate: string | null;
  userId: string;
  categoryId: string | null;
  houseId: string;
}
