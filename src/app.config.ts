interface AppConfig {
  baseUrl: string;
  graphqlUrl: string;
  solanaRPCUrl: string;
  marketplaceSubdomain: string;
  socialMedia: {
    twitter?: string;
    discord?: string;
    medium?: string;
  };
}

const config: AppConfig = {
  baseUrl: 'https://holaplex.com', // could also be an ENV variable
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
  solanaRPCUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
  marketplaceSubdomain: process.env.NEXT_PUBLIC_MARKETPLACE_SUBDOMAIN as string,
  socialMedia: {
    twitter: '#',
    discord: '#',
    medium: '#',
  },
};

export default config;
