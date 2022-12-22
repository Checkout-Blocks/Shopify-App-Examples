import { createContext, useCallback, useEffect, useContext, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Page, Spinner } from "@shopify/polaris";

import { userLoggedInFetch } from "@lib/fetch";

const ShopContext = createContext({});

const ShopProvider = ({ children }) => {
    const app = useAppBridge();
    const fetchFunction = userLoggedInFetch(app);

    const [submitting, setSubmitting] = useState(true);
    const [shopData, setShopData] = useState({});

    useEffect(() => {
        setSubmitting(true);
        const getShopData = async () => {
            try {
                // Get current shop data from api
                const resData = await fetchFunction(`/api/admin/shop`).then((res) => {
                    if (!res) {
                        return null;
                    }
                    return res?.json()
                });
                /*
                    {
                        settings,
                        scopes,
                        shop,
                        name,
                        primaryDomain,
                        shopifyPlan,
                        subscription,
                        shopLocales,
                        currencyCode
                    }
                */

                if (!resData) {
                    return;
                }

                setShopData(resData);
                setSubmitting(false);
            } catch (error) {
                console.log(error);
            }
        };
        getShopData();
    }, []);

    const handleUpdateShopSetting = useCallback((key, value) => {
        setShopData(prevState => ({
            ...prevState,
            settings: {
                ...prevState.settings,
                [key]: value
            }
        }));
    }, []);

    const currency = (value) => {
        const locale = shopData?.locale ? shopData.locale : "en-US";
        const currency =
            shopData?.currencyCode ? shopData.currencyCode : "USD";

        const formatter = new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        if (!value) return formatter.format(0);

        return formatter.format(value);
    };

    if (submitting) {
        return (
            <Page>
                <Spinner />
            </Page>
        );
    }

    return (
        <ShopContext.Provider value={{ shopData, setShopData, currency, handleUpdateShopSetting }}>
            {children}
        </ShopContext.Provider>
    );
};

const useShop = () => {
    const { shopData, setShopData, currency, handleUpdateShopSetting } = useContext(ShopContext);

    return { shopData, setShopData, currency, handleUpdateShopSetting };
};

export { ShopProvider, useShop };
