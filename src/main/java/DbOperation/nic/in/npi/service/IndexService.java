package DbOperation.nic.in.npi.service;

import java.util.List;

import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch.indices.GetIndexRequest;
import org.opensearch.client.opensearch.indices.GetIndexResponse;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;



@ApplicationScoped
public class IndexService {

    @Inject
    OpenSearchClient openSearchClient;
    public List<String> getAllIndexes() {
        try {

            GetIndexRequest request = new GetIndexRequest.Builder().index("*").build();


            GetIndexResponse response = openSearchClient.indices().get(request);

            return response.result().keySet().stream().toList();
            
        } catch (Exception e) {
            throw new RuntimeException("Error fetching indexes", e);
        }
    }
}