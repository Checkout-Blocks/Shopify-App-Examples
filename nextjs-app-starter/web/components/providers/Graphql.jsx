import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
} from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
  
import { userLoggedInFetch } from "@lib/fetch";
  
export function GraphQLProvider({ shop, children }) {
    const app = useAppBridge();
  
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "/api/graphql",
            credentials: "include",
            fetch: userLoggedInFetch(app),
            headers: { "myshopify": shop }
        }),
    });
  
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
  