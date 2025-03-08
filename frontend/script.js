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
const dbResults = document.getElementById('db');

form.addEventListener('submit', (event) => submitFn(event));

async function postData(body) {}

async function submitFn(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const body = Object.fromEntries(formData.entries());
  console.log('body:', body);

  try {
    const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.log('data:', data);
    return data;
  } catch (error) {
    throw new Error(`Fetch error: ${error.message || error}`);
  }
}
