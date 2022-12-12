import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";

export function userLoggedInFetch() {
    const app = useAppBridge();
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);

        if (response.status === 401) {
            const reauthUrl = response.headers["X-Shopify-API-Request-Failure-Reauthorize-Url"] || null;

            const authUrl = reauthUrl || `${
                window?.location?.origin
            }/api/auth?shop=${app.hostOrigin?.replace("https://", "")}`;

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.REMOTE, authUrl);
            
            return null;
        }

        return response;
    };
}
