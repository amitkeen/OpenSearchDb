const { Client } = require('@opensearch-project/opensearch');

// Source OpenSearch client
const sourceClient = new Client({

    // node: 'http://192.168.122.37:9080',
    // auth: {
    //     username: 'admin',
    //     password: 'admin'
    // }

    // node: 'http://opensearch.preprod.india.gov.in',
    // auth: {
    //     username: 'admin',
    //     password: 'Opensearchnic321'
    // }

    node: 'http://opensearch.prod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

// Function to get and print the list of indexes from the source database
async function getIndexes() {
    try {
        const { body } = await sourceClient.cat.indices({
            format: 'json'
        });

        // Extract index names and print them
        const indexNames = body.map(index => index.index);
        console.log('Indexes in the source database:', indexNames);
        const indexName = body.count
    } catch (error) {
        console.error('Error fetching indexes:', error);
    }
}

// Run the function to get and print indexes
getIndexes();
