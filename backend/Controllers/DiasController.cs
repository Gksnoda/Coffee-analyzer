using backend.Models;
using backend.View.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiasController : ControllerBase
    {
        private readonly IDias _diasInter;
        public DiasController(IDias diasInter)
        {
            _diasInter = diasInter;
        }

        [HttpGet]
        public async Task<ActionResult<List<DiaModel>>> BuscarTodosDias() 
        {
            List<DiaModel> dias = await _diasInter.BuscarTodosDias();
            return Ok(dias);
        }

        [HttpGet("primeiros")]
        public async Task<ActionResult<List<DiaModel>>> BuscarPrimeiros()
        {
            List<DiaModel> dias = await _diasInter.BuscarPrimeiros();
            return Ok(dias);
        }
    }
}
