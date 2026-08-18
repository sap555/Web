const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export async function saveResidentToGoogleSheets(resident) {
  if (!SHEETS_URL) {
    return { skipped: true, reason: 'No Google Sheets URL configured' };
  }

  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveResident',
        resident,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets request failed: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return { skipped: false, data };
  } catch (error) {
    console.warn('Google Sheets sync failed:', error);
    return { skipped: true, reason: error.message };
  }
}

export async function syncVillageDataToGoogleSheets(villages) {
  if (!SHEETS_URL) {
    return { skipped: true, reason: 'No Google Sheets URL configured' };
  }

  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveVillages',
        villages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets request failed: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return { skipped: false, data };
  } catch (error) {
    console.warn('Village Google Sheets sync failed:', error);
    return { skipped: true, reason: error.message };
  }
}
