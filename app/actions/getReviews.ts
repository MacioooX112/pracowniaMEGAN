'use server';

export interface Opinion {
  name: string;
  text: string;
  visible: boolean;
}

export async function getGoogleReviews(): Promise<Opinion[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error('Brak GOOGLE_PLACES_API_KEY lub GOOGLE_PLACE_ID w pliku .env.local');
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&language=pl&key=${apiKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Zapytanie do Google wykonuje się raz na 24h
    });

    const data = await res.json();

    if (data.status !== 'OK' || !data.result?.reviews) {
      return [];
    }

    // Filtrowanie opinii z oceną 5 oraz mapowanie do formatu Twojego komponentu
    return data.result.reviews
      .filter((review: { rating: number }) => review.rating === 5)
      .map((review: { author_name: string; text: string }) => ({
        name: review.author_name,
        text: review.text,
        visible: true,
      }));
  } catch (error) {
    console.error('Błąd podczas pobierania opinii Google:', error);
    return [];
  }
}