const { Client } = require('@opensearch-project/opensearch');

const client = new Client({
    node: 'http://opensearch.prod.india.gov.in',
    auth: {
        username: 'admin',
        password: 'Opensearchnic321'
    }
});

async function createIndexWithMapping() {
    const indexName = 'npi_calender_holidays';

    // Define the mapping and settings
    const indexBody = {

        "settings": {
            "index": {
                "number_of_shards": "1",
                    "number_of_replicas": "1",
                        "analysis": {
                    "filter": {
                        "npi_stemmer": {
                            "name": "minimal_english",
                                "type": "stemmer"
                        },
                        "names_synonyms": {
                            "type": "synonym_graph",
                                "synonyms_path": "npisynonym.csv",
                                    "lenient": "true"
                        },
                        "npi_stop": {
                            "type": "stop",
                                "stopwords_path": "npistop.txt"
                        }
                    },
                    "analyzer": {
                        "names_analyzer": {
                            "filter": [
                                "apostrophe",
                                "lowercase",
                                "npi_stemmer",
                                "names_synonyms",
                                "npi_stop"
                            ],
                                "tokenizer": "standard"
                        }
                    }
                }
            }
        },
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
                "calendar_year": { "type": "long" },
                "calender_weight": { "type": "rank_feature" },
                "created_at": { "type": "long" },
                "created_by_id": { "type": "long" },
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
                "id": { "type": "long" },
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
                "is_show_homepage": { "type": "boolean" },
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
                "npiAcquiredDate": { "type": "date" },
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
                "npiModifiedDate": { "type": "date" },
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
                "published_at": { "type": "long" },
                "rank": { "type": "long" },
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
                "updated_at": { "type": "long" },
                "updated_by_id": { "type": "long" },
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
        }
    }

;

// Create the index with mappings and settings
try {
    const response = await client.indices.create({
        index: indexName,
        body: indexBody
    });
    console.log(`Index ${indexName} created successfully`, response);
} catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
}
}

createIndexWithMapping();
