const { Client } = require('@opensearch-project/opensearch');

// OpenSearch client configuration
const client = new Client({
       node: 'http://opensearch.preprod.india.gov.in',
        auth: {
            username: 'admin',
            password: 'Opensearchnic321'
        }

    // node: 'http://192.168.122.37:9080',
    // auth: {
    //     username: 'admin',
    //     password: 'admin'
    // }

    // node: 'http://opensearch.prod.india.gov.in',
    // auth: {
    //     username: 'admin',
    //     password: 'Opensearchnic321'
    // }
});

(async () => {
    const indicesToClose = [
        // 'npiaudit_strapi',
        // 'npi_strapi_state_dists',
        // 'npi_strapi_services_suggestor',
        // 'npi_strapi_spotlights',
        // 'npi_strapi_landings_description',
        // 'npi_strapi_menu_datas',
        // 'npi_strapi_cbps_banners',
        // 'npi_strapi_owners',
        // 'npi_strapi_newsletters',
        // 'npi_strapi_extra_pages',
        // 'npi_strapi_discovering_bharats',
        // 'npi_strapi_home_images',
        // 'npi_s3waas_public_utility_banks',
        // 'npi_calender_holidays',
        // 'npi_award',
        // 'npi_ogd_catalogs',
        // 'npi_s3waas_public_utility_colleges',
        // 'npi_igod_category_index',
        // 'npi_ogd_ministry',
        // 'npi_my_gov_sectors',
        // 'npi_myscheme_search',
        // 'npi_s3waas_public_utility_municipalities',
        // 'npi_s3waas_district_list',
        // 'npi_s3waas_state_list',
        // 'npi_igod_countrylist',
        // 'npi_pib_news',
        'npi_s3waas_culinary_delights',
        // 'npi_s3waas_public_utility_ngos',
        // 'npi_mp_loksabha_member_position',
        // 'npi_s3waas_whos_who',
        // 'npi_s3waas_public_utility_hospitals',
        // 'npi_my_gov_groups',
        // 'npi_myscheme_ministry',
        // 'npi_mp_loksabhadocs_mpsno_all_member',
        'npi_s3waas_tourist_places',
        // 'npi_mp_rajyasabha',
        // 'npi_s3waas_public_utility_school',
        // 'npi_india_code_india_act_state',
        // 'npi_igod_list_web_directories',
        // 'npi_mp_rajyasabha_position',
        // 'npi_news_on_air',
        // 'npi_mp_loksabha_member',
        // 'npi_odop_index',
        'npi_my_gov_infographics',
        // 'npi_my_gov_node',
        // 'npi_neva_mla_mlc',
        // 'npi_s3waas_ecourt_judges',
        // 'npi_s3waas_india_produce',
        // 'npi_india_code_india_act',
        // 'npi_s3waas_public_utility_electricity',
        // 'npi_ogd_sector',
        // 'npi_pib_pib_ministry',
        // 'npi_igod_ug_ministries_departments',
        // 'npi_s3waas_public_utility_postals',
        // 'npi_mp_rajyasabha_member',
        'npi_s3waas_accommodation',
        // 'npi_dd_news_index',
        // 'npi_igod_list_organization_types',
        // 'npi_myscheme_category',
        // 'npi_myscheme_facet',
        // 'npi_s3waas_helpline',
        // 'npi_pib_gallery',
        // 'npi_myscheme_state',
        // 'npi_igod_list_all_states'
    ]; // Replace with your index names

    try {
        if (indicesToClose.length === 0) {
            console.log('No indices provided to close.');
            return;
        }

        console.log(`Closing indices:`, indicesToClose);

        // Close specified indices
        const { body } = await client.indices.close({ index: indicesToClose.join(',') });

        console.log('Indices closed successfully:', body);
    } catch (error) {
        console.error('Error closing indices:', error);
    }
})();
