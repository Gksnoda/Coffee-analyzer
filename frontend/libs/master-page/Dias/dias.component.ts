import { CommonModule } from '@angular/common';
import { Dia } from './Dia';
import { DiasService } from './dias.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';


@Component({
  standalone: true,
  selector: 'app-dias',
  templateUrl: './dias.component.html',
  styleUrls: ['./dias.component.css'],
  imports: [CommonModule,
    NgChartsModule,
  ]
})

export class DiasComponent implements OnInit {

  dias: Dia[];
  constructor(private diasService: DiasService) {}
  @ViewChild("myChart", {static: true}) elemento: ElementRef;

  ngOnInit(): void 
  {
    this.diasService.PegarTodos().subscribe(resultado => {
      this.dias = resultado;
    });

    new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", 
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        datasets: [
          {
            data: [10.50, 20.84, 30, 40, 50, 60, 0, 70, 80, 90, 100, 120]
          }
        ]
      }
    });
  }

}