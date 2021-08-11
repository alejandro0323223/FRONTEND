

 import { Inject, Injectable, Optional }                      from '@angular/core';
 import { HttpClient, HttpHeaders, HttpParams,
          HttpResponse, HttpEvent }                           from '@angular/common/http';
 import { CustomHttpUrlEncodingCodec }                        from './encoder';
 
 import { Observable }                                        from 'rxjs';
 
 import { LoginRequest } from '../API/model/loginRequest';
 import { RespuestaDTO } from '../API/model/respuestaDTO';
 
 import { BASE_PATH, COLLECTION_FORMATS }                     from './variables';
 import { Configuration }                                     from './configuration';
 
 
 @Injectable()
 export class LoginService {
 
     protected basePath = '/';
     public defaultHeaders = new HttpHeaders();
     public configuration = new Configuration();
 
     constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
         if (basePath) {
             this.basePath = basePath;
         }
         if (configuration) {
             this.configuration = configuration;
             this.basePath = basePath || configuration.basePath || this.basePath;
         }
     }
 
     /**
      * @param consumes string[] mime-types
      * @return true: consumes contains 'multipart/form-data', false: otherwise
      */
     private canConsumeForm(consumes: string[]): boolean {
         const form = 'multipart/form-data';
         for (const consume of consumes) {
             if (form === consume) {
                 return true;
             }
         }
         return false;
     }
 
 
     /**
     * 
     * 
     * @param token 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
      public apiLoginLoginAdminPost(token?: string, observe?: 'body', reportProgress?: boolean): Observable<RespuestaDTO>;
      public apiLoginLoginAdminPost(token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RespuestaDTO>>;
      public apiLoginLoginAdminPost(token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RespuestaDTO>>;
      public apiLoginLoginAdminPost(token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
  
  
          let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
          if (token !== undefined && token !== null) {
              queryParameters = queryParameters.set('token', <any>token);
          }
  
          let headers = this.defaultHeaders;
  
          // to determine the Accept header
          let httpHeaderAccepts: string[] = [
              'text/plain',
              'application/json',
              'text/json'
          ];
          const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
          if (httpHeaderAcceptSelected != undefined) {
              headers = headers.set('Accept', httpHeaderAcceptSelected);
          }
  
          // to determine the Content-Type header
          const consumes: string[] = [
          ];
  
          return this.httpClient.request<RespuestaDTO>('post',`${this.basePath}/api/Login/LoginAdmin`,
              {
                  params: queryParameters,
                  withCredentials: this.configuration.withCredentials,
                  headers: headers,
                  observe: observe,
                  reportProgress: reportProgress
              }
          );
      }
 
 }
 