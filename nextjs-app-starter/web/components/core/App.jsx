import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isShopifyEmbedded } from "@shopify/app-bridge-utils";
import { Layout, Page, Spinner } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

import { AppBridgeNavigation } from "@components/core";
import { GraphQLProvider, ShopProvider } from "@components/providers";

export const App = ({
    children
}) => {
    const app = useAppBridge();
    const redirect = Redirect.create(app);
    const router = useRouter();

    const [shop, setShop] = useState();

    // Set shop parameter
    useEffect(() => {
        if (router.pathname === "/login" || router.pathname === "/_error") {
            return;
        }

        const shopParam = new URL(location).searchParams.get("shop");

        // Redirect to login page if shop param is missing
        if (!shopParam) {
            if (isShopifyEmbedded()) {
                redirect.dispatch(
                    Redirect.Action.REMOTE,
                    `${process.env.NEXT_PUBLIC_HOST}/login`,
                );
            } else {
                window.location = "/login";
            }
            // TODO: redirect to login
            console.log("login");
        } else {
            setShop(new URL(location).searchParams.get("shop"));
        }
    }, []);

    // App Entry -- we need shop so we cache on initial load
    if (!shop) {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Spinner />
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return (
        <>
            <ShopProvider>
                <AppBridgeNavigation />
                <GraphQLProvider shop={shop}>
                    {children}
                </GraphQLProvider> 
            </ShopProvider>
        </>
    )
}