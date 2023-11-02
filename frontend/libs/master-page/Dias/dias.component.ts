import { CommonModule } from '@angular/common';
import { Dia } from './Dia';
import { DiasService } from './dias.service';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dias',
  templateUrl: './dias.component.html',
  styleUrls: ['./dias.component.css'],
  imports: [CommonModule]
})

export class DiasComponent implements OnInit {

  dias: Dia[];

  constructor(private diasService: DiasService) {}

  ngOnInit(): void 
  {
    this.diasService.PegarTodos().subscribe(resultado => {
      this.dias = resultado;
      console.log('Dados armazenados:', this.dias); // Só pra ver se está armazenando o dado
    });
  }

}