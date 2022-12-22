import { Card, Page } from '@shopify/polaris'
import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head>
                <title>Home - {process.env.NEXT_PUBLIC_APP_NAME}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Page>
                <Card sectioned>Hello</Card>
            </Page>
        </>
    )
}
