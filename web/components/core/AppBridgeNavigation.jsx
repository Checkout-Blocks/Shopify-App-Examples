import { useRouter } from "next/router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { NavigationMenu, AppLink } from "@shopify/app-bridge/actions";

export function AppBridgeNavigation() {
    const app = useAppBridge();
    const router = useRouter();

    const settingsLink = AppLink.create(app, {
        label: "Settings",
        destination: `/settings`,
    });

    const activeLink = (pathName) => {
        if (!pathName) {
            return settingsLink;
        }

        return null;
    };

    NavigationMenu.create(app, {
        items: [settingsLink],
        active: activeLink(router?.pathname),
    });

    return null;
}
