const { Client } = require('@opensearch-project/opensearch');

// Source OpenSearch client
const sourceClient = new Client({
    node: 'http://192.168.122.37:9080',
    auth: {
        username: 'admin',
        password: 'admin'
    }
});

// Target OpenSearch client
const targetClient = new Client({
    node: 'http://opensearch.prod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

// Array of index names to copy data
const indexesToCopy = [
    'npi_neva_mla_mlc'
];

// Function to fetch data from a single index in the source OpenSearch
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

            // Fetch next set of documents
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

// Function to copy data to the target index
async function copyDataToTargetIndex(indexName, data) {
    try {
        const bulkBody = data.flatMap(doc => [
            { index: { _index: indexName } },
            doc
        ]);

        await targetClient.bulk({ refresh: true, body: bulkBody });
        console.log(`Data copied to target index: ${indexName}`);
    } catch (error) {
        console.error(`Error copying data to index ${indexName}:`, error);
    }
}

// Main function to handle copying for all specified indexes
async function copyIndexes() {
    for (const indexName of indexesToCopy) {
        // Fetch data from the source index
        const data = await fetchDataFromIndex(indexName);

        // Copy data to the target index
        if (data && data.length > 0) {
            await copyDataToTargetIndex(indexName, data);
        } else {
            console.log(`No data found in index: ${indexName}`);
        }
    }
}

// Start the copy process
copyIndexes();
