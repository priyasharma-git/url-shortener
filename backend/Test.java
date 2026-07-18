import java.sql.Connection;
import java.sql.DriverManager;

public class Test {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://localhost:5432/url_shortener";
        Connection c = DriverManager.getConnection(url, "postgres", "postgres");
        System.out.println("Connected!");
        c.close();
    }
}