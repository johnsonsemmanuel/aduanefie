export interface HelpArticle {
  id: string
  title: string
  category: string
  summary: string
  content: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'trading' | 'account' | 'payments' | 'logistics' | 'technical'
}

export const helpCategories = [
  { id: 'getting-started', label: 'Getting Started', icon: 'Rocket' },
  { id: 'trading', label: 'Trading', icon: 'ShoppingBag' },
  { id: 'payments', label: 'Payments & Finance', icon: 'Wallet' },
  { id: 'logistics', label: 'Logistics', icon: 'Truck' },
  { id: 'account', label: 'Account & Profile', icon: 'User' },
  { id: 'api', label: 'API & Integrations', icon: 'Code2' },
]

export const helpArticles: HelpArticle[] = [
  {
    id: 'ha1', title: 'How to place a trade order', category: 'trading',
    summary: 'Step-by-step guide to buying and selling commodities on the platform.',
    content: 'To place a trade order, navigate to the Trade Engine from the sidebar. Browse available commodities, select your preferred grade and quantity, review pricing, and submit your order. Your counterparty will receive a notification to confirm.',
  },
  {
    id: 'ha2', title: 'Understanding quality grades', category: 'trading',
    summary: 'Learn about Premium, Grade A, Grade B, and Standard classifications.',
    content: 'Quality grades determine commodity pricing and marketability. Premium grade represents the highest quality with strict specifications. Grade A meets standard export requirements. Grade B and Standard are suitable for local processing.',
  },
  {
    id: 'ha3', title: 'Setting up your wallet', category: 'payments',
    summary: 'Configure your digital wallet for seamless transactions.',
    content: 'Go to Finance Hub > Wallet to set up your digital wallet. Link a bank account, set up your preferred currency, and configure payment limits. You can fund your wallet via bank transfer, mobile money, or card payment.',
  },
  {
    id: 'ha4', title: 'Tracking shipments', category: 'logistics',
    summary: 'Real-time shipment tracking and delivery management.',
    content: 'All active shipments can be tracked from the Logistics Hub. Enter your tracking ID or browse active shipments to see real-time location, estimated arrival, and delivery status updates.',
  },
  {
    id: 'ha5', title: 'Managing your cooperative', category: 'getting-started',
    summary: 'How to create and manage farmer cooperatives.',
    content: 'Navigate to Cooperative Hub to create or join a cooperative. As a manager, you can add members, assign roles, manage shared resources, and facilitate collective trading.',
  },
  {
    id: 'ha6', title: 'API authentication guide', category: 'api',
    summary: 'Authenticate your API requests using API keys.',
    content: 'Generate API keys from Developer Hub. Use the key in your request headers as Authorization: Bearer <your-api-key>. Keys can be scoped to specific modules and have expiration dates for security.',
  },
]

export const faqItems: FAQItem[] = [
  { id: 'fq1', question: 'How do I reset my password?', answer: 'Go to Settings > Security and click "Update Password". You will need your current password to set a new one. If you forgot your password, use the "Forgot Password" link on the login page.', category: 'account' },
  { id: 'fq2', question: 'What payment methods are accepted?', answer: 'We accept bank transfers, mobile money (MTN, Vodafone, AirtelTigo), and major credit/debit cards. Payments are processed securely through our integrated payment gateway.', category: 'payments' },
  { id: 'fq3', question: 'How long do deliveries typically take?', answer: 'Domestic deliveries within Ghana typically take 2-5 business days. International export shipments vary by destination: 5-10 days to European ports, 10-20 days to Asian markets, and 7-14 days to North America.', category: 'logistics' },
  { id: 'fq4', question: 'Can I cancel an order after it is placed?', answer: 'Orders can be cancelled before they are confirmed by the counterparty. Once confirmed, cancellation terms depend on the contract. Check the specific terms in your trade agreement.', category: 'trading' },
  { id: 'fq5', question: 'How are disputes resolved?', answer: 'Disputes can be raised through the platform by contacting support. Our mediation team reviews the case based on contract terms, quality inspection reports, and communication history.', category: 'trading' },
  { id: 'fq6', question: 'What are the fees for using the platform?', answer: 'Platform fees vary by module. Trading fees are 0.5-2% per transaction depending on volume. Payment processing fees are 1.5% for card payments and 1% for mobile money. Check Finance Hub for detailed fee schedules.', category: 'payments' },
  { id: 'fq7', question: 'How do I verify my account?', answer: 'Account verification requires submitting valid identification (passport or national ID), proof of business registration (if applicable), and a utility bill for address verification. Submit documents from Profile > Verification.', category: 'account' },
  { id: 'fq8', question: 'Is my data secure?', answer: 'Yes, we use end-to-end encryption for all data in transit and at rest. Our platform is SOC 2 compliant, and we follow industry best practices for security. 2FA is available for additional account protection.', category: 'technical' },
  { id: 'fq9', question: 'Can I integrate with my existing ERP?', answer: 'Yes, our REST API supports integration with major ERP systems. Visit Developer Hub for API documentation, SDKs, and webhook configuration. We support real-time data synchronization.', category: 'technical' },
  { id: 'fq10', question: 'How do I contact support?', answer: 'You can open a support ticket from this page, email support@aduanefie.com, or call our helpline at +233 30 212 3456. Support hours are Monday-Friday 8:00 AM - 6:00 PM GMT.', category: 'account' },
]
