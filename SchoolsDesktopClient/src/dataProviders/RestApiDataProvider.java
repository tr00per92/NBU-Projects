package dataProviders;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.LinkedList;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.json.JSONArray;
import org.json.JSONObject;
import models.School;

public class RestApiDataProvider implements IDataProvider {
    private static final String API_URL = "http://bg-schools-api.herokuapp.com/api/";

    public Iterable<String> getTowns() {
        LinkedList<String> result = new LinkedList<>();
        try {
            String json = Request.Get(API_URL + "Towns").execute().returnContent().asString();
            JSONArray towns = new JSONArray(json);
            towns.forEach(town -> result.add(town.toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    public Iterable<School> getSchools(String town) {
        LinkedList<School> result = new LinkedList<>();
        try {
            String url = API_URL + "Schools/" + URLEncoder.encode(town, "UTF-8").replace("+", "%20");
            String json = Request.Get(url).execute().returnContent().asString();
            JSONArray schools = new JSONArray(json);
            for (int i = 0; i < schools.length(); i++) {
                JSONObject schoolJson = schools.getJSONObject(i);
                result.add(new School(
                    schoolJson.optString("Name"),
                    schoolJson.optString("Town"),
                    schoolJson.optString("Address"),
                    schoolJson.optString("Email")));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    public void addSchool(School school) {
        JSONObject schoolJson = new JSONObject();
        schoolJson.put("Name", school.getName());
        schoolJson.put("Town", school.getTown());
        schoolJson.put("Address", school.getAddress());
        schoolJson.put("Email", school.getEmail());
        try {
            Request.Post(API_URL + "Schools/Add").bodyString(schoolJson.toString(), ContentType.APPLICATION_JSON).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
