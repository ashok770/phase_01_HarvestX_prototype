const cropForm = document.getElementById("cropForm");
const results = document.getElementById("calendar_results");

// Fake lifecycle data
const cropLifecycle = {
  "Maize (Corn)": ["Sowing → Week 1", "Vegetative → Week 4", "Flowering → Week 8", "Harvest → Week 16"],
  "Wheat": ["Sowing → Week 1", "Tillering → Week 3", "Booting → Week 6", "Harvest → Week 14"],
  "Rice": ["Sowing → Week 1", "Transplanting → Week 3", "Flowering → Week 9", "Harvest → Week 18"],
  "Potatoes": ["Planting → Week 1", "Tuber Initiation → Week 4", "Bulking → Week 8", "Harvest → Week 12"],
  "Sugarcane": ["Planting → Week 1", "Tillering → Week 6", "Grand Growth → Week 12", "Harvest → Week 40"],
  "Soybeans": ["Sowing → Week 1", "Flowering → Week 5", "Pod Filling → Week 9", "Harvest → Week 14"],
  "Cassava": ["Planting → Week 1", "Root Development → Week 8", "Bulking → Week 20", "Harvest → Week 40"],
  "Barley": ["Sowing → Week 1", "Tillering → Week 3", "Flowering → Week 7", "Harvest → Week 12"],
  "Tomatoes": ["Sowing → Week 1", "Flowering → Week 5", "Fruit Set → Week 8", "Harvest → Week 12"],
  "Bananas": ["Planting → Month 1", "Vegetative Growth → Month 4", "Flowering → Month 8", "Harvest → Month 12"]
};

cropForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const crop = document.getElementById("crop_name").value;
  const sowingDate = document.getElementById("sowing_date").value;

  if (!crop || !sowingDate) {
    results.innerHTML = `<p>Please select a crop and date.</p>`;
    return;
  }

  // Show typing indicator
  results.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;

  setTimeout(() => {
    const phases = cropLifecycle[crop] || ["Lifecycle data not available."];
    let html = `<h3>🌱 Lifecycle for ${crop}</h3><p><strong>Sowing Date:</strong> ${sowingDate}</p><ul>`;
    phases.forEach(stage => html += `<li>${stage}</li>`);
    html += "</ul>";
    results.innerHTML = html;
  }, 1200);
});
