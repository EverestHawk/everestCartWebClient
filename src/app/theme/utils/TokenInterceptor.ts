import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthenticationService } from "src/app/services/AuthenticationService";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );
    constructor(public auth: AuthenticationService) {}

    intercept(
        request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        console.log('event--->>>', event);
                    }
                    return event;
                }),catchError(error=>{
                    if(error instanceof HttpErrorResponse && error.status==401){
                        this.handle401Error(request,next)
                    }
                    return throwError(error)
                }));
       
    }
    handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if(!this.refreshTokenInProgress){
            this.refreshTokenInProgress=true;
            this.refreshTokenSubject.next(null);
        }
    }

    addAuthenticationToken(request) {
        // Get access token from Local Storage
        const accessToken = this.auth.currentUserValue.token;

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }

        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

   
}