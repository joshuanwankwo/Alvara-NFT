const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "..", "metadata", "images");

// Our NFT design themes for reference
const nftDesigns = [
  {
    id: 1,
    name: "Alvara Genesis",
    theme: "Crystal/Prismatic",
    rarity: "Legendary",
  },
  { id: 2, name: "Alvara Mystic", theme: "Cosmic/Deep Purple", rarity: "Epic" },
  {
    id: 3,
    name: "Alvara Ethereal",
    theme: "Wind/Soft Gradient",
    rarity: "Rare",
  },
  { id: 4, name: "Alvara Inferno", theme: "Fire/Fiery Red", rarity: "Epic" },
  { id: 5, name: "Alvara Oceanic", theme: "Water/Ocean Blue", rarity: "Rare" },
  {
    id: 6,
    name: "Alvara Terra",
    theme: "Earth/Earthy Brown",
    rarity: "Uncommon",
  },
  {
    id: 7,
    name: "Alvara Void",
    theme: "Darkness/Deep Black",
    rarity: "Legendary",
  },
  { id: 8, name: "Alvara Solar", theme: "Light/Golden Yellow", rarity: "Epic" },
  {
    id: 9,
    name: "Alvara Nexus",
    theme: "Unity/Multi-Spectral",
    rarity: "Mythic",
  },
  {
    id: 10,
    name: "Alvara Apex",
    theme: "Perfection/Platinum",
    rarity: "Mythic",
  },
];

function listCurrentImages() {
  console.log("\n🖼️  CURRENT IMAGES IN FOLDER:");
  console.log("=====================================");

  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => {
      // Sort by timestamp in filename (newest first)
      const timeA = a.match(/(\d{1,2})\.(\d{2})\.(\d{2})/);
      const timeB = b.match(/(\d{1,2})\.(\d{2})\.(\d{2})/);
      if (timeA && timeB) {
        return timeB[0].localeCompare(timeA[0]);
      }
      return a.localeCompare(b);
    });

  files.forEach((file, index) => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`${(index + 1).toString().padStart(2)}. ${file}`);
    console.log(
      `    Size: ${size}KB | Modified: ${stats.mtime.toLocaleString()}`
    );
    console.log("");
  });

  console.log("\n🎨 TARGET NFT DESIGNS:");
  console.log("======================");
  nftDesigns.forEach((design) => {
    console.log(
      `${design.id.toString().padStart(2)}. ${design.name} - ${design.theme} (${
        design.rarity
      })`
    );
  });

  console.log("\n📋 INSTRUCTIONS:");
  console.log("=================");
  console.log("1. Review your images and our NFT design themes above");
  console.log("2. Decide which image should be which NFT design (1-10)");
  console.log("3. Run: node scripts/organizeImages.js rename [mapping]");
  console.log("");
  console.log(
    "Example mapping (if image 1 should be design 5, image 2 should be design 1, etc.):"
  );
  console.log(
    'node scripts/organizeImages.js rename "1:5,2:1,3:8,4:2,5:3,6:4,7:6,8:7,9:9,10:10"'
  );
  console.log("");
  console.log('Or run with "auto" to use chronological order:');
  console.log("node scripts/organizeImages.js rename auto");
}

function renameImages(mapping) {
  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => {
      const timeA = a.match(/(\d{1,2})\.(\d{2})\.(\d{2})/);
      const timeB = b.match(/(\d{1,2})\.(\d{2})\.(\d{2})/);
      if (timeA && timeB) {
        return timeB[0].localeCompare(timeA[0]);
      }
      return a.localeCompare(b);
    });

  console.log("\n🔄 RENAMING IMAGES...");
  console.log("====================");

  let mappingObj = {};

  if (mapping === "auto") {
    // Auto-assign first 10 images to designs 1-10
    for (let i = 0; i < Math.min(10, files.length); i++) {
      mappingObj[i + 1] = i + 1;
    }
  } else {
    // Parse custom mapping
    const pairs = mapping.split(",");
    pairs.forEach((pair) => {
      const [imageIndex, designId] = pair.split(":").map((n) => parseInt(n));
      if (
        imageIndex &&
        designId &&
        imageIndex <= files.length &&
        designId <= 10
      ) {
        mappingObj[imageIndex] = designId;
      }
    });
  }

  // Create backup directory
  const backupDir = path.join(imagesDir, "backup");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // Process each mapping
  Object.entries(mappingObj).forEach(([imageIndex, designId]) => {
    const sourceFile = files[imageIndex - 1];
    if (sourceFile) {
      const sourcePath = path.join(imagesDir, sourceFile);
      const backupPath = path.join(backupDir, sourceFile);
      const targetPath = path.join(imagesDir, `${designId}.png`);

      // Backup original
      fs.copyFileSync(sourcePath, backupPath);

      // Rename to target
      fs.renameSync(sourcePath, targetPath);

      const design = nftDesigns.find((d) => d.id === designId);
      console.log(`✅ Image ${imageIndex} → ${designId}.png (${design?.name})`);
    }
  });

  console.log("\n✅ RENAMING COMPLETE!");
  console.log(`📁 Original files backed up to: ${backupDir}`);
  console.log("\n🎯 FINAL IMAGES:");

  // List final images
  const finalFiles = fs
    .readdirSync(imagesDir)
    .filter((file) => file.match(/^\d+\.png$/))
    .sort((a, b) => parseInt(a) - parseInt(b));

  finalFiles.forEach((file) => {
    const designId = parseInt(file);
    const design = nftDesigns.find((d) => d.id === designId);
    console.log(`  ${file} - ${design?.name} (${design?.theme})`);
  });
}

// Main execution
const command = process.argv[2];
const mapping = process.argv[3];

if (command === "rename" && mapping) {
  renameImages(mapping);
} else {
  listCurrentImages();
}
