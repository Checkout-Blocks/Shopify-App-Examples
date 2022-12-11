import { AppProvider as PolarisProvider } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { Link } from "@components/core";

function MyApp({ Component, pageProps }) {
    return (
        <PolarisProvider
            i18n={polarisTranslations}
            linkComponent={Link}
        >
            <Component {...pageProps} />
        </PolarisProvider>
    );
}

export default MyApp;
