namespace Mobile_Devices_Web_Shop.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
    }
}
