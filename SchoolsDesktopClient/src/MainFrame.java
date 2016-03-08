import javax.swing.*;
import java.awt.*;
import DataProviders.IDataProvider;

public class MainFrame extends JFrame {
    private final static String TOWNS = "Towns";
    private final static String SCHOOLS = "Schools";

    public MainFrame(IDataProvider dataProvider) {
        this.setSize(800, 600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setLocationRelativeTo(null);
        this.setTitle("Bulgarian Schools");
        this.initializePanels(dataProvider);
        this.setVisible(true);
    }

    private void initializePanels(IDataProvider dataProvider) {
        SchoolsPanel schoolsPanel = new SchoolsPanel(dataProvider);
        JPanel townsPanel = new JPanel(new GridLayout(0, 1, 0, 10));
        townsPanel.setBorder(BorderFactory.createEmptyBorder(150, 200, 150, 200));

        CardLayout mainPanelLayout = new CardLayout();
        JPanel mainPanel = new JPanel(mainPanelLayout);
        mainPanel.add(townsPanel, TOWNS);
        mainPanel.add(schoolsPanel, SCHOOLS);

        JButton backButton = new JButton("Назад");
        backButton.addActionListener(e -> mainPanelLayout.show(mainPanel, TOWNS));
        schoolsPanel.getButtonsPanel().add(backButton);

        for (String town : dataProvider.getTowns()) {
            JButton townButton = new JButton(town);
            townButton.addActionListener(e -> {
                schoolsPanel.setSelectedTown(e.getActionCommand());
                mainPanelLayout.show(mainPanel, SCHOOLS);
            });

            townsPanel.add(townButton);
        }

        this.add(mainPanel);
    }
}
