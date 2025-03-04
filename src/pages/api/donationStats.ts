// pages/api/donationStats.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Replace these with your actual Google Sheets values
const SPREADSHEET_ID = `${process.env.SPREADSHEET_ID}`;
const API_KEY = `${process.env.GOOGLE_SHEETS_API_KEY}`;
// Example cell references. Adjust these based on where the data lives in your sheet.
const DONORS_CELL = `${process.env.DONORS_CELL}`;
const UNITS_CELL = `${process.env.UNITS_CELL}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the URL for the batchGet request
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}`;
  // Encode the ranges in case they contain special characters
  const ranges = `&ranges=${encodeURIComponent(DONORS_CELL)}&ranges=${encodeURIComponent(UNITS_CELL)}`;
  const url = endpoint + ranges;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch donation stats' });
      return;
    }
    const data = await response.json();

    // Ensure that we have at least two valueRanges returned
    if (data.valueRanges && data.valueRanges.length >= 2) {
      const donorsValue = data.valueRanges[0].values?.[0]?.[0];
      const unitsValue = data.valueRanges[1].values?.[0]?.[0];

      res.status(200).json({
        donors: Number(donorsValue),
        units: Number(unitsValue),
      });
      return;
    }
    // Fallback if data isn't structured as expected
    res.status(200).json({ donors: 0, units: 0 });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ donors: 0, units: 0 });
  }
}
