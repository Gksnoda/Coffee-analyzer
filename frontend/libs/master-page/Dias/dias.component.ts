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
import { DoCheck } from '@angular/core';

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
  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  anos = [
    1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
  ];
  formas = ["Anualmente", "Mensalmente", "Diariamente"];

  labels = this.meses;
  mediaRealMensal: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data: number[] = [];


  // Input da forma de separação
  selectForma: string;
  onFormaSelect(event: any): void {
  }


  // Input de anos multiplos para media anual
  selectAnos : number[] = []
  anosAntigo : number[] = []
  onAnosSelect(event: any): void {

    let ultimoAno : any;
    let indexUltimo : number;
    let medias: any;

    // A função faz o seguinte: Pega todos os anos selecionados e coloca no labels de forma ordenada
    // pega o ultimo valor que o usuario selecionou no input e guarda
    // pega o index desse ultimo valor no labels (pois ele foi ordenado)
    // calcula a media daquele ano que o usuario selecionou

    this.labels = this.selectAnos.map(anos => anos.toString());
    ultimoAno = this.verificaUltimoValor(this.selectAnos, this.anosAntigo);
    indexUltimo = this.labels.indexOf(ultimoAno.valor.toString());
    medias = this.calcularMediaAnual(this.dias, ultimoAno.valor);
    
    // Depois ele verifica: O usuario está adicionando ou tirando um ano do grafico?
    if(ultimoAno.maior){
      this.data.splice(indexUltimo, 0, medias.mediaReal);
    } else {
      this.data.splice(indexUltimo, 1);
    }

    //att o grafico
    this.anosAntigo = this.selectAnos;
    console.log("log data no anos:", this.data);
    this.updateChart();
  }

  // Quando ele seleciona o ano la no input
  selectAno: number;
  onAnoSelect(event: any): void {
    let medias: any;
    if (this.selectAno !== undefined) {
      console.log('ano selecionado:', this.selectAno);
      for(let i = 0; i < 12; i++){
        medias = this.calcularMediaPorMes(this.dias, this.selectAno, i+1);
        this.mediaRealMensal[i] = medias.mediaReal;
        this.data = this.mediaRealMensal;
      }
    } else {
      this.data = [0]
    }
    this.updateChart();
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

  // Função para criar o grafico
  createChart(): void {
    // Inicialização do gráfico
    this.grafico = new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data, label: 'Reais'
          }
        ]
      }
    });
  }

  // Função para calcular a media do mes
  calcularMediaPorMes(dias: Dia[], selectAno: number, selectMes: number): 
  { mediaReal: number, mediaDolar: number } {

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
    // toFixed() é para fazer o limite de numeros decimais
    return {
    mediaReal: +mediaReal.toFixed(2),
    mediaDolar: +mediaDolar.toFixed(2)
    }
  }

  // Função para calcular a media Anual
  calcularMediaAnual(dias: Dia[], ano: number) : { mediaReal: number, mediaDolar: number } {
    let mediaReal: number = 0;
    let mediaDolar: number = 0;
    let medias 

    for(let i = 0; i < 12; i++){
      medias = this.calcularMediaPorMes(dias, ano, i+1);
      mediaReal += medias.mediaReal;
      mediaDolar += medias.mediaDolar;
    }
    mediaReal = mediaReal/12;
    mediaDolar = mediaDolar/12;

    return{
      mediaReal: +mediaReal.toFixed(2),
      mediaDolar: +mediaDolar.toFixed(2)
    }
  }

  // Função para atualizar o grafico
  updateChart(): void {
    // Atualizando dados do gráfico
    this.grafico.data.labels = this.labels;
    this.grafico.data.datasets[0].data = this.data;
  
    // Atualizando o gráfico
    this.grafico.update();
  }

  // Função para verificar a diferença entre dois vetores (maior para menor)
  // ele retorna o valor diferente e true se é do primeiro vetor, ou false se é do segundo
  verificaUltimoValor(A: number[], B: number[]): {valor: number, maior: boolean} {
    if (A.length > B.length) {
      return {valor: A.find(value => !B.includes(value)) || 0, maior: true}
    } else {
      return {valor: B.find(value => !A.includes(value)) || 0, maior: false}
    }
  }

}