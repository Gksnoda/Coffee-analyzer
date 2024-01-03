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
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


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
    MatCheckboxModule,
    MatButtonToggleModule,
  ]
})


export class DiasComponent implements OnInit {

  // Criando o modelo
  dias: Dia[];

  // Constructor
  constructor(private diasService: DiasService) {}

    // Função que chama quando inicia o componente
  ngOnInit(): void {

    const canvas: HTMLCanvasElement = this.elemento.nativeElement;
    canvas.width = 1000;
    canvas.height = 600;
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
  diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  labels: string[] = [];
  data: number[] = [];
  medianaOn: boolean = false;
  medianaReal: number[] = [];
  medianaDolar: number[] = [];

  // Input da forma de separação
  selectForma: string;
  onFormaSelect(event: any): void {
      this.grafico.destroy();
      this.createChart();
      this.resetaVariaveis();
      if (this.selectForma === "Diariamente"){
        console.log("Entrou no diar");
        this.diario(this.dias);
        this.atualizarGrafico(this.dataReal, this.dataDolar);
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
    medias = this.calcularValoresAnual(this.dias, ultimoAno.valor);
    // Depois ele verifica: O usuario está adicionando ou tirando um ano do grafico?
    // Se está tirando, ele coloca no data, senão, tira
    // Ele vai verificar qual é o index daquele ano que eu quero na lista "labels", pois
    // na lista labels ja está ordenadado por causa do selectAnos
    // splice: onde, quantos eu devo remover, qual valor
    if(ultimoAno.add){
      this.dataReal.splice(this.labels.indexOf(ultimoAno.valor.toString()), 0, medias.mediaReal);
      this.dataDolar.splice(this.labels.indexOf(ultimoAno.valor.toString()), 0, medias.mediaDolar);
      this.medianaReal.splice(this.labels.indexOf(ultimoAno.valor), 0, medias.medianaReal);
      this.medianaDolar.splice(this.labels.indexOf(ultimoAno.valor), 0, medias.medianaDolar);
    } else {
      this.dataReal.splice(this.anosAntigo.indexOf(ultimoAno.valor), 1);
      this.dataDolar.splice(this.anosAntigo.indexOf(ultimoAno.valor), 1);
      this.medianaReal.splice(this.mesesAntigo.indexOf(ultimoAno.valor), 1);
      this.medianaDolar.splice(this.mesesAntigo.indexOf(ultimoAno.valor), 1);
    }

    //att o grafico
    this.anosAntigo = this.selectAnos;
    if(this.medianaOn == true){
      this.atualizarGrafico(this.medianaReal, this.medianaDolar);
    }
    else{
      this.atualizarGrafico(this.dataReal, this.dataDolar);
    }
  }

  // Quando ele seleciona o ano la no input
  selectAno: number;
  cbMensal: boolean = false;
  onAnoSelect(event: any): void {
    if(this.cbMensal){
      this.onCheckboxChangeMensal(0);
    }

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
    medias = this.calcularValoresPorMes(this.dias, this.selectAno, mesNum);
    console.log(medias)


    if(ultimoMes.add){
      this.dataReal.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.mediaReal);
      this.dataDolar.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.mediaDolar);
      this.medianaReal.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.medianaReal);
      this.medianaDolar.splice(this.labels.indexOf(ultimoMes.valor), 0, medias.medianaDolar);
    } else {
      this.dataReal.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
      this.dataDolar.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
      this.medianaReal.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
      this.medianaDolar.splice(this.mesesAntigo.indexOf(ultimoMes.valor), 1);
    }

    this.mesesAntigo = this.selectMeses;
    if(this.medianaOn == true){
      this.atualizarGrafico(this.medianaReal, this.medianaDolar);
    }
    else{
      this.atualizarGrafico(this.dataReal, this.dataDolar);
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
  calcularValoresPorMes(dias: Dia[], selectAno: number, selectMes: number): 
  { mediaReal: number, mediaDolar: number , medianaReal: number, medianaDolar: number} {

    //filtrando as datas para o mes espefico
    const datasFiltradas = dias.filter((teste) => {
      const data = new Date(teste.data); // Convertendo a string para o tipo Date
      return data.getFullYear() === selectAno && data.getUTCMonth() + 1 === selectMes;
    });

    let mediaReal = 0;
    let mediaDolar = 0;
    let medianaReal = 0;
    let medianaDolar = 0
    let listaMedianaReal: number[] = [];
    let listaMedianaDolar: number[] = [];

    //adicionando na variavel e fazendo a media
    for(let i = 0; i < datasFiltradas.length; i++){
      listaMedianaReal = [...listaMedianaReal, datasFiltradas[i].valorReal]
      listaMedianaDolar = [...listaMedianaDolar, datasFiltradas[i].valorDolar]
      mediaReal += datasFiltradas[i].valorReal;
      mediaDolar += datasFiltradas[i].valorDolar;
    }
    
    mediaReal = mediaReal/datasFiltradas.length;
    mediaDolar = mediaDolar/datasFiltradas.length;
    
    medianaReal = this.calcularMediana(listaMedianaReal);
    medianaDolar = this.calcularMediana(listaMedianaDolar);
    
    // toFixed() retorna uma string, ai o + transforma em number
    // toFixed() é para fazer o limite de numeros decimais
    return {
    mediaReal: +mediaReal.toFixed(2),
    mediaDolar: +mediaDolar.toFixed(2),
    medianaReal: +medianaReal.toFixed(2),
    medianaDolar: +medianaDolar.toFixed(2),
    }
  }

  // Função para calcular a media Anual
  calcularValoresAnual(dias: Dia[], ano: number) : 
  { mediaReal: number, mediaDolar: number, medianaReal: number, medianaDolar: number} {
    let mediaReal: number = 0;
    let mediaDolar: number = 0;
    let medianaReal = 0;
    let medianaDolar = 0
    let listaMedianaReal: number[] = [];
    let listaMedianaDolar: number[] = [];
    let medias;

    for(let i = 0; i < 12; i++){
      medias = this.calcularValoresPorMes(dias, ano, i+1);

      listaMedianaReal = [...listaMedianaReal, medias.medianaReal]
      listaMedianaDolar = [...listaMedianaDolar, medias.medianaDolar]
      mediaReal += medias.mediaReal;
      mediaDolar += medias.mediaDolar;
    }

    medianaReal = this.calcularMediana(listaMedianaReal);
    medianaDolar = this.calcularMediana(listaMedianaDolar);
    mediaReal = mediaReal/12;
    mediaDolar = mediaDolar/12;

    return{
      mediaReal: +mediaReal.toFixed(2),
      mediaDolar: +mediaDolar.toFixed(2),
      medianaReal: +medianaReal.toFixed(2),
      medianaDolar: +medianaDolar.toFixed(2),
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


  // Função para resetar as variaveis
  resetaVariaveis() {
    this.selectAnos = [];
    this.anosAntigo = [];
    this.dataReal = [];
    this.dataDolar = [];
    this.labels  = [];
    this.data = [];
    this.selectMeses = [];
    this.mesesAntigo = [];
    this.selectAno = 0;
  }

  // Função para calcular a media dos dias da semana
  diario(dias: Dia[]) {
    const resultado: { [key: string]: { valorReal: number, valorDolar: number , qntd: number} } = {};
    this.labels = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    // Itera sobre os dias
    dias.forEach((dia) => {
      const data = new Date(dia.data);
      const diaNum = data.getUTCDay();
      const diaDaSemana = this.obterNomeDia(diaNum);

      // Adiciona os valores ao resultado
      if (!resultado[diaDaSemana]) {
        resultado[diaDaSemana] = { valorReal: 0, valorDolar: 0 , qntd: 0};
      }

      resultado[diaDaSemana].valorReal += dia.valorReal;
      resultado[diaDaSemana].valorDolar += dia.valorDolar;
      resultado[diaDaSemana].qntd += 1;
    });

    Object.keys(resultado).forEach((diaDaSemana)=>{
      resultado[diaDaSemana].valorReal /= resultado[diaDaSemana].qntd;
      resultado[diaDaSemana].valorDolar /= resultado[diaDaSemana].qntd;
    });

    this.labels.forEach((dia)=> {
      console.log(dia)
      this.dataReal.push(resultado[dia].valorReal);
      this.dataDolar.push(resultado[dia].valorDolar);
    });
  }

  // Função auxiliar para obter o nome do dia da semana
  obterNomeDia(diaDaSemana: number): string {
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return diasDaSemana[diaDaSemana];
  }
    

  // Função do checkbox do Anual
  onCheckboxChangeAnual(event: any) {
    if (event.checked) {
      this.selectAnos = [];
      this.anosAntigo = [];
      for(let i = 1997; i <= 2022; i++){
        this.selectAnos = [...this.selectAnos, i]
        this.onAnosSelect(0);
      }
    } else{
      this.resetaVariaveis();
      this.grafico.destroy();
      this.createChart();
    }
  }

    // Função do checkbox do Mensal
  onCheckboxChangeMensal(event: any) {
    this.selectMeses = [];
    this.mesesAntigo = [];
    if (event.checked || event.checked == undefined) {
      this.cbMensal = true;
    } else {
      this.cbMensal = false;
    }

    if (this.cbMensal) {
      console.log('entrou no check');
      for (let i = 0; i < this.meses.length; i++) {
        this.selectMeses = [...this.selectMeses, this.meses[i]]
        this.onMensalSelect(0);
      }
      this.cbMensal = true;
    } else {
      this.grafico.destroy();
      this.createChart();
      this.cbMensal = false;
    }
  }


  onTipoChange(event: any) {
    if (event.value === 'mediana') {
      console.log('Mediana selecionada');
      this.medianaOn = true;
      this.atualizarGrafico(this.medianaReal, this.medianaDolar);
    } else {
      console.log('Média selecionada');
      this.medianaOn = false;
      this.atualizarGrafico(this.dataReal, this.dataDolar);
    }
  }


  // onCheckboxMediana(eveny: any){
  //   this.medianaOn = true;
  //   this.atualizarGrafico(this.medianaReal, this.medianaDolar);
  // }

  calcularMediana(vetor: number[]): number {
    // Ordene o vetor
    vetor.sort((a, b) => a - b);
  
    const tamanho = vetor.length;
  
    // Verifique se o tamanho do vetor é ímpar ou par
    if (tamanho % 2 === 1) {
      // Se for ímpar, retorne o elemento do meio
      return vetor[Math.floor(tamanho / 2)];
    } else {
      // Se for par, retorne a média dos dois elementos do meio
      const meio1 = tamanho / 2 - 1;
      const meio2 = tamanho / 2;
      return (vetor[meio1] + vetor[meio2]) / 2;
    }
  }
}