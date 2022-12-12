import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Banner, Button, Card, Layout, Page, Spinner } from "@shopify/polaris";
import Head from "next/head";

import { userLoggedInFetch } from "@lib/fetch";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

const states = {
    idle: "idle",
    loading: "loading",
    error: "error",
    redirecting: "redirecting"
}

export default function Home() {
    const router = useRouter();
    const app = useAppBridge();
    const fetchFunction = userLoggedInFetch();

    const [state, setState] = useState(states.idle);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (router.query?.id) {
            convertToDraft();
        }
    }, []);

    const convertToDraft = async () => {
        try {
            if (state === states.loading) {
                // Quick if already converting
                return;
            }

            setState(states.loading);

            // Send API request to convert
            const response = await fetchFunction(`/api/admin/convert?id=${router.query?.id}`).then((res) => {
                if (!res) {
                    return null;
                }
                return res?.json()
            });

            // Error out if no draft order id was returned
            if (!response?.id) {
                setToast({
                    error: true,
                })
                setState(states.error);
                return;
            }

            setState(states.redirecting);

            // Redirect to newly created draft order
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.ADMIN_PATH, `/draft_orders/${response?.id}`);
            
        } catch (error) {
            console.warn(error);
        }
    }

    // Helper function to redirect to abandoned checkouts
    const navigateToAbandonedCheckouts = () => {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.ADMIN_PATH, "/checkouts");
    }

    if (router.query?.id) {
        if (state === states.loading) {
            return (
                <Page>
                    <Layout>
                        <Layout.Section>
                            <Card
                                sectioned
                                title="Creating draft order..."
                            >
                                <Spinner />
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            )
        } else if (state === states.error) {
            return (
                <Page>
                    <Layout>
                        <Layout.Section>
                            <Card
                                sectioned
                                title="Creating draft order..."
                            >
                                <Banner status="critical">{toast?.message}</Banner>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            )
        } else if (state === states.redirecting) {
            return (
                <Page>
                    <Layout>
                        <Layout.Section>
                            <Card
                                sectioned
                                title="Redirecting to draft order..."
                            >
                                <Spinner />
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            )
        }

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
        <Page>
            <Head>
                <title>Outcast Shopify App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout>
                <Layout.Section>
                    <Card
                        sectioned
                        title="First, select an abandoned checkout"
                        //actions={[{ content: "Settings", url: "/settings"}]}
                    >
                        Navigate to <Button plain onClick={navigateToAbandonedCheckouts}>Orders &rarr; Abandoned checkouts</Button>. Select an abandoned checkout and then click: More
                        actions &rarr; Convert to draft order.
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}