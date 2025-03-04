// pages/api/leaderboardStats.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
// Department names are in column H and statuses in column L, on "Form Responses 1"
const DEPARTMENTS_CELL = "Form Responses 1!H:H";
const STATUS_CELL = "Form Responses 1!L:L";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the URL for the batchGet request using both ranges
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}`;
  const ranges = `&ranges=${encodeURIComponent(DEPARTMENTS_CELL)}&ranges=${encodeURIComponent(STATUS_CELL)}`;
  const url = endpoint + ranges;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch leaderboard stats' });
      return;
    }
    const data = await response.json();

    // Expect two valueRanges: one for departments and one for statuses.
    if (data.valueRanges && data.valueRanges.length >= 2) {
      const departmentRows = data.valueRanges[0].values || [];
      const statusRows = data.valueRanges[1].values || [];

      // Exclude header rows from both columns.
      const deptData = departmentRows.slice(1);
      const statusData = statusRows.slice(1);

      // Use the smaller length to avoid index issues.
      const minLength = Math.min(deptData.length, statusData.length);

      // Initialize the department counters.
      const departmentCounts = {
        COMPS: 0,
        IT: 0,
        EXTC: 0,
        MECH: 0,
        CSEDS: 0,
        AIML: 0,
        AIDS: 0,
        ICB: 0,
      };

      // Iterate over each row.
      for (let i = 0; i < minLength; i++) {
        const deptCell = deptData[i][0] ? deptData[i][0].trim().toUpperCase() : '';
        const statusCell = statusData[i][0] ? statusData[i][0].trim() : '';
        // Only count the department if the corresponding status is "Donated"
        if (statusCell === "Donated" && Object.prototype.hasOwnProperty.call(departmentCounts, deptCell)) {
          // Type assertion informs TS that deptCell is a key of departmentCounts.
          departmentCounts[deptCell as keyof typeof departmentCounts]++;
        }
      }

      res.status(200).json(departmentCounts);
      return;
    }
    // Fallback if data isn't structured as expected
    res.status(200).json({
      COMPS: 0,
      IT: 0,
      EXTC: 0,
      MECH: 0,
      CSEDS: 0,
      AIML: 0,
      AIDS: 0,
      ICB: 0,
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
