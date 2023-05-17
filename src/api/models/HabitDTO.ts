/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HabitDatesDTO } from './HabitDatesDTO';

export type HabitDTO = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    order: number;
    dates: Array<HabitDatesDTO>;
};
