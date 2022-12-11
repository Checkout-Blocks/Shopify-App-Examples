import { AppProvider as PolarisProvider } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

function MyApp({ Component, pageProps }) {
    return (
        <PolarisProvider
            i18n={polarisTranslations}
        >
            <Component {...pageProps} />
        </PolarisProvider>
    );
}

export default MyApp;
