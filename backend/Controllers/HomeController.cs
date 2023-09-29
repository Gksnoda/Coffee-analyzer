using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
//using backend.Models;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return Content("Backend deu certo!!");
        }
    }
}