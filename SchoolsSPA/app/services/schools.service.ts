import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Town } from '../common/town';
import { School } from '../common/school';

@Injectable()
export class SchoolsService {
    private backendUrl = 'https://bg-schools-api.herokuapp.com/api/';
    private towns: Town[];
    
    constructor(private http: Http) { }
    
    getTowns() : Observable<Town[]> {
        if (this.towns) {
            return Observable.of(this.towns);
        } 
        
        return this.http.get(this.backendUrl + 'Towns')
            .map(res => (<string[]>res.json())
            .map(town => <Town>{ Name: town }))
            .do(towns => this.towns = towns)
            .catch(this.handleError);
    }
    
    getSchools(town: string) : Observable<School[]> {
        return this.http.get(this.backendUrl + 'Schools/' + town)
            .map(res => (<School[]>res.json()))
            .catch(this.handleError);
    }
    
    addSchool(school: School) : Observable<string> {
        return this.http.post(this.backendUrl + 'Schools/Add', JSON.stringify(school))
            .map(res => res.json())
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error.');
    }
}
