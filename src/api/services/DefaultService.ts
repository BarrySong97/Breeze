/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns string 
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    /**
     * @param name 
     * @returns string 
     * @throws ApiError
     */
    public static appControllerGetHelloName(
name: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/hello/{name}',
            path: {
                'name': name,
            },
        });
    }

}
