package DataProviders;

import java.util.Arrays;
import java.util.LinkedList;
import Models.School;

public class TestDataProvider implements IDataProvider {
    private LinkedList<School> schools = new LinkedList<>();

    public TestDataProvider() {
        this.schools.add(new School(
            "36 Средно Общообразователно Училище „Максим Горки“",
            "София",
            "жк Дървеница, Община Столична",
            "test@test.bg"));

        this.schools.add(new School(
            "44 Средно Общообразователно Училище „Неофит Бозвели“",
            "София",
            "жк Сухата река, Община Столична",
            "test@test.bg"));
    }

    public Iterable<String> getTowns() {
        return Arrays.asList("София", "Пловдив", "Варна", "Бургас", "Стара загора", "Русе");
    }

    public Iterable<School> getSchools(String town) {
        return this.schools;
    }

    public void addSchool(School school) {
        this.schools.add(school);
    }
}
