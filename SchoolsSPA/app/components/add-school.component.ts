import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { SchoolsService } from '../services/schools.service';
import { Town } from '../common/town';
import { School } from '../common/school';

@Component({
    templateUrl: 'templates/add-school.component.html',
    styleUrls: ['styles/add-school.component.css']
})

export class AddSchoolComponent implements OnInit {    
    model: School = <School>{};
    towns: Town[];    
    
    constructor(private schoolsService: SchoolsService, private router: Router) { }
    
    addSchool() {        
        this.schoolsService.addSchool(this.model)
            .subscribe(id => this.router.navigate(['SchoolsInTown', { town: this.model.Town }]));
    }
    
    ngOnInit() {
        this.schoolsService.getTowns().subscribe(towns => this.towns = towns);
    }
}
