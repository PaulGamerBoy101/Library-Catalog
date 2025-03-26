// Function to fetch and parse the RSS feed based on the query from the URL
function fetchRSS(query) {
    const rssURL = `https://catalog.library.washco.utah.gov/client/rss/hitlist/default/qu=${encodeURIComponent(query)}&te=ILS`;
    fetch(rssURL)
        .then(response => response.text())  // Get the RSS feed as text
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const items = xml.querySelectorAll('item'); // Select all RSS items

            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';  // Clear previous results

            // Display the search query
            document.getElementById('searchQueryText').textContent = query;

            // Loop through each item and display it
            items.forEach(item => {
                const title = item.querySelector('title').textContent;
                const link = item.querySelector('link').textContent;
                const description = item.querySelector('description').textContent;

                // Create a div for each result
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('result-item');
                resultDiv.innerHTML = `
                    <h3><a href="${link}" target="_blank">${title}</a></h3>
                    <p>${description}</p>
                    <a href="${link}" target="_blank">View Details</a>
                `;

                // Append the result to the container
                resultsContainer.appendChild(resultDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error);
        });
}

// Get the query parameter from the URL and fetch the results
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');
if (query) {
    fetchRSS(query);
} else {
    document.getElementById('searchResults').innerHTML = 'No search query provided.';
}
