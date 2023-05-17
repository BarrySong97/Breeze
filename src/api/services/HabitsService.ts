/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHabit } from "../models/CreateHabit";
import type { HabitDatesDTO } from "../models/HabitDatesDTO";
import type { HabitDTO } from "../models/HabitDTO";
import type { UpdateHabit } from "../models/UpdateHabit";
import type { UpdateHabitDate } from "../models/UpdateHabitDate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class HabitsService {
  /**
   * @returns HabitDTO
   * @throws ApiError
   */
  public static habitsControllerFindAll(): CancelablePromise<Array<HabitDTO>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/habits",
    });
  }

  /**
   * @param requestBody
   * @returns HabitDTO
   * @throws ApiError
   */
  public static habitsControllerCreate(
    requestBody: CreateHabit
  ): CancelablePromise<HabitDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/habits",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param requestBody
   * @returns HabitDTO
   * @throws ApiError
   */
  public static habitsControllerUpdate(
    requestBody: UpdateHabit
  ): CancelablePromise<HabitDTO> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/habits",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param id
   * @returns HabitDTO
   * @throws ApiError
   */
  public static habitsControllerFindOne(
    id: string
  ): CancelablePromise<HabitDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/habits/{id}",
      path: {
        id: id,
      },
    });
  }

  /**
   * @param id
   * @returns HabitDTO
   * @throws ApiError
   */
  public static habitsControllerRemove(
    id: string
  ): CancelablePromise<HabitDTO> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/habits/{id}",
      path: {
        id: id,
      },
    });
  }

  /**
   * @param requestBody
   * @returns HabitDatesDTO
   * @throws ApiError
   */
  public static habitsControllerCheck(
    requestBody: UpdateHabitDate
  ): CancelablePromise<HabitDatesDTO> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/habits/checked",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
