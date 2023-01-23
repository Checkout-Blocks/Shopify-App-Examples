import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";

export function userLoggedInFetch() {
    const app = useAppBridge();
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        const shop = params?.shop || "";

        if (response.status === 401) {
            const reauthUrl = response.headers["X-Shopify-API-Request-Failure-Reauthorize-Url"] || null;
            const authUrl = reauthUrl || `${process.env.NEXT_PUBLIC_HOST}/api/auth?shop=${shop}`;
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.REMOTE, authUrl);
            
            return null;
        }

        return response;
    };
}
