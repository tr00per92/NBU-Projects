package Models;

public class School {
    private String name;
    private String email;
    private String town;
    private String address;

    public School(String name, String town, String address, String email) {
        this.setName(name);
        this.setTown(town);
        this.setAddress(address);
        this.setEmail(email);
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTown() {
        return this.town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
