// pages/api/donationStats.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
// Cell ranges for donors (column B) and status (column L)
const DONORS_CELL = "Form Responses 1!B:B";
const STATUS_CELL = "Form Responses 1!L:L";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the URL for the batchGet request using both ranges
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}`;
  const ranges = `&ranges=${encodeURIComponent(DONORS_CELL)}&ranges=${encodeURIComponent(STATUS_CELL)}`;
  const url = endpoint + ranges;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch donation stats' });
      return;
    }
    const data = await response.json();

    // Expect two valueRanges: one for donor names and one for statuses.
    if (data.valueRanges && data.valueRanges.length >= 2) {
      const donorRows = data.valueRanges[0].values || [];
      const statusRows = data.valueRanges[1].values || [];

      // Exclude header rows from both columns.
      const donorData = donorRows.slice(1);
      const statusData = statusRows.slice(1);

      // Use the smaller length to avoid index issues.
      const minLength = Math.min(donorData.length, statusData.length);

      let donorsCount = 0;
      let recentDonors: { name: string }[] = [];

      for (let i = 0; i < minLength; i++) {
        const donorName = donorData[i][0] ? donorData[i][0].trim() : '';
        const status = statusData[i][0] ? statusData[i][0].trim() : '';
        // Only count if the status is "Donated" and donor cell is non-empty.
        if (status === "Donated" && donorName !== '') {
          donorsCount++;
          recentDonors.push({ name: donorName });
        }
      }

      // Only return the 10 most recent donors.
      recentDonors = recentDonors.slice(-10);
      // Assuming 1 unit per donor.
      const unitsCount = donorsCount * 1;

      res.status(200).json({
        donors: donorsCount,
        units: unitsCount,
        recentDonors,
      });
      return;
    }
    // Fallback if data isn't structured as expected.
    res.status(200).json({ donors: 0, units: 0, recentDonors: [] });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ donors: 0, units: 0, recentDonors: [] });
  }
}
