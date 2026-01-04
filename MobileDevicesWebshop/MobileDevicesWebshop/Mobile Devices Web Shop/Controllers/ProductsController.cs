using Microsoft.AspNetCore.Mvc;


namespace Mobile_Devices_Web_Shop.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(DataStore.Products);
        }

        // ⭐ OVO JE KRITIČNO ZA product.html
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = DataStore.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpGet("filter")]
        public IActionResult Filter(string brand)
        {
            var result = DataStore.Products
                .Where(p => string.IsNullOrEmpty(brand) || p.Brand == brand)
                .ToList();

            return Ok(result);
        }

        [HttpPost]
        public IActionResult Add(Product product)
        {
            product.Id = DataStore.Products.Count + 1;
            DataStore.Products.Add(product);
            return Ok(product);
        }
    }
}
