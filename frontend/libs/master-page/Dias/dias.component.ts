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

    // Função que chama quando inicia o componente
    ngOnInit(): void {

      //Criando o grafico
      this.createChart();
  
      // Pegando o model do serviço
      this.diasService.PegarTodos().subscribe(resultado => {
        this.dias = resultado;
      });
    }

  // Filhos do html
  @ViewChild("myChart", {static: true}) elemento: ElementRef;


  // Variaveis
  grafico : Chart;
  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", 
  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  anos = [
    1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 
    2016, 2017, 2018, 2019, 2020, 2021, 2022
  ];
  formas = ["Anualmente", "Mensalmente", "Diariamente"];

  labels: string[] = [];
  mediaRealMensal: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data: number[] = [];


  // Input da forma de separação
  selectForma: string;
  onFormaSelect(event: any): void {
    if(this.selectForma == 'Anualmente'){
      this.grafico.destroy();
      this.createChart();
    }else if(this.selectForma === 'Mensalmente'){
      this.grafico.destroy();
      this.createChart();
    }else if(this.selectForma === 'Diariamente'){
      this.grafico.destroy();
      this.createChart();
    }
  }


  // Input de anos multiplos para media anual
  selectAnos : number[] = [];
  anosAntigo : number[] = [];
  dataReal: number[]= [];
  dataDolar: number []= [];
  onAnosSelect(event: any): void {

    let ultimoAno : any;
    let medias: any;
    
    // A função faz o seguinte: Pega todos os anos selecionados e coloca no labels de forma ordenada
    // pega o ultimo valor que o usuario selecionou no input e guarda
    // pega o index desse ultimo valor no labels (pois ele foi ordenado)
    // calcula a media daquele ano que o usuario selecionou

    this.labels = this.selectAnos.map(anos => anos.toString());
    ultimoAno = this.verificaUltimoValor(this.selectAnos, this.anosAntigo);
    medias = this.calcularMediaAnual(this.dias, ultimoAno.valor);

    
    // Depois ele verifica: O usuario está adicionando ou tirando um ano do grafico?
    // Se está tirando, ele coloca no data, senão, tira
    if(ultimoAno.add){
      this.dataReal.splice(this.labels.indexOf(ultimoAno.valor.toString()), 0, medias.mediaReal);
      this.dataDolar.splice(this.labels.indexOf(ultimoAno.valor.toString()), 0, medias.mediaDolar);
    } else {
      this.dataReal.splice(this.anosAntigo.indexOf(ultimoAno.valor), 1);
      this.dataDolar.splice(this.anosAntigo.indexOf(ultimoAno.valor), 1);
    }

    //att o grafico
    this.anosAntigo = this.selectAnos;
    this.atualizarGrafico(this.dataReal, this.dataDolar);
  }


  // Quando ele seleciona o ano la no input
  selectAno: number;
  onAnoSelect(event: any): void {

  }

  //Seleção de mes no mensal
  selectMeses: string[] = [];
  mesesAntigo: string[] = [];
  onMensalSelect(event: any): void {

    let ultimoMes : any;
    let medias: any;
    let mesNum : number;

    this.labels = this.selectMeses;
    ultimoMes = this.verificaUltimoValor(this.selectMeses, this.mesesAntigo);
    mesNum = this.MesParaNumero[ultimoMes.valor];
    medias = this.calcularMediaPorMes(this.dias, this.selectAno, mesNum);

    if(ultimoMes.add){
      this.dataReal.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.mediaReal);
      this.dataDolar.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.mediaDolar);
    } else {
      this.dataReal.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
      this.dataDolar.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
    }

    console.log("Real:", this.dataReal);
    console.log("Dolar:", this.dataDolar);

    this.mesesAntigo = this.selectMeses;
    this.atualizarGrafico(this.dataReal, this.dataDolar);
  }


  // Quando ele seleciona o mes la no input
  selectMes: string;
  mesNumero: number;
  onMesSelect(event: any): void {
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


  // Função para criar o grafico
  createChart(): void {
    // Inicialização do gráfico
    this.grafico = new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      }
    });
  }


  atualizarGrafico(dataBarras: number[], dataLinhas: number[]): void {
    // Atualiza os dados no gráfico
    this.grafico.data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Valor Real',
          data: dataBarras,
          type: 'bar', // Configura o tipo para barra
          backgroundColor: 'rgba(50, 227, 65, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Valor Dólar',
          data: dataLinhas,
          type: 'bar', // Configura o tipo para barra
          backgroundColor: 'rgba(222, 185, 40, 0.7)',
          borderColor: 'rgba(222, 185, 40, 0.7)',
          borderWidth: 1,
        }
      ]
    };
  
    // Atualiza o gráfico
    this.grafico.update();
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
    // console.log("função:", mediaReal);

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



  // Função para verificar a diferença entre dois vetores (maior para menor)
  // ele retorna o valor diferente e true se é do primeiro vetor, ou false se é do segundo
  verificaUltimoValor(A: any[], B: any[]): {valor: any, add: boolean} {
    if (A.length > B.length) {
      return {valor: A.find(value => !B.includes(value)) || 0, add: true}
    } else {
      return {valor: B.find(value => !A.includes(value)) || 0, add: false}
    }
  }

}