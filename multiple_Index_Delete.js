const { Client } = require('@opensearch-project/opensearch');

// OpenSearch client for the target database
const targetClient = new Client({
    node: 'http://192.168.122.37:9080',
    auth: {
        username: 'admin',
        password: 'admin'
    }

    // node: 'http://opensearch.preprod.india.gov.in',
    // auth: {
    //     username: 'admin',
    //     password: 'Opensearchnic321'
    // }
});

// Array of index names to delete
const indexesToDelete = [
    'npi_swaas_culinary_delights_temp',
'npi_s3waas_culinary_delight_24_06_24',
'npi_test_s3waas_culinary_delight',
'npi_s3waas_culinary_delight_10_06_24',
'npi_s3waas_culinary_delight_verify',
'npi_s3waas_culinary_delight_25_06_24',
'npi_s3waas_culinary_delights123456',
'npi_s3waas_culinary_delights_filters',
'npi_culinary_testing_harsh',
];

// List of larger indexes to handle separately with extra delay
const largerIndexesToDelete = [

];

// Function to delete an index with a lower-level request
async function deleteIndexLowLevel(indexName) {
    try {
        const exists = await targetClient.transport.request({
            method: 'HEAD',
            path: `/${indexName}`
        });

        if (exists.statusCode === 200) { // If index exists
            await targetClient.transport.request({
                method: 'DELETE',
                path: `/${indexName}`
            });
            console.log(`Index ${indexName} deleted successfully.`);
        } else {
            console.log(`Index ${indexName} does not exist.`);
        }
    } catch (error) {
        console.error(`Error deleting index ${indexName}:`, error);
    }
}

// Function to delete regular indexes with delay
async function deleteIndexesWithDelay(delay = 2000) { // Increase delay to 2 seconds
    for (const indexName of indexesToDelete) {
        await deleteIndexLowLevel(indexName);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Function to delete larger indexes with additional delay
async function deleteLargeIndexesSeparately(extraDelay = 5000) { // Increase delay for large indexes
    for (const indexName of largerIndexesToDelete) {
        await deleteIndexLowLevel(indexName);
        await new Promise(resolve => setTimeout(resolve, extraDelay));
    }
}

// Start the deletion process for large indexes first, then regular indexes
(async () => {
    console.log("Starting deletion of large indexes...");
    await deleteLargeIndexesSeparately();

    console.log("Starting deletion of regular indexes with delay...");
    await deleteIndexesWithDelay();
})();
