package DbOperation.nic.in.npi.controller;

import DbOperation.nic.in.npi.service.IndexService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/indexes")
@Produces(MediaType.APPLICATION_JSON)
public class IndexController {

    @Inject
    IndexService indexService;

    @GET
    public List<String> getAllIndexes() {
        return indexService.getAllIndexes();
    }
}

