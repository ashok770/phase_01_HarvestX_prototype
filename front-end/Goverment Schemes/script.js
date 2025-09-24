const allSchemes = [
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Provides crop insurance against all non-preventable natural risks.",
    state: "All States",
    crops: ["Wheat", "Rice", "Pulses", "Coarse Cereals", "Commercial Crops"]
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming through cluster-based organic farming.",
    state: "All States",
    crops: ["All Crops"]
  },
  {
    name: "National Mission on Micro Irrigation",
    description: "Provides financial assistance for installing drip and sprinkler irrigation systems.",
    state: "All States",
    crops: ["All Crops"]
  },
  {
    name: "National Food Security Mission",
    description: "Aims to increase the production of rice, wheat, pulses, coarse cereals, and commercial crops.",
    state: "All States",
    crops: ["Rice", "Wheat", "Pulses", "Coarse Cereals", "Commercial Crops"]
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "An umbrella scheme to provide flexibility and autonomy to states in planning and executing agriculture-related schemes.",
    state: "All States",
    crops: ["All Crops"]
  },
  {
    name: "Mahatma Jyotirao Phule Shetkari Karj Mukti Yojana",
    description: "A loan waiver scheme for farmers in Maharashtra.",
    state: "Maharashtra",
    crops: ["All Crops"]
  }
];

function findSchemes() {
  const state = document.getElementById("state-select").value;
  const crop = document.getElementById("crop-select").value;
  const schemesContainer = document.getElementById("schemes-container");
  const noSchemesMessage = document.getElementById("no-schemes-message");

  schemesContainer.innerHTML = ""; // Clear old results
  schemesContainer.classList.remove("hidden");

  const filteredSchemes = allSchemes.filter(scheme => {
    const stateMatch = scheme.state === "All States" || scheme.state === state;
    const cropMatch = scheme.crops.includes("All Crops") || scheme.crops.includes(crop);
    return stateMatch && cropMatch;
  });

  if (filteredSchemes.length === 0) {
    noSchemesMessage.classList.remove("hidden");
  } else {
    noSchemesMessage.classList.add("hidden");
    filteredSchemes.forEach(scheme => {
      const schemeDiv = document.createElement("div");
      schemeDiv.className = "scheme-card";
      schemeDiv.innerHTML = `
        <h3>${scheme.name}</h3>
        <p>${scheme.description}</p>
        <a href="#">Learn More</a>
      `;
      schemesContainer.appendChild(schemeDiv);
    });
  }
}

document.getElementById("find-btn").addEventListener("click", findSchemes);
