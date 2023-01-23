import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

export function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const shop = params?.shop || "";
    
    return async (uri, options) => {
        const response = await fetchFunction(uri, options);
    
        if (
            response.status === 401
            //response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
        ) {         
            const authUrl = `${process.env.NEXT_PUBLIC_HOST}/api/auth?shop=${shop}`
            const redirect = Redirect.create(app);
            redirect.dispatch(
                Redirect.Action.REMOTE,
                authUrl
            );
            return null;
        }
    
        return response;
    };
  }
  
