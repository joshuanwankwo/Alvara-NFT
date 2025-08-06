const https = require("https");
const fs = require("fs");
const path = require("path");

// Check for environment variables
function checkEnvVars() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.log("\n⚠️  PINATA CREDENTIALS MISSING");
    console.log("===============================");
    console.log("Please follow these steps:");
    console.log("1. Go to https://app.pinata.cloud/");
    console.log("2. Sign up for free account");
    console.log("3. Create API key with pinning permissions");
    console.log("4. Add to your .env file:");
    console.log("   PINATA_API_KEY=your_api_key_here");
    console.log("   PINATA_SECRET_KEY=your_secret_key_here");
    console.log("\n📖 See IPFS_SETUP.md for detailed instructions");
    return false;
  }

  return { apiKey, secretKey };
}

// Simple HTTPS request wrapper
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${parsed.error || data}`)
            );
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on("error", reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Test connection to Pinata
async function testConnection(credentials) {
  console.log("🔍 Testing Pinata connection...");

  const options = {
    hostname: "api.pinata.cloud",
    path: "/data/testAuthentication",
    method: "GET",
    headers: {
      pinata_api_key: credentials.apiKey,
      pinata_secret_api_key: credentials.secretKey,
    },
  };

  try {
    await makeRequest(options);
    console.log("✅ Pinata connection successful!");
    return true;
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    return false;
  }
}

// Upload JSON to IPFS
async function uploadJSONToIPFS(jsonData, name, credentials) {
  const postData = JSON.stringify({
    pinataContent: jsonData,
    pinataMetadata: {
      name: name,
      keyvalues: {
        project: "Alvara-NFT",
      },
    },
  });

  const options = {
    hostname: "api.pinata.cloud",
    path: "/pinning/pinJSONToIPFS",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      pinata_api_key: credentials.apiKey,
      pinata_secret_api_key: credentials.secretKey,
    },
  };

  const response = await makeRequest(options, postData);
  return response.IpfsHash;
}

// Main upload function
async function uploadToIPFS() {
  console.log("\n🚀 ALVARA NFT COLLECTION → IPFS");
  console.log("================================");

  // Check credentials
  const credentials = checkEnvVars();
  if (!credentials) return;

  // Test connection
  const connected = await testConnection(credentials);
  if (!connected) return;

  // Setup paths
  const jsonDir = path.join(__dirname, "..", "metadata", "json");
  const outputDir = path.join(__dirname, "..", "metadata", "ipfs");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const metadataHashes = {};
  const results = {
    collection: "Alvara NFT",
    timestamp: new Date().toISOString(),
    baseURI: "https://gateway.pinata.cloud/ipfs/",
    metadata: {},
    urls: {},
  };

  console.log("\n📝 Uploading Metadata to IPFS...");
  console.log("================================");

  // Upload each metadata file
  for (let i = 1; i <= 10; i++) {
    const metadataPath = path.join(jsonDir, `${i}.json`);

    if (fs.existsSync(metadataPath)) {
      try {
        console.log(`📤 Uploading ${i}.json...`);

        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        const hash = await uploadJSONToIPFS(
          metadata,
          `Alvara NFT #${i} Metadata`,
          credentials
        );

        metadataHashes[i] = hash;
        results.metadata[i] = hash;
        results.urls[i] = `https://gateway.pinata.cloud/ipfs/${hash}`;

        console.log(`✅ ${i}.json → ipfs://${hash}`);

        // Save local copy with IPFS info
        const updatedMetadata = {
          ...metadata,
          ipfs_hash: hash,
          ipfs_url: `https://gateway.pinata.cloud/ipfs/${hash}`,
        };

        fs.writeFileSync(
          path.join(outputDir, `${i}.json`),
          JSON.stringify(updatedMetadata, null, 2)
        );

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`❌ Failed to upload ${i}.json:`, error.message);
      }
    }
  }

  // Save complete summary
  fs.writeFileSync(
    path.join(outputDir, "upload-summary.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\n🎉 IPFS UPLOAD COMPLETE!");
  console.log("========================");
  console.log(`📁 Results saved to: ${outputDir}/`);
  console.log(
    `📊 ${Object.keys(metadataHashes).length}/10 metadata files uploaded`
  );

  if (Object.keys(metadataHashes).length === 10) {
    console.log("\n🔗 YOUR NFT BASE URI:");
    console.log("https://gateway.pinata.cloud/ipfs/");
    console.log("\n✅ Next Steps:");
    console.log("1. Update smart contract base URI");
    console.log("2. Test minting with IPFS metadata");
    console.log("3. Verify on OpenSea testnet");
  } else {
    console.log("\n⚠️  Some uploads failed. Check errors above and retry.");
  }

  return results;
}

// Run if called directly
if (require.main === module) {
  uploadToIPFS().catch((error) => {
    console.error("\n❌ Upload failed:", error.message);
    process.exit(1);
  });
}

module.exports = { uploadToIPFS };
