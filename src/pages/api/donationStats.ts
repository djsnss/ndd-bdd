// pages/api/donationStats.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
// Cell range for column B (adjust if needed)
const DONORS_CELL = "Form Responses 1!B:B";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the URL for the batchGet request using the donors range
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}`;
  const ranges = `&ranges=${encodeURIComponent(DONORS_CELL)}`;
  const url = endpoint + ranges;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch donation stats' });
      return;
    }
    const data = await response.json();

    if (data.valueRanges && data.valueRanges.length >= 1) {
      const rows = data.valueRanges[0].values || [];
      // Exclude the header row
      const donorRows = rows.slice(1);
      // Filter non-empty cells
      const filteredDonorRows = donorRows.filter((row: string[]) => row[0] && row[0].trim() !== '');
      const donorsCount = filteredDonorRows.length;
      const unitsCount = donorsCount * 1; // Assuming 1 unit per donor

      // Get the 10 latest donors (assuming latest entries are at the bottom)
      const recentDonors = filteredDonorRows.slice(-10).map((row: string[]) => ({ name: row[0].trim() }));

      res.status(200).json({
        donors: donorsCount,
        units: unitsCount,
        recentDonors,
      });
      return;
    }
    res.status(200).json({ donors: 0, units: 0, recentDonors: [] });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ donors: 0, units: 0, recentDonors: [] });
  }
}
