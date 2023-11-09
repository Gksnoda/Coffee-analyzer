import { CommonModule } from '@angular/common';
import { Dia } from './Dia';
import { DiasService } from './dias.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-dias',
  templateUrl: './dias.component.html',
  styleUrls: ['./dias.component.css'],
  imports: [CommonModule,
    NgChartsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatSelectModule,
  ]
})


export class DiasComponent implements OnInit {

  // Criando o modelo
  dias: Dia[];

  // Constructor
  constructor(private diasService: DiasService) {}

  // Filhos do html
  @ViewChild("myChart", {static: true}) elemento: ElementRef;


  // Variaveis
  grafico : Chart;
  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", 
  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

  anos = [
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
  ];

  labels = this.meses;
  data = [50];
  // mediaReal : number = 0;
  // mediaDolar : number = 0;
  medias: any;
  mediaRealAnual: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Quando ele seleciona o ano la no input
  selectAno: number;
  onAnoSelect(event: any): void {
    if (this.selectAno !== undefined) {
      console.log('ano selecionado:', this.selectAno);
      for(let i = 0; i < 12; i++){
        this.medias = this.calcularMediaPorMes(this.dias, this.selectAno, i);
        this.mediaRealAnual[i] = this.medias.mediaReal;
        this.data = this.mediaRealAnual;
      }
      this.updateChart();
    }
  }

  // Quando ele seleciona o mes la no input
  selectMes: string;
  mesNumero: number;
  onMesSelect(event: any): void {
    this.mesNumero = this.MesParaNumero[this.selectMes]
    if (this.mesNumero !== undefined) {
      console.log('mes correspondente:', this.mesNumero);
      this.calcularMediaPorMes(this.dias, this.selectAno, this.mesNumero);
    }
  }

  // map do mes
  MesParaNumero: { [key: string]: number } = {
    'Janeiro': 1,
    'Fevereiro': 2,
    'Março': 3,
    'Abril': 4,
    'Maio': 5,
    'Junho': 6,
    'Julho': 7,
    'Agosto': 8,
    'Setembro': 9,
    'Outubro': 10,
    'Novembro': 11,
    'Dezembro': 12,
  };

  // Função que chama quando inicia o componente
  ngOnInit(): void {

    //Criando o grafico
    this.createChart();

    // Pegando o model do serviço
    this.diasService.PegarTodos().subscribe(resultado => {
      this.dias = resultado;
    });
  }

  createChart(): void {
    // Inicialização do gráfico
    this.grafico = new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data
          }
        ]
      }
    });
  }

  calcularMediaPorMes(dias: Dia[], selectAno: number, selectMes: number): { mediaReal: number, mediaDolar: number } {
    //filtrando as datas para o mes espefico
    const datasFiltradas = dias.filter((teste) => {
      const data = new Date(teste.data); // Convertendo a string para o tipo Date
      return data.getFullYear() === selectAno && data.getUTCMonth() + 1 === selectMes;
    });

    let mediaReal = 0;
    let mediaDolar = 0;

    //adicionando na variavel e fazendo a media
    for(let i = 0; i < datasFiltradas.length; i++){
      mediaReal += datasFiltradas[i].valorReal;
      mediaDolar += datasFiltradas[i].valorDolar;
    }
    mediaReal = mediaReal/datasFiltradas.length;
    mediaDolar = mediaDolar/datasFiltradas.length;
    console.log("função:", mediaReal);

    // toFixed() retorna uma string, ai o + transforma em number
    return {
    mediaReal: +mediaReal.toFixed(2),
    mediaDolar: +mediaDolar.toFixed(2)
    }
  }


  updateChart(): void {
    // Atualizando dados do gráfico
    this.grafico.data.labels = this.labels;
    this.grafico.data.datasets[0].data = this.data;
  
    // Atualizando o gráfico
    this.grafico.update();
  }

}