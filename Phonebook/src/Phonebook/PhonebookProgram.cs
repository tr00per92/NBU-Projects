namespace Phonebook
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Data;
    using Engine;

    public static class PhonebookProgram
    {
        private const string InvalidCommand = "Invalid command. To see available commands type 'help'.";
        private static readonly string help;
        private static readonly IPhonebookEngine engine;

        static PhonebookProgram()
        {
            help = File.ReadAllText("help.txt");
            engine = InitializeEngine();
        }

        public static void Main()
        {
            Console.WriteLine("Welcome to phonebook. You can type your commands now.");
            string input;
            while (!string.Equals(input = Console.ReadLine(), "EXIT", StringComparison.OrdinalIgnoreCase))
            {
                if (input != null)
                {
                    var splitInput = input.Split();
                    var command = splitInput.First();
                    var commandParameters = splitInput.Skip(1).Where(x => !string.IsNullOrWhiteSpace(x)).ToList();
                    var commandResult = ProcessCommand(command, commandParameters);
                    Console.WriteLine(commandResult + Environment.NewLine);
                }
            }
        }

        private static string ProcessCommand(string command, IList<string> commandParameters)
        {
            try
            {
                switch (command.ToUpper())
                {
                    case "LOGIN":
                        return engine.Login(commandParameters.Single(), ReadPassword());
                    case "LOGOUT":
                        return engine.Logout();
                    case "REGISTER":
                        return engine.Register(commandParameters.Single(), ReadPassword());
                    case "INSERT":
                        if (commandParameters.Count != 2)
                        {
                            return InvalidCommand;
                        }

                        return engine.InsertPhone(commandParameters[0], commandParameters[1]);
                    case "DELETE":
                        return engine.DeletePhone(commandParameters.Single());
                    case "LIST":
                        return engine.ListPhones();
                    case "FIND":
                        return engine.ListPhones(commandParameters.Single());
                    case "HELP":
                        return help;
                    default:
                        return InvalidCommand;
                }
            }
            catch (InvalidOperationException)
            {
                return InvalidCommand;
            }
            catch (UnauthorizedAccessException)
            {
                return "This command is available for logged in users only.";
            }
        }

        private static string ReadPassword()
        {
            var password = string.Empty;
            Console.Write("Enter password: ");
            ConsoleKeyInfo keyInfo;
            while ((keyInfo = Console.ReadKey(true)).Key != ConsoleKey.Enter)
            {
                if (keyInfo.Key != ConsoleKey.Backspace)
                {
                    password += keyInfo.KeyChar;
                    Console.Write("*");
                }
                else if (password.Length > 0)
                {
                    password = password.Remove(password.Length - 1);
                    Console.Write("\b \b");
                }
            }

            Console.WriteLine();
            return password;
        }

        private static IPhonebookEngine InitializeEngine()
        {
             return new PhonebookEngine(new PhonebookDbContext());
        }
    }
}
