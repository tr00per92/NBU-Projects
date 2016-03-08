import javax.swing.*;
import java.awt.*;
import DataProviders.IDataProvider;
import Models.School;

public class SchoolsPanel extends JPanel {
    private IDataProvider dataProvider;
    private String selectedTown;
    private SchoolsTableModel tableModel = new SchoolsTableModel();
    private JPanel buttonsPanel = new JPanel();

    public SchoolsPanel(IDataProvider dataProvider) {
        this.dataProvider = dataProvider;
        this.setLayout(new BoxLayout(this, BoxLayout.PAGE_AXIS));
        this.initializeTable();
        this.initializeAddSchoolBtn();
        this.add(this.buttonsPanel);
    }

    public JPanel getButtonsPanel() {
        return this.buttonsPanel;
    }

    public void setSelectedTown(String selectedTown) {
        if (!selectedTown.equals(this.selectedTown)) {
            this.selectedTown = selectedTown;
            this.tableModel.loadSchools(this.dataProvider.getSchools(this.selectedTown));
        }
    }

    private void initializeAddSchoolBtn() {
        JTextField nameField = new JTextField();
        JTextField addressField = new JTextField();
        JTextField emailField = new JTextField();

        JPanel addSchoolPanel = new JPanel(new GridLayout(0, 1));
        addSchoolPanel.add(new JLabel("Име:"));
        addSchoolPanel.add(nameField);
        addSchoolPanel.add(new JLabel("Адрес:"));
        addSchoolPanel.add(addressField);
        addSchoolPanel.add(new JLabel("Email:"));
        addSchoolPanel.add(emailField);

        String addSchoolTitle = "Данни за ново училище";
        JButton addSchoolBtn = new JButton("Добави училище");
        addSchoolBtn.addActionListener(e -> {
            int option = JOptionPane.showConfirmDialog(this, addSchoolPanel, addSchoolTitle, JOptionPane.OK_CANCEL_OPTION);
            if (option == JOptionPane.OK_OPTION) {
                School school = new School(nameField.getText(), this.selectedTown, addressField.getText(), emailField.getText());
                this.dataProvider.addSchool(school);
                this.tableModel.loadSchools(this.dataProvider.getSchools(this.selectedTown));
            }
        });

        this.buttonsPanel.add(addSchoolBtn);
    }

    private void initializeTable() {
        JTable table = new JTable(this.tableModel);
        table.getTableHeader().setResizingAllowed(true);
        this.add(new JScrollPane(table));
    }
}
