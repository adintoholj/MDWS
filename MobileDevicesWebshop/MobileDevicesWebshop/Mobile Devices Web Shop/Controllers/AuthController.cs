using Microsoft.AspNetCore.Mvc;


namespace Mobile_Devices_Web_Shop.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            user.Id = DataStore.Users.Count + 1;
            user.Role = "customer";
            DataStore.Users.Add(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = DataStore.Users.FirstOrDefault(u =>
                u.Email == request.Email &&
                u.PasswordHash == request.Password);

            if (user == null)
                return Unauthorized();

            return Ok(user);
        }
    }
}
