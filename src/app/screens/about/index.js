import { Markdown } from "../../components/markup/markdown";

const ABOUT_CONTENT = `
# Customer Dashboard Documentation

The Qubriux Customer Dashboard is a web based application that lets customers view and manage their loyalty account, subscriptions, transactions, rewards, and profile information.

It is a shared, configurable web application used across all merchants. The experience is dynamically configured based on the merchant context (branding, enabled features, signup fields, navigation, and content).

## Access

The dashboard is hosted at:

\`\`\`
https://customer.qbriux.io
\`\`\`

The available dashboards and email signup page URLs is available at [https://internal.qbriux.io](https://internal.qbriux.io)

Merchant context is resolved using the \`amx\` query parameter:

\`\`\`
https://customer.qbriux.io?amx=<AMX>
\`\`\`

- \`<AMX>\` is the encoded identifier for a store.
- This identifier is required to:
    - Load merchant configuration
    - Apply branding
    - Enable/disable features
    - Resolve content and flows

Sub domains with brand names can also be used to access the dashboard like 

\`\`\`
https://eathos.qbriux.io?amx=<AMX>
\`\`\`

### Notes

- If \`amx\` is missing or invalid, the application would fail (e.g., show an error or loader).
- Once resolved, all routes inherit the same merchant/brand context.

## Merchant Onboarding Requirements

Before a merchant can use the customer dashboard, the following must be configured:

### Required

- At least one active store
- Loyalty program configured and enabled

### Branding Assets and Content

- Logo (preferably SVG or PNG, will be converted to webp)
- Favicon (Provided logo can be used if dedicated favicon is not required)
- Primary and secondary accent colors
- Loyalty program content (tiers, benefits, in case loyalty program details page is required.)
- Terms & privacy policy content.

## Authentication & Signup Flow

### Signup

![Tortilla](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/tortilla_signup.png)

![Eathos](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/eathos_login.png)

![Asian 5](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/asian5_signup.png)

Customers can create an account via \`/auth/signup\`.

\`\`\`
https://customer.qbriux.io/auth/signup?amx=<AMX>
\`\`\`

Signup behaviour is configuration driven:

- Fields are dynamically rendered per merchant
- Required fields are enforced by configuration
- Authentication method depends on merchant settings:
    - Password based
    - OTP based (SMS/Email)

### Post signup behaviour

After successful signup:

- The customer account is created
- Optional: the user is automatically logged in (based on configuration)

The customer receives:

- Welcome / signup email
- Digital loyalty card
- Add to wallet options:
    - Apple Wallet
    - Google Wallet

## Customer Dashboard (\`/app\`)

Once authenticated, users are redirected to \`/app/home\`

![Asian 5](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/asian5_home.png)
![CEC](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/cec_home.png)

## Configuration driven behaviour

![CEC](https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/knowledge_base/cec_signup.png)

The following aspects of the dashboard are controlled via merchant configuration:

### Branding

- Colors - primary and Secondary
- Logo
    - For the signup page and welcome popup
    - Fav Icon
    - Dashboard header

### Authentication

- Enabled login methods (password / OTP)

### Signup

- Fields - Currently available fields are \`name\`, \`email\`, \`phone number\`, \`Date of Birth\`, \`Gender\`, \`Nationality\`, \`Password\`, \`Referral Code\`, \`Favourite Home Location\`.
- Required/optional state for fields
- Labels and Placeholders for fields
- Layout

Few fields like \`phone number\` are mandatory for account creation and cannot be removed or made optional.

### Navigation

- Visible tabs
- Default route

### Content

- Loyalty program details
- Subscription page details
- Terms & privacy pages

The Qubriux Customer Dashboard is a config driven system designed to:

- Provide a consistent customer experience
- Allow controlled merchant customization
- Eliminate the need for per merchant deployments

All behaviour is governed by configuration, with strict boundaries to ensure scalability and maintainability.`;

const AboutPage = () => {

    return (
        <>
            <Markdown>
                {ABOUT_CONTENT}
            </Markdown>
        </>
    )
}

export default AboutPage;