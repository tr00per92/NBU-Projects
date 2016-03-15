package dataProviders;

import models.School;

public interface IDataProvider {
    Iterable<String> getTowns();

    Iterable<School> getSchools(String town);

    void addSchool(School school);
}
