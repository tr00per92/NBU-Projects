import { Component, OnInit } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { SchoolsService } from '../services/schools.service';
import { SchoolsComponent } from './schools.component';
import { AddSchoolComponent } from './add-school.component';
import { Town } from '../common/town';

@RouteConfig([
    {
        path: '/schools',
        name: 'Schools',
        component: SchoolsComponent,
        useAsDefault: true
    },{
        path: '/schools/:town',
        name: 'SchoolsInTown',
        component: SchoolsComponent
    },{
        path: '/schools/add',
        name: 'AddSchool',
        component: AddSchoolComponent
    }
])

@Component({
    selector: 'app',
    templateUrl: 'templates/app.component.html',
    styleUrls: ['styles/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, SchoolsService]    
})

export class AppComponent implements OnInit {    
    title = 'Bulgarian Schools';
    towns: Town[]; 
    
    constructor(private schoolsService: SchoolsService) { }
    
    ngOnInit() {
        this.schoolsService.getTowns().subscribe(towns => this.towns = towns);
    }
}
