const fs = require("fs");
const path = require("path");

// Metadata templates for designs 4-10
const metadataTemplates = [
  {
    id: 4,
    name: "Alvara Inferno #4",
    description:
      "A blazing masterpiece that embodies the raw power of digital fire. This Inferno piece radiates intense heat and energy through vibrant reds and oranges, creating a mesmerizing dance of flames.",
    collection: "Inferno",
    rarity: "Epic",
    element: "Fire",
    colorScheme: "Fiery Red",
    energyLevel: 98,
    specialPower: { name: "Flame Intensity", value: 94 },
    background: "8b0000",
  },
  {
    id: 5,
    name: "Alvara Oceanic #5",
    description:
      "A fluid and dynamic creation inspired by the depths of digital oceans. This Oceanic piece flows with the rhythm of waves and currents, bringing tranquility and depth to the collection.",
    collection: "Oceanic",
    rarity: "Rare",
    element: "Water",
    colorScheme: "Ocean Blue",
    energyLevel: 76,
    specialPower: { name: "Tidal Force", value: 85 },
    background: "1e3a8a",
  },
  {
    id: 6,
    name: "Alvara Terra #6",
    description:
      "A grounded and solid composition that draws strength from digital earth elements. This Terra piece showcases the stability and endurance found in nature's most fundamental forces.",
    collection: "Terra",
    rarity: "Uncommon",
    element: "Earth",
    colorScheme: "Earthy Brown",
    energyLevel: 72,
    specialPower: { name: "Stability Force", value: 89 },
    background: "8b4513",
  },
  {
    id: 7,
    name: "Alvara Void #7",
    description:
      "A mysterious and enigmatic piece that explores the darkness between digital spaces. This Void piece represents the unknown, with deep blacks and subtle hints of distant light.",
    collection: "Void",
    rarity: "Legendary",
    element: "Darkness",
    colorScheme: "Deep Black",
    energyLevel: 91,
    specialPower: { name: "Void Manipulation", value: 97 },
    background: "000000",
  },
  {
    id: 8,
    name: "Alvara Solar #8",
    description:
      "A radiant and brilliant creation that captures the essence of digital sunlight. This Solar piece illuminates the collection with warm golds and bright yellows, spreading joy and energy.",
    collection: "Solar",
    rarity: "Epic",
    element: "Light",
    colorScheme: "Golden Yellow",
    energyLevel: 94,
    specialPower: { name: "Solar Radiance", value: 92 },
    background: "ffd700",
  },
  {
    id: 9,
    name: "Alvara Nexus #9",
    description:
      "A complex and interconnected masterpiece that represents the convergence of all digital elements. This Nexus piece is where all energies meet, creating a harmonious balance of power.",
    collection: "Nexus",
    rarity: "Mythic",
    element: "Unity",
    colorScheme: "Multi-Spectral",
    energyLevel: 99,
    specialPower: { name: "Convergence Power", value: 99 },
    background: "4a148c",
  },
  {
    id: 10,
    name: "Alvara Apex #10",
    description:
      "The ultimate expression of digital artistry and the crown jewel of the Alvara collection. This Apex piece represents perfection itself, embodying all elements in perfect harmony.",
    collection: "Apex",
    rarity: "Mythic",
    element: "Perfection",
    colorScheme: "Platinum",
    energyLevel: 100,
    specialPower: { name: "Perfect Harmony", value: 100 },
    background: "e5e4e2",
  },
];

// Create metadata directory if it doesn't exist
const metadataDir = path.join(__dirname, "..", "metadata", "json");
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

// Generate metadata for each design
metadataTemplates.forEach((template) => {
  const metadata = {
    name: template.name,
    description: template.description,
    image: `https://api.alvara-nft.com/images/${template.id}.png`,
    external_url: `https://alvara-nft.com/token/${template.id}`,
    attributes: [
      {
        trait_type: "Collection",
        value: template.collection,
      },
      {
        trait_type: "Rarity",
        value: template.rarity,
      },
      {
        trait_type: "Element",
        value: template.element,
      },
      {
        trait_type: "Color Scheme",
        value: template.colorScheme,
      },
      {
        trait_type: "Energy Level",
        value: template.energyLevel,
        max_value: 100,
        display_type: "number",
      },
      {
        trait_type: template.specialPower.name,
        value: template.specialPower.value,
        max_value: 100,
        display_type: "boost_percentage",
      },
      {
        trait_type: "Creation Date",
        value: 1725187200,
        display_type: "date",
      },
    ],
    background_color: template.background,
  };

  const filePath = path.join(metadataDir, `${template.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  console.log(`Generated metadata for design ${template.id}: ${template.name}`);
});

console.log("\n✅ All metadata files generated successfully!");
console.log(`📁 Files saved to: ${metadataDir}`);
