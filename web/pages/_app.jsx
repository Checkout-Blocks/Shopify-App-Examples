import { useRouter } from "next/router";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { AppBridgeNavigation, Link } from "@components/core";
import { AppBridgeProvider } from "@components/provider";

const AppProviderWrapper = ({ children }) => {
    const router = useRouter();

    if (router.pathname === "/login") {
        // Don't use appbridge on login as it loads external to Shopify
        return children;
    }

    return (
        <AppBridgeProvider>
            <AppBridgeNavigation />
            {children}
        </AppBridgeProvider>
    );
};

function MyApp({ Component, pageProps }) {
    return (
        <PolarisProvider i18n={polarisTranslations} linkComponent={Link}>
            <AppProviderWrapper>
                <Component {...pageProps} />
            </AppProviderWrapper>
        </PolarisProvider>
    );
}

export default MyApp;
