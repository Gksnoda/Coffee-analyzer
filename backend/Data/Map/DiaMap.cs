using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Map
{
    public class DiaMap : IEntityTypeConfiguration<DiaModel>
    {
        public void Configure(EntityTypeBuilder<DiaModel> builder)
        {
            builder.HasKey(x => x.Data);
            builder.Property(x => x.ValorReal);
            builder.Property(x => x.ValorDolar);
        }
    }
}
