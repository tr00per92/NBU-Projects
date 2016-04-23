namespace Phonebook.Engine
{
    public interface IPhonebookEngine
    {
        string Register(string username, string password);

        string Login(string username, string password);

        string Logout();

        string InsertPhone(string name, string number);

        string DeletePhone(string name);

        string ListPhones(string searchText = null);
    }
}
