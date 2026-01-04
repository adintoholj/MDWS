using Microsoft.AspNetCore.Mvc;
using Mobile_Devices_Web_Shop.Models;


namespace Mobile_Devices_Web_Shop.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        [HttpPost("checkout")]
        public IActionResult Checkout([FromQuery] int userId)
        {
            // 1. Uzmi korpu korisnika (ISPRAVNA LISTA)
            var cartItems = DataStore.CartItems
                .Where(c => c.UserId == userId)
                .ToList();

            if (!cartItems.Any())
                return BadRequest("Korpa je prazna");

            decimal total = 0;

            // 2. Izračun ukupne cijene
            foreach (var item in cartItems)
            {
                var product = DataStore.Products
                    .FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null)
                    return BadRequest("Proizvod ne postoji");

                total += product.Price * item.Quantity;
            }

            // 3. Kreiraj narudžbu
            var newOrder = new Order
            {
                Id = DataStore.Orders.Count + 1,
                UserId = userId,
                Total = total,
                Status = "paid"
            };

            DataStore.Orders.Add(newOrder);

            // 4. Očisti KORPU (ISPRAVNA LISTA)
            DataStore.CartItems.RemoveAll(c => c.UserId == userId);

            return Ok(newOrder);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(DataStore.Orders);
        }
    }
}
