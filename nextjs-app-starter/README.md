# Nextjs Shopify App Starter

### Not production ready. This is meant to be a proof of concept.

A simple Shopify app starter built using Nextjs. Can be hosted on Vercel out-of-box via Vercel edge + serverless functions.

## Architecture

- Nextjs (React) frontend
- Embedded Shopify app architecture
- Mongodb database
- Sessions: Mongodb
- Online + Offline sessions
- JWT Session
- Shopify Polaris UI
- Analytics: Segment (Customer events) + vercel (frontend)
- Fallback /login page
- GDPR Webhook routes
- Iframe Security headers
- Graphql proxy using online session

## Setup

### Allowed redirection urls
- http://localhost:3001/api/auth/callback
- http://localhost:3001/api/auth/offline/callback

## Roadmap

- Move off apollo/client as it's a huge dependency. Switch to react-query
- Make segment more modular and optional
- TODO: Implement Helpscout and make optional
- TODO: implement bugsnag error provider and make optional
- TODO: Improve security
