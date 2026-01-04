using Mobile_Devices_Web_Shop.Models; // Ensure the correct namespace for 'Order'

public static class DataStore
{
    public static List<Product> Products = new();
    public static List<CartItem> CartItems = new();
    public static List<Order> Orders = new();
    public static List<User> Users = new();
}