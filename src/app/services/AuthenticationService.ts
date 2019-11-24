import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IRegisterModel } from "../models/registerModel";
import {UserManager, User} from "oidc-client";


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentuser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/account/signin`, {usernameoremail:username, password})
        .pipe(map(data => {
            var statusCode = data.statusCode;
            var user = data.results ? data.results[0] : null;
            if (statusCode === 200 && user && user.token) {
                localStorage.setItem('currentuser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return data;
            }
            throw new Error(data.errors.join(', '));
        }))
    }
    register(registerModel:IRegisterModel){
        return this.http.post<any>(`${environment.apiUrl}/account/register`,registerModel)
        .pipe(map(data=>{
            var statusCode= data.statusCode;
            var user=data.results? data.results[0]:null;
            if(statusCode==200 && user && user.token){
                localStorage.setItem('currenUser',JSON.stringify(user));
                this.currentUserSubject.next(user);
                
            }
            throw new Error(data.error.joins(', '));
        }))
    }

    

    logout() {
        localStorage.removeItem('currentuser');
        this.currentUserSubject.next(null);
    }
}