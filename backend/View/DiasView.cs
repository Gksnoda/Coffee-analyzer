using backend.Data;
using backend.Models;
using backend.View.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.View
{
    public class DiasView : IDias
    {
        private readonly DataContext _dbContext;
        public DiasView(DataContext DataContext)
        {
            _dbContext = DataContext;
        }

        public async Task<List<DiaModel>> BuscarTodosDias()
        {
            return await _dbContext.Dias.ToListAsync();
        }

        public async Task<List<DiaModel>> BuscarPrimeiros()
        {
            return await _dbContext.Dias.Take(10).ToListAsync();
        }

    }
}
