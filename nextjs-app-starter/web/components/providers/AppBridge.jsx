import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Provider } from "@shopify/app-bridge-react";
import { Layout, Page, Spinner } from "@shopify/polaris";

/**
 * A component to configure App Bridge.
 * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
 *
 * 1. Ensures that navigating inside the app updates the host URL.
 * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
 *
 * See: https://shopify.dev/apps/tools/app-bridge/react-components
 */
export function AppBridgeProvider ({ children }) {
    const router = useRouter();
    const location = router.asPath;
    
    // The host may be present initially, but later removed by navigation.
    // By caching this in state, we ensure that the host is never lost.
    // During the lifecycle of an app, these values should never be updated anyway.
    // Using state in this way is preferable to useMemo.
    // See: https://stackoverflow.com/questions/60482318/version-of-usememo-for-caching-a-value-that-will-never-change
    const [appBridgeConfig, setConfig] = useState(null);

    useEffect(() => {
        const host = router.query?.host;

        if (host) {
            setConfig({
                host: host,
                apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
                forceRedirect: true,
            })
        } else if (router.pathname === "/login") {
            setConfig({
                host: "123", // dummy
                apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
                forceRedirect: false,
            })
        }
    }, [router.query]);

    const history = useMemo(
        () => ({
            replace: (path) => {
                router.push(path);
            },
        }),
        [location]
    );

    const routerConfig = useMemo(
        () => ({ history, location }),
    [history, location]);

    // Initial server-side render does not include the router.query so we have to wait
    // TODO: optimize this in the future
    if (!appBridgeConfig) {    
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Spinner />
                    </Layout.Section>
                </Layout>
            </Page>
        )
    }

    return (
        <Provider 
            config={appBridgeConfig}
            router={routerConfig}
        >
            {children}
        </Provider>
    );
}
