package DbOperation.nic.in.npi.config;

// package in.nic.npi.client_config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.opensearch.client.RestClient;
import org.opensearch.client.json.jackson.JacksonJsonpMapper;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.rest_client.RestClientTransport;

import io.quarkus.arc.properties.IfBuildProperty;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Named;

public class OpensearchConfig {

    @ConfigProperty(name = "OPENSEARCH_PORT")
    private int port;

    @ConfigProperty(name = "OPENSEARCH_HOST")
    private String hostName;

    @ConfigProperty(name = "OPENSEARCH_USERNAME")
    private String userName;

    @ConfigProperty(name = "OPENSEARCH_PASSWORD")
    private String password;

    @Produces
    @Named("osClient")
    @IfBuildProperty(name = "SEARCH_DB", stringValue = "opensearch")
    public OpenSearchClient createOpensearchClient() {

        BasicCredentialsProvider credsProv = new BasicCredentialsProvider();
        credsProv.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(userName, password));

        RestClient restClient = RestClient
                .builder(new HttpHost(hostName, port))
                .setHttpClientConfigCallback(hc -> hc
                        .setDefaultCredentialsProvider(credsProv))
                .build();

        OpenSearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

        return new OpenSearchClient(transport);

    }

}
