const { Client } = require('@opensearch-project/opensearch');

// OpenSearch client for the target database
const targetClient = new Client({
    // node: 'http://opensearch.preprod.india.gov.in',
    // auth: {
    //     username: 'admin',
    //     password: 'Opensearchnic321'
    // }

    node: 'http://192.168.122.37:9080',
    auth: {
        username: 'admin',
        password: 'admin'
    }
});

// Array of index names from which data should be deleted
const indexesToClear = [
    //   'npi_calender_holidays', 'npi_strapi_whos_who_vvips', 'npi_strapi_whos_who_central', 'npi_strapi_whos_who_judiciary', 'npi_strapi_helpline_contacts', 'npi_strapi_services', 'npi_strapi_category', 'npi_strapi_metadata', 'npi_odop_index'
    'npi_neva_mla_mlc_temp'
];

// Function to delete all documents from an index
async function clearIndexData(indexName) {
    try {
        const { body: response } = await targetClient.deleteByQuery({
            index: indexName,
            body: {
                query: {
                    match_all: {} // Match all documents in the index
                }
            }
        });

        console.log(`Deleted ${response.deleted} documents from index: ${indexName}`);
    } catch (error) {
        console.error(`Error deleting documents from index ${indexName}:`, error);
    }
}

// Function to clear data from all specified indexes
async function clearDataFromIndexes() {
    for (const indexName of indexesToClear) {
        await clearIndexData(indexName);
    }
}

// Start the deletion process
clearDataFromIndexes();
