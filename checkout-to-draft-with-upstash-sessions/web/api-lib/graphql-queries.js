export const CREATE_DRAFT_ORDER = `
mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
        draftOrder {
            id
            legacyResourceId
        }
        userErrors {
            field
            message
        }
    }
}
`;
