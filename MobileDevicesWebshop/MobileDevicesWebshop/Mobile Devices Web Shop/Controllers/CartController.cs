using Microsoft.AspNetCore.Mvc;
using Mobile_Devices_Web_Shop.Models;


namespace Mobile_Devices_Web_Shop.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult Add(CartItem item)
        {
            DataStore.CartItems.Add(item);
            return Ok(item);
        }

        [HttpGet("{userId}")]
        public IActionResult Get(int userId)
        {
            var items = DataStore.CartItems
                .Where(c => c.UserId == userId)
                .ToList();

            return Ok(items);
        }

        [HttpDelete("clear/{userId}")]
        public IActionResult Clear(int userId)
        {
            DataStore.CartItems.RemoveAll(c => c.UserId == userId);
            return Ok();
        }
    }
}
