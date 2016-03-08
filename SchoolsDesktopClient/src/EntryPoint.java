import DataProviders.*;

public class EntryPoint {
    public static void main(String[] args) {
        //IDataProvider dataProvider = new TestDataProvider();
        IDataProvider dataProvider = new RestApiDataProvider();
        new MainFrame(dataProvider);
    }
}
