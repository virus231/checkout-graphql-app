import type { CartItem, Order, CartItemInput } from './types';

const cart: CartItem[] = [
  { id: '1', name: 'Item 1', price: 10.99, quantity: 2 },
  { id: '2', name: 'Item 2', price: 15.99, quantity: 1 },
];

export const resolvers = {
  Query: {
    cart: () => cart,
  },
  Mutation: {
    checkout: (_: any, { items }: { items: CartItemInput[] }): Order => {
      const orderItems = items.map(item => {
        const cartItem = cart.find(ci => ci.id === item.id);
        if (!cartItem) throw new Error(`Item with id ${item.id} not found`);
        return { ...cartItem, quantity: item.quantity };
      });

      const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        id: Math.random().toString(36).substr(2, 9),
        items: orderItems,
        total,
      };
    },
    updateCartItem: (_: any, { item }: { item: CartItemInput }): CartItem => {
      const cartItem = cart.find(ci => ci.id === item.id);
      if (!cartItem) throw new Error(`Item with id ${item.id} not found`);

      cartItem.quantity = item.quantity;
      return cartItem;
    },
  },
};
