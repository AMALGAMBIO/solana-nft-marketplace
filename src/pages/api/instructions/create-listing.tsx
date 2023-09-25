import { Action, NightmarketClient } from '@motleylabs/mtly-nightmarket';
import { Connection, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { price, mint, seller } = req.query;

    if (!price || !mint || !seller) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let mintPublicKey;
    let sellerPublicKey;
    let priceNumber;

    priceNumber = Number(price);

    if (isNaN(priceNumber)) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    try {
      mintPublicKey = new PublicKey(mint as string);
      sellerPublicKey = new PublicKey(seller as string);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid mint or seller public key' });
    }

    try {
      const nightmarketClient = new NightmarketClient(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);

      const txRes: Action = await nightmarketClient.CreateListing(
        mintPublicKey,
        priceNumber,
        sellerPublicKey
      );

      if (!!txRes.err) {
        return res.status(400).json({ error: txRes.err });
      }

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com/'
      );

      const { blockhash } = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: sellerPublicKey,
        recentBlockhash: blockhash,
        instructions: txRes.instructions,
      }).compileToV0Message(txRes.altAccounts);

      const transactionV0 = new VersionedTransaction(messageV0);

      res.status(200).json({ tx: transactionV0.serialize() });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
