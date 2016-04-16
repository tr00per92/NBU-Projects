import { Component, OnInit } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { School } from '../common/school';
import { SchoolsService } from '../services/schools.service';

@Component({
    templateUrl : 'templates/schools.component.html'
})

export class SchoolsComponent implements OnInit {
    schools: School[];
    
    constructor(private schoolsService: SchoolsService, private routeParams: RouteParams) { }
    
    ngOnInit() {
        let town = this.routeParams.get('town') || '';
        this.schoolsService.getSchools(town).subscribe(schools => this.schools = schools)
    }
}
