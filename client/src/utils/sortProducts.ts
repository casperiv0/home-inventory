import { Product } from "@t/Product";
import { filters } from "src/pages/products";

export function sortProducts(filter: keyof typeof filters, products: Product[]) {
  switch (filter) {
    case "name": {
      return products.sort((a, b) => {
        return a.name > b.name ? -1 : 1;
      });
    }
    case "createdAt": {
      return products.sort((a, b) => {
        return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
      });
    }
    case "updatedAt": {
      return products.sort((a, b) => {
        return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1;
      });
    }
    case "price": {
      return products.sort((a, b) => a.price - b.price);
    }
    case "priceHigh": {
      return products.sort((a, b) => b.price - a.price);
    }
    case "quantity": {
      return products.sort((a, b) => a.quantity - b.quantity);
    }
    case "quantityHigh": {
      return products.sort((a, b) => b.quantity - a.quantity);
    }
    default: {
      return products;
    }
  }
}
