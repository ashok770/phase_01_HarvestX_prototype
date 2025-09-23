// ================================
// Crop Lifecycle Tracker JS
// ================================

// Get the form element
const cropForm = document.getElementById('cropForm');

// Listen for form submission
cropForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // ================================
    // Collect form data
    // ================================
    const formData = new FormData(cropForm); // Get form data
    const data = Object.fromEntries(formData.entries()); // Convert to JS object
    // Example: { crop_name: "Maize (Corn)", sowing_date: "2025-09-23" }

    // Get the results div and show loading message
    const resultsDiv = document.getElementById('calendar_results');
    resultsDiv.innerHTML = '<p style="color: #2e7d32; font-weight: bold;">Fetching calendar...</p>';

    // ================================
    // Connect to API using fetch()
    // ================================
    fetch('YOUR_API_URL_HERE', { // Replace with your API URL
        method: 'POST',           // POST method to send data
        headers: {
            'Content-Type': 'application/json' // Sending JSON
        },
        body: JSON.stringify(data) // Convert JS object to JSON string
    })
    .then(response => {
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json(); // Parse JSON response
    })
    .then(result => {
        // Clear previous results
        resultsDiv.innerHTML = '';

        // Handle API errors
        if (result.error) {
            resultsDiv.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ Error: ${result.error}</p>`;
            return;
        }

        // Display events if available
        if (result.events && result.events.length > 0) {
            const list = document.createElement('ul');

            result.events.forEach((ev, index) => {
                const listItem = document.createElement('li');
                // Format: Date → Event
                listItem.innerHTML = `<b>${ev.date}</b> → 🌾 ${ev.event}`;
                listItem.style.animationDelay = `${0.1 * index}s`; // staggered animation
                list.appendChild(listItem);
            });

            resultsDiv.appendChild(list);
        } else {
            // No events returned
            resultsDiv.innerHTML = '<p style="color:gray;">🌱 No events found for this crop.</p>';
        }
    })
    .catch(error => {
        // Network or fetch error
        console.error('Error:', error);
        resultsDiv.innerHTML =
            '<p style="color:red; font-weight:bold;">🚨 Failed to fetch calendar data. Check your API URL and network.</p>';
    });
});
