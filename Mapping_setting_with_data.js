const { Client } = require('@opensearch-project/opensearch');
const fs = require('fs').promises;
const readline = require('readline');

// OpenSearch client for the source and target databases
const sourceClient = new Client({
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

const targetClient = new Client({
    node: 'http://opensearch.preprod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

// Array of index names in source OpenSearch (replace with your actual index names)
const sourceIndexes = [

    'npiaudit_strapi',
    'npi_strapi_state_dists',
    'npi_strapi_services_suggestor',
    'npi_strapi_spotlights',
    'npi_strapi_landings_description',
    'npi_strapi_menu_datas',
    'npi_strapi_cbps_banners',
    'npi_strapi_owners',
    'npi_strapi_newsletters',
    'npi_strapi_extra_pages',
    'npi_strapi_discovering_bharats',
    'npi_strapi_home_images',

    'npi_s3waas_public_utility_banks',
    'npi_calender_holidays',
      'npi_award',
      'npi_neva_mla',
      'npi_ogd_catalogs',
      'npi_s3waas_public_utility_colleges',
      'npi_igod_category_index',
      'npi_ogd_ministry',
      'npi_my_gov_sectors',
      'npi_myscheme_search',
      'npi_s3waas_public_utility_municipalities',
      'npi_s3waas_district_list',
      'npi_s3waas_state_list',
      'npi_igod_countrylist',
      'npi_pib_news',
      'npi_s3waas_culinary_delights',
      'npi_s3waas_public_utility_ngos',
      'npi_mp_loksabha_member_position',
      'npi_s3waas_whos_who',
      'npi_s3waas_public_utility_hospitals',
      'npi_my_gov_groups',
      'npi_myscheme_ministry',
      'npi_mp_loksabhadocs_mpsno_all_member',
      'npi_s3waas_tourist_places',
      'npi_mp_rajyasabha',
      'npi_s3waas_public_utility_school',
      'npi_india_code_india_act_state',
      'npi_igod_list_web_directories',
      'npi_mp_rajyasabha_position',
      'npi_news_on_air',
      'npi_mp_loksabha_member',
      'npi_odop_index',
      'npi_my_gov_infographics',
      'npi_my_gov_node',
      'npi_neva_mla_mlc',
      'npi_s3waas_ecourt_judges',
      'npi_s3waas_india_produce',
      'npi_india_code_india_act',
      'npi_s3waas_public_utility_electricity',
      'npi_ogd_sector',
      'npi_pib_pib_ministry',
      'npi_igod_ug_ministries_departments',
      'npi_s3waas_public_utility_postals',
      'npi_mp_rajyasabha_member',
      'npi_s3waas_accommodation',
      'npi_dd_news_index',
      'npi_igod_list_organization_types',
      'npi_myscheme_category',
      'npi_myscheme_facet',
      'npi_s3waas_helpline',
      'npi_pib_gallery',
      'npi_myscheme_state',
      'npi_igod_list_all_states'
];

// Settings and mappings for the new indexes
const indexSettings = {

    "mappings": {
        "properties": {
            "alias": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "calendar_year": {
                "type": "long"
            },
            "calender_weight": {
                "type": "rank_feature"
            },
            "created_at": {
                "type": "long"
            },
            "created_by_id": {
                "type": "long"
            },
            "date": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "day": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "description": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "designation": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "facebook_url": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "holiday_type": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "house": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "id": {
                "type": "long"
            },
            "imageUrl": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "insta_url": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "is_show_homepage": {
                "type": "boolean"
            },
            "keywords": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    }
                },
                "analyzer": "names_analyzer"
            },
            "mp_code": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiAcquiredDate": {
                "type": "date"
            },
            "npiAcquiredState": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiAlias": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiContentType": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiInducedState": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiKeywords": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    }
                },
                "analyzer": "names_analyzer"
            },
            "npiMinistryDepartment": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiModifiedBy": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "npiModifiedDate": {
                "type": "date"
            },
            "npiSearchGroup": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "page_description": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "published_at": {
                "type": "long"
            },
            "rank": {
                "type": "long"
            },
            "review": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "review_email": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "stateName": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    }
                },
                "analyzer": "names_analyzer"
            },
            "title": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    },
                    "suggest": {
                        "type": "text"
                    }
                },
                "analyzer": "names_analyzer"
            },
            "updated_at": {
                "type": "long"
            },
            "updated_by_id": {
                "type": "long"
            },
            "url": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            }
        }
    },
    "settings": {
        "index": {
            "analysis": {
                "analyzer": {
                    "names_analyzer": {
                        "tokenizer": "standard",
                        "filter": [
                            "apostrophe",
                            "lowercase",
                            "npi_stemmer",
                            "names_synonyms",
                            "npi_stop"
                        ]
                    }
                },
                "filter": {
                    "names_synonyms": {
                        "type": "synonym_graph",
                        "synonyms_path": "npisynonym.csv",
                        "lenient": true
                    },
                    "npi_stop": {
                        "type": "stop",
                        "stopwords_path": "npistop.txt"
                    },
                    "npi_stemmer": {
                        "type": "stemmer",
                        "name": "minimal_english"
                    }
                }
            }
        }
    },

};

// Function to fetch data from a single index and save it to a JSON file
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

// Function to create a new index in the target OpenSearch DB
async function createNewIndex(indexName) {
    try {
        const { body: exists } = await targetClient.indices.exists({ index: indexName });
        if (!exists) {
            await targetClient.indices.create({
                index: indexName,
                body: indexSettings
            });
            console.log(`Index ${indexName} created successfully in target DB`);
        } else {
            console.log(`Index ${indexName} already exists in target DB`);
        }
    } catch (error) {
        console.error(`Error creating index ${indexName} in target DB:`, error);
    }
}

// Function to copy data from JSON to the new index
async function copyDataToNewIndex(indexName) {
    const filePath = `./${indexName}_data.json`;
    try {
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        const bulkBody = data.flatMap(doc => [
            { index: { _index: indexName } },
            doc
        ]);

        await targetClient.bulk({ refresh: true, body: bulkBody });
        console.log(`Data from ${filePath} copied to new index ${indexName}`);
    } catch (error) {
        console.error(`Error copying data to index ${indexName}:`, error);
    }
}

// Main function to handle the entire flow for all 10 indexes
async function processIndexes() {
    for (const indexName of sourceIndexes) {
        // Fetch data from source index
        const data = await fetchDataFromIndex(indexName);

        // Save data to a JSON file
        await saveDataToJsonFile(indexName, data);

        // Ask user for permission to proceed
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const permission = await new Promise(resolve => {
            rl.question(`Do you want to proceed with creating index ${indexName} and copying data? (yes/no): `, (answer) => {
                rl.close();
                resolve(answer.toLowerCase() === 'yes');
            });
        });

        // If user grants permission, create the new index and copy data
        if (permission) {
            await createNewIndex(indexName);
            await copyDataToNewIndex(indexName);
        } else {
            console.log(`Skipped creation and data copy for index: ${indexName}`);
        }
    }
}

// Start the process
processIndexes();
