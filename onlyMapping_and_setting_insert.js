const { Client } = require('@opensearch-project/opensearch');
const fs = require('fs').promises;
const readline = require('readline');

// OpenSearch clients for source and target databases
const sourceClient = new Client({
    node: 'http://opensearch.preprod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

const targetClient = new Client({
    node: 'http://opensearch.prod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

// Array of index names in the source OpenSearch
const sourceIndexes = [
    'npi_calender_holidays',
    'npi_award',
    // Add more indexes as needed...
];

// Function to fetch data from a source index
async function fetchDataFromIndex(indexName) {
    const indexData = [];
    try {
        const { body: response } = await sourceClient.search({
            index: indexName,
            scroll: '1m',
            size: 1000,
            body: { query: { match_all: {} } }
        });

        let scrollId = response._scroll_id;
        let hits = response.hits.hits;

        while (hits.length) {
            indexData.push(...hits.map(hit => hit._source));

            const { body: nextResponse } = await sourceClient.scroll({
                scroll_id: scrollId,
                scroll: '1m'
            });

            scrollId = nextResponse._scroll_id;
            hits = nextResponse.hits.hits;
        }

        console.log(`Fetched ${indexData.length} documents from index: ${indexName}`);
        return indexData;
    } catch (error) {
        console.error(`Error fetching data from index ${indexName}:`, error);
    }
}

// Function to save data to a JSON file
async function saveDataToJsonFile(indexName, data) {
    const filePath = `./${indexName}_data.json`;
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Data from ${indexName} saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving data to file for index ${indexName}:`, error);
    }
}

// Function to fetch and print mapping and settings from the source index
async function getMappingAndSettings(indexName) {
    try {
        // Get mapping
        const { body: mapping } = await sourceClient.indices.getMapping({ index: indexName });
        // Get settings
        const { body: settings } = await sourceClient.indices.getSettings({ index: indexName });

        console.log(`Mapping for ${indexName}:`, JSON.stringify(mapping[indexName].mappings, null, 2));
        console.log(`Settings for ${indexName}:`, JSON.stringify(settings[indexName].settings, null, 2));

        // Return mapping and settings to use in the target index creation
        return {
            settings: settings[indexName].settings,
            mappings: mapping[indexName].mappings
        };
    } catch (error) {
        console.error(`Error fetching mapping and settings for ${indexName}:`, error);
    }
}

// Function to create a new index in the target OpenSearch DB using fetched mapping and settings
async function createNewIndex(indexName) {
    try {
        const { body: exists } = await targetClient.indices.exists({ index: indexName });
        if (exists) {
            console.log(`Index ${indexName} already exists in target DB`);
            return 'exists';
        } else {
            // Get mapping and settings from the source index
            const indexSettings = await getMappingAndSettings(indexName);
            if (!indexSettings) {
                console.error(`Failed to get mapping and settings for ${indexName}`);
                return 'error';
            }

            await targetClient.indices.create({
                index: indexName,
                body: indexSettings
            });
            console.log(`Index ${indexName} created successfully in target DB`);
            return 'created';
        }
    } catch (error) {
        console.error(`Error creating index ${indexName} in target DB:`, error);
    }
}

// Main function to process indexes
async function processIndexes() {
    const skippedIndexes = [];

    for (const indexName of sourceIndexes) {
        // Fetch data from source index
        const data = await fetchDataFromIndex(indexName);

        // Save data to a JSON file
        if (data) {
            await saveDataToJsonFile(indexName, data);
        } else {
            console.log(`No data fetched from index ${indexName}`);
            continue;
        }

        // Check if the index exists in the target DB and create if not
        const status = await createNewIndex(indexName);

        if (status === 'exists') {
            // Ask user for permission to proceed
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const permission = await new Promise(resolve => {
                rl.question(`Index ${indexName} exists. Do you want to overwrite it? (yes/no): `, (answer) => {
                    rl.close();
                    resolve(answer.toLowerCase() === 'yes');
                });
            });

            if (!permission) {
                console.log(`Skipped creation and data copy for index: ${indexName}`);
                skippedIndexes.push(indexName);
                continue;
            }
        }

        // Copy data to the new index if allowed
        await copyDataToNewIndex(indexName);
    }

    // Log skipped indexes
    if (skippedIndexes.length) {
        console.log('Skipped indexes:', skippedIndexes.join(', '));
        await fs.writeFile('./skipped_indexes.log', `Skipped indexes:\n${skippedIndexes.join('\n')}`, 'utf-8');
    }
}

// Start the process
processIndexes();
