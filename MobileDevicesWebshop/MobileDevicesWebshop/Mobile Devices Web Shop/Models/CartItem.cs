namespace Mobile_Devices_Web_Shop.Models
{
    public class CartItem
    {
        public int Id { get; set; }          // ⬅️ PRIMARY KEY
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
