import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function GET() {
  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    return NextResponse.json(
      { error: 'Brak URL arkusza w .env.local' }, 
      { status: 500 }
    );
  }

  try {
    // Serwer pobiera dane z Google Sheets i pamięta je przez 1h (3600s)
    const res = await fetch(csvUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Nie udało się pobrać arkusza');

    const csvText = await res.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const reviews = parsed.data
      .map((row: any) => ({
        name: row['Imię'] || 'Anonim',
        text: row['Treść'] || '',
        visible: (row['Widoczna'] || '').trim().toUpperCase() === 'TAK',
      }))
      .filter((review: any) => review.visible && review.text.length > 0);

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd serwera podczas przetwarzania opinii' }, 
      { status: 500 }
    );
  }
}