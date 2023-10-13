using backend.Models;

namespace backend.View.Interface
{
    public interface IDias
    {
        Task<List<DiaModel>> BuscarTodosDias();

        Task<List<DiaModel>> BuscarPrimeiros();
    }
}
