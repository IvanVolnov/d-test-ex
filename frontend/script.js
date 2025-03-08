// const data = {
//   name: 'string',
//   email: 'user@example.com',
//   phone: 'string',
//   project_type: 'string',
//   project_description: 'string',
//   budget_min: 0,
//   budget_max: 0,
// };

const form = document.getElementById('form');
const dbResults = document.getElementById('db');
// const url = 'http://localhost:5000';
const url = 'https://d-test-ex-production.up.railway.app';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());
    const data = await postData(url, body);
    console.log('Database data:', data);

    dbResults.textContent = `Project ${
      data.at(-1).name
    } was successfully added to the database! Check the console to view all projects stored on the server.`;
  } catch (error) {
    console.error(error);
    dbResults.textContent = `Error: ${error.message}`;
  }
});

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorDetail;
    if (contentType?.includes('application/json')) {
      errorDetail = await response.json();
    } else {
      errorDetail = await response.text();
    }
    throw new Error(`Error fetching data: ${JSON.stringify(errorDetail)}`);
  }

  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON response, got: ${contentType}`);
  }

  return response.json();
}
