
/**
 * Plaid Integration Helper
 * 
 * This file contains helper functions and types for integrating Plaid bank connectivity.
 * 
 * SETUP REQUIRED:
 * 1. Sign up for Plaid at https://plaid.com
 * 2. Get your client_id and secret from the Plaid dashboard
 * 3. Create a backend server with the following endpoints:
 *    - POST /api/create_link_token - Creates a link token for Plaid Link
 *    - POST /api/exchange_public_token - Exchanges public token for access token
 *    - GET /api/transactions - Fetches transactions from Plaid
 * 
 * EXAMPLE BACKEND (Node.js/Express):
 * 
 * const plaid = require('plaid');
 * const client = new plaid.PlaidApi(
 *   new plaid.Configuration({
 *     basePath: plaid.PlaidEnvironments.sandbox,
 *     baseOptions: {
 *       headers: {
 *         'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
 *         'PLAID-SECRET': process.env.PLAID_SECRET,
 *       },
 *     },
 *   })
 * );
 * 
 * app.post('/api/create_link_token', async (req, res) => {
 *   const response = await client.linkTokenCreate({
 *     user: { client_user_id: req.body.userId },
 *     client_name: 'BudgetBuddy',
 *     products: ['transactions'],
 *     country_codes: ['US'],
 *     language: 'en',
 *   });
 *   res.json({ link_token: response.data.link_token });
 * });
 * 
 * app.post('/api/exchange_public_token', async (req, res) => {
 *   const response = await client.itemPublicTokenExchange({
 *     public_token: req.body.public_token,
 *   });
 *   // Store access_token securely in your database
 *   res.json({ success: true });
 * });
 */

export interface PlaidConfig {
  linkToken: string;
}

export interface PlaidSuccessMetadata {
  publicToken: string;
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }>;
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  pending: boolean;
}

/**
 * Creates a link token from your backend
 * Replace with your actual backend URL
 */
export async function createLinkToken(userId: string): Promise<string> {
  try {
    const response = await fetch('YOUR_BACKEND_URL/api/create_link_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw new Error('Failed to create link token');
  }
}

/**
 * Exchanges public token for access token
 * This should be done on your backend for security
 */
export async function exchangePublicToken(publicToken: string): Promise<void> {
  try {
    const response = await fetch('YOUR_BACKEND_URL/api/exchange_public_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    const data = await response.json();
    console.log('Token exchanged successfully:', data);
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw new Error('Failed to exchange public token');
  }
}

/**
 * Fetches transactions from Plaid via your backend
 */
export async function fetchPlaidTransactions(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<PlaidTransaction[]> {
  try {
    const response = await fetch(
      `YOUR_BACKEND_URL/api/transactions?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

/**
 * Converts Plaid transaction to BudgetBuddy transaction format
 */
export function convertPlaidTransaction(plaidTx: PlaidTransaction) {
  return {
    id: plaidTx.transaction_id,
    amount: Math.abs(plaidTx.amount),
    category: mapPlaidCategory(plaidTx.category),
    description: plaidTx.merchant_name || plaidTx.name,
    date: plaidTx.date,
    type: plaidTx.amount > 0 ? 'expense' : 'income',
  };
}

/**
 * Maps Plaid categories to BudgetBuddy categories
 */
function mapPlaidCategory(plaidCategories: string[]): string {
  if (!plaidCategories || plaidCategories.length === 0) {
    return 'Other';
  }

  const primaryCategory = plaidCategories[0].toLowerCase();

  const categoryMap: Record<string, string> = {
    'food and drink': 'Food & Dining',
    'restaurants': 'Food & Dining',
    'groceries': 'Food & Dining',
    'transportation': 'Transportation',
    'travel': 'Transportation',
    'shops': 'Shopping',
    'recreation': 'Entertainment',
    'entertainment': 'Entertainment',
    'healthcare': 'Healthcare',
    'payment': 'Bills & Utilities',
    'transfer': 'Other',
    'income': 'Salary',
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (primaryCategory.includes(key)) {
      return value;
    }
  }

  return 'Other';
}

/**
 * Example usage with PlaidLink component:
 * 
 * import { PlaidLink } from 'react-native-plaid-link-sdk';
 * import { createLinkToken, exchangePublicToken } from '@/utils/plaidIntegration';
 * 
 * function BankConnectScreen() {
 *   const [linkToken, setLinkToken] = useState<string | null>(null);
 * 
 *   useEffect(() => {
 *     createLinkToken('user-123').then(setLinkToken);
 *   }, []);
 * 
 *   const handleSuccess = async (success: PlaidSuccessMetadata) => {
 *     await exchangePublicToken(success.publicToken);
 *     // Navigate to success screen
 *   };
 * 
 *   if (!linkToken) return <ActivityIndicator />;
 * 
 *   return (
 *     <PlaidLink
 *       tokenConfig={{ token: linkToken }}
 *       onSuccess={handleSuccess}
 *       onExit={(exit) => console.log('Exit:', exit)}
 *     >
 *       <TouchableOpacity style={styles.button}>
 *         <Text>Connect Bank Account</Text>
 *       </TouchableOpacity>
 *     </PlaidLink>
 *   );
 * }
 */
