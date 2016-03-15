import javax.swing.table.AbstractTableModel;
import java.util.ArrayList;
import java.util.List;
import Models.School;

public class SchoolsTableModel extends AbstractTableModel {
    private String[] columns = new String[] { "Име", "Адрес", "Email" };
    private List<School> schools = new ArrayList<>();

    public void loadSchools(Iterable<School> schools) {
        this.schools.clear();
        schools.forEach(this.schools::add);
    }

    public int getRowCount() {
        return this.schools.size();
    }

    public int getColumnCount() {
        return this.columns.length;
    }

    public Object getValueAt(int rowIndex, int columnIndex) {
        if (rowIndex < 0 || rowIndex >= schools.size()) {
            throw new IndexOutOfBoundsException();
        }

        School school = this.schools.get(rowIndex);
        switch (columnIndex) {
            case 0:
                return school.getName();
            case 1:
                return school.getAddress();
            case 2:
                return school.getEmail();
            default:
                throw new IndexOutOfBoundsException();
        }
    }

    public String getColumnName(int column) {
        return this.columns[column];
    }
}
