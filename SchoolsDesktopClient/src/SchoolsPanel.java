import javax.swing.*;
import java.awt.*;
import dataProviders.IDataProvider;
import models.School;

public class SchoolsPanel extends JPanel {
    private IDataProvider dataProvider;
    private String selectedTown;
    private JTable schoolsTable;
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
            this.schoolsTable.setVisible(false);

            new SwingWorker<Iterable<School>, Void>() {
                protected Iterable<School> doInBackground() {
                    return dataProvider.getSchools(selectedTown);
                }

                protected void done() {
                    try {
                        tableModel.loadSchools(this.get());
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        schoolsTable.setVisible(true);
                    }
                }
            }.execute();
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
                new SwingWorker<Iterable<School>, Void>() {
                    protected Iterable<School> doInBackground() {
                        School school = new School(nameField.getText(), selectedTown, addressField.getText(), emailField.getText());
                        dataProvider.addSchool(school);
                        return dataProvider.getSchools(selectedTown);
                    }

                    protected void done() {
                        try {
                            tableModel.loadSchools(this.get());
                            schoolsTable.updateUI();
                        } catch (Exception e) {
                            e.printStackTrace();
                        } finally {
                            nameField.setText("");
                            addressField.setText("");
                            emailField.setText("");
                        }
                    }
                }.execute();
            }
        });

        this.buttonsPanel.add(addSchoolBtn);
    }

    private void initializeTable() {
        this.schoolsTable = new JTable(this.tableModel);
        this.schoolsTable.getTableHeader().setResizingAllowed(true);
        this.add(new JScrollPane(this.schoolsTable));
    }
}
