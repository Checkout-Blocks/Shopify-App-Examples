import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    Banner,
    Button,
    Card,
    Form,
    Image,
    Layout,
    Page,
    Stack,
    Text,
    TextField,
} from "@shopify/polaris";

const appLogoUrl =
    "https://pbs.twimg.com/profile_images/1575469130710482945/CzsF3ZIs_400x400.png";

export default function Login() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [shop, setShop] = useState(router.query?.shop || "");

    return (
        <Page narrowWidth>
            <Head>
                <title>Login - {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>
            <Layout>
                <Layout.Section>
                    <div style={{ marginTop: "100px" }}>
                        <Stack vertical>
                            {router?.query?.error && (
                                <Banner status="critical">
                                    There was an error. Try again or please
                                    contact support.
                                </Banner>
                            )}
                            <Card>
                                <Card.Section>
                                    <Stack
                                        vertical
                                        alignment="center"
                                        spacing="none"
                                    >
                                        <Image
                                            source={appLogoUrl}
                                            height={150}
                                            style={{
                                                borderRadius: "1rem",
                                                marginBottom: "1rem",
                                            }}
                                        />
                                        <Text
                                            fontWeight="bold"
                                            variant="headingLg"
                                        >
                                            {process.env.NEXT_PUBLIC_APP_NAME}
                                        </Text>
                                    </Stack>
                                </Card.Section>
                                <Card.Section>
                                    <Stack vertical>
                                        <Form
                                            onSubmit={() => {
                                                setLoading(true);
                                                window.location = `/api/auth/offline?shop=${shop
                                                    .replace(
                                                        ".myshopify.com",
                                                        ""
                                                    )
                                                    .replace(
                                                        "https://",
                                                        ""
                                                    )}.myshopify.com`;
                                            }}
                                        >
                                            <Stack
                                                alignment="trailing"
                                                spacing="tight"
                                            >
                                                <Stack.Item fill>
                                                    <TextField
                                                        autoFocus
                                                        label="Enter your shop.myshopify.com domain below to log in or install this app."
                                                        placeholder="snowdevil.myshopify.com"
                                                        value={shop}
                                                        onChange={(newValue) =>
                                                            setShop(newValue)
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </Stack.Item>
                                                <Button
                                                    submit
                                                    primary
                                                    loading={loading}
                                                >
                                                    Continue
                                                </Button>
                                            </Stack>
                                        </Form>
                                    </Stack>
                                </Card.Section>
                            </Card>
                        </Stack>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
