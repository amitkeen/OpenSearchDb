const { Client } = require('@opensearch-project/opensearch');

// OpenSearch client for the target database
const targetClient = new Client({
    node: 'http://opensearch.preprod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

// Array of index names to check
const indexesToCheck = [

    // 'npiaudit_strapi',
  
];

// Function to check if an index exists
async function checkIndexExists(indexName) {
    try {
        const { body: exists } = await targetClient.indices.exists({ index: indexName });
        if (exists) {
            console.log(`Index ${indexName} exists.`);
        } else {
            console.log(`Index ${indexName} does not exist.`);
        }
    } catch (error) {
        console.error(`Error checking index ${indexName}:`, error);
    }
}

// Function to check the presence of all indexes
async function checkIndexes() {
    for (const indexName of indexesToCheck) {
        await checkIndexExists(indexName);
    }
}

// Start checking the indexes
checkIndexes();
