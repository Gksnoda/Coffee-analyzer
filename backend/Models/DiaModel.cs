using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class DiaModel
    {
        public DateOnly Data { get; set; }

        public decimal ValorReal {get; set;}

        public decimal ValorDolar {get; set;}
    }
}