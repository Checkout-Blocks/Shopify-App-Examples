import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
// import ErrorView from "./ErrorView"; // TODO:

const initBugsnag = (bugsnagBrowserKey) => {
    const shop = new URL(location).searchParams.get("shop");

    Bugsnag.start({
        apiKey: bugsnagBrowserKey,
        plugins: [new BugsnagPluginReact()],
        user: {
            id: shop,
            //name: shop,
            //email: shopData?.email
        },
        onError: error => {
            if (
                error.originalError === "routeChange aborted. Please ignore this error."
            ) {
                return false;
            }
            return true;
        }
    });
    return Bugsnag;
  };
  

export function ErrorProvider ({ children }) {
    const bugsnagBrowserKey = process.env.NEXT_PUBLIC_BUGSNAG_BROWSER_API_KEY;
    
    // TODO: implement bugsnag
    if (false && bugsnagBrowserKey) {
        initBugsnag(bugsnagBrowserKey);

        const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

        return (
            <ErrorBoundary 
                //FallbackComponent={ErrorView} // TODO:
            >
                {children}
            </ErrorBoundary>
        );
    }

    return children;
}