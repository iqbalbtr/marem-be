export type NotificationConfig = {
    project_id: string;
    private_key: string;
    client_email: string;
}

export default () => ({
    notification: {
        project_id: process.env.FIREBASE_PROJECT_ID!,
        private_key: process.env.FIREBASE_PRIVATE_KEY!,
        client_email: process.env.FIREBASE_CLIENT_EMAIL!,
    } as NotificationConfig
})