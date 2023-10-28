import { Dia } from './Dia';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class DiasService {

    url = 'http://localhost:5100/api/Dias/primeiros'
    constructor(private http: HttpClient) { }

    PegarTodos(): Observable<Dia[]>{
        return this.http.get<Dia[]>(this.url);
    }

}
