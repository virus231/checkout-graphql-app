import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type CartItem {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type Order {
    id: ID!
    items: [CartItem!]!
    total: Float!
  }

  input CartItemInput {
    id: ID!
    quantity: Int!
  }

  type Query {
    cart: [CartItem!]!
  }

  type Mutation {
    checkout(items: [CartItemInput!]!): Order!
    updateCartItem(item: CartItemInput!): CartItem!
  }
`;

// export const schema = makeExecutableSchema({ typeDefs, resolvers });
