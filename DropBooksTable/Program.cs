using System;
using Npgsql;

class Program
{
	static void Main()
	{
		var connString = "Host=localhost;Port=5432;Database=scripta;Username=postgres;Password=StrongPass123";
		using var conn = new NpgsqlConnection(connString);
		conn.Open();
		using var cmd = new NpgsqlCommand("DROP TABLE IF EXISTS \"Books\" CASCADE;", conn);
		cmd.ExecuteNonQuery();
		Console.WriteLine("Table 'Books' dropped (if existed).");
	}
}
