'use client'

import { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import type { CartItem, CartItemInput, Order } from '@/api/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast, useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const GET_CART = gql`
  query GetCart {
    cart {
      id
      name
      price
      quantity
    }
  }
`;

const CHECKOUT = gql`
  mutation Checkout($items: [CartItemInput!]!) {
    checkout(items: $items) {
      id
      items {
        id
        name
        price
        quantity
      }
      total
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($item: CartItemInput!) {
    updateCartItem(item: $item) {
      id
      name
      price
      quantity
    }
  }
`;

export default function Checkout() {
  const { loading, error, data, refetch } = useQuery(GET_CART);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
    const [checkout] = useMutation(CHECKOUT);
    const [order, setOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleQuantityChange = async (id: string, quantity: number) => {
      const item: CartItemInput = { id, quantity };

      try {
        await updateCartItem({ variables: {item} });
        refetch();
        toast({
          title: "Cart Updated",
          description: "Item quantity has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update cart item.",
          variant: "destructive",
        });
      }
    };

    const handleCheckout = async () => {
      try {
        const items = data.cart.map((item: CartItem) => ({
          id: item.id,
          quantity: item.quantity,
        }));
        const result = await checkout({ variables: { items } });
        setOrder(result.data.checkout);
        refetch();
        toast({
          title: "Checkout Successful",
          description: `Your order (ID: ${result.data.checkout.id}) has been placed.`,
        });
      } catch (error) {
        toast({
          title: "Checkout Failed",
          description: "There was an error processing your order.",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.cart.map((item: CartItem) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        min="0"
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCheckout}>Checkout</Button>
          </CardFooter>
        </Card>

        {order && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Order Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Order ID: {order.id}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <h3 className="mt-4 mb-2 font-bold">Items:</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Quantity: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
}
