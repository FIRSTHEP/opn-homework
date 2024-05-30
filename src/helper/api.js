const API_KEY = '13a7185d-3571-42e8-9adc-4b40c0c72f05'

export async function get(requestData) {
  let url = `https://api.pokemontcg.io/v2${requestData.url}`;
//   const { keyword } = requestData;

//   if (keyword) {
//     url = `${url}&keyword=${keyword}`;
//   }

const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
    //   Accept: 'application/json',
    //   Authorization: `Bearer ${token}`,
      'X-Api-Key': API_KEY,
    },
  });
const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'get_failed');
  }

  if (
    data?.message === 'get_success'
    || data?.errorCode === 'OK'
    || data?.data
  ) {
    return data;
  }
  throw new Error(data.message || 'get_failed');
}
