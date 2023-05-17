/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDTO } from './UserDTO';

export type Auth = {
    accessToken: string;
    refreshToken: string;
    user: UserDTO;
};
