const data = {
  name: 'string',
  email: 'user@example.com',
  phone: 'string',
  project_type: 'string',
  project_description: 'string',
  budget_min: 0,
  budget_max: 0,
};

const form = document.getElementById('form');

form.addEventListener('submit', (event) => submitFn(event, data));

async function submitFn(event, data) {
  event.preventDefault();
  console.log(data, event);
  try {
    const response = await fetch(process.env.APP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(`Error fetching data: ${JSON.stringify(error)}`);
      } else {
        const errorText = await response.text();
        throw new Error(
          `Unexpected response type: ${
            contentType || 'unknown'
          }, error: ${errorText}`
        );
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got: ${contentType}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch error at ${url}: ${error.message || error}`);
  }
}
