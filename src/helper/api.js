const API_KEY = '13a7185d-3571-42e8-9adc-4b40c0c72f05';

export async function get(requestData) {
  try {
    let url = `https://api.pokemontcg.io/v2${requestData.url}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch data: ' + error.message);
  }
}