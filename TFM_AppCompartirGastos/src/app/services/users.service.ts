import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';
import { PHONE_CODES } from '../db/international_codes.db';
import { IUsername } from '../components/add-group-members/add-group-members.component';
import { ImemberGroup } from '../interfaces/imember-group';

type PhoneCode = {
  name: string,
  code: string
}

type RegisterBody = {
  mail: string,
  username: string,
  password?: string,
  firstname: string,
  lastname: string,
  phone?: string
}

type LoginResponse = {
  message?: string,
  error?: string,
  errno?: number,
  token?: string
}

type updateResponse = {
  error?: string,
  success?:boolean
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  // URL de entorno
  private API_URL: string | undefined;

  private phoneCodesArr: Array<PhoneCode> = PHONE_CODES;

  constructor() {
    this.API_URL = environment.API_URL;
  }

  /**
   * Método que devuelve la lista de códigos telefónicos internacionales a parir del json almacenado en ./src/app/db/international_codes.db
   */
  getAllInternationalCodes() {
    return this.phoneCodesArr;
  }

  /**
   * Fetches a user object by ID using a GET request to the `/users/:userId` endpoint.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<IUser>} - A promise that resolves to the retrieved user object or throws an error if the request fails. The user object conforms to the `IUser` interface.
   */
  getUserById(userId: number) {
    return lastValueFrom(
      this.httpClient.get<IUser>(`${this.API_URL}/users/${userId}`)
    );
  }

  /**
   * Método para obtener todos los usuarios activos de un grupo
   */
  getUsersByGroup(groupId: number): Promise<IUser[]> {
    return lastValueFrom(
      this.httpClient.get<IUser[]>(`${this.API_URL}/users/bygroup/${groupId}`)
    );
  }

    /**
   * Método para obtener todos los miembros de un grupo
   */
  getMemberUserByGroup(groupId: number)
  {
    return lastValueFrom(this.httpClient.get<any>(`${this.API_URL}/users/members/bygroup/${groupId}`));
  }

  /**
   * Checks if a username already exists by sending a GET request to the /register/checkUsername/:username endpoint.
   *
   * @param {string} username - The username to be checked.
   * @returns {Promise<{exists: boolean}>} - A promise that resolves to an object indicating whether the username exists.
   */
  checkUsename(username: string) {
    return lastValueFrom(
      this.httpClient.get<{ exists: boolean }>(
        `${this.API_URL}/register/checkUsername/${username}`
      )
    );
  }

  /**
   * Checks if an email already exists by sending a GET request to the /register/checkMail/:mail endpoint.
   *
   * @param {string} mail - The email to be checked.
   * @returns {Promise<{active: boolean | null}>} - A promise that resolves to an object indicating whether the mail does not exist (null), exists and is active (true) or exists but has unsubscribed (false).
   */
  checkMail(mail: string) {
    return lastValueFrom(
      this.httpClient.get<{ active: boolean |null }>(
        `${this.API_URL}/register/checkMail/${mail}`
      )
    );
  }

/**
 * Fetches usernames based on a provided filter string.
 *
 * @param {string} filter - The filter string to be used for searching usernames.
 * @returns {Promise<IUsername[]>} A promise that resolves to an array of `IUsername` objects containing username and ID information.
 * @throws {Error} - Rejects the promise with an error if the request fails.
 */
  getUsernames(filter: string) {
    return lastValueFrom (
      this.httpClient.get<IUsername[]>(`${this.API_URL}/users/filteredusernames/${filter}`
      )
    );
  }


  /**
   * Creates a new user by sending a POST request to the /register endpoint.
   *
   * @param {RegisterBody} newUser - The data for the new user to be registered.
   * @returns {Promise<loginResponse>} - A promise that resolves to the response of the registration request.
   */
  createNewUser(newUser: RegisterBody): Promise<LoginResponse> {
    return lastValueFrom(
      this.httpClient.post<LoginResponse>(`${this.API_URL}/register`, newUser)
    );
  }

  /**
   * Updates a user using a PUT request to the `/users/update/:id` endpoint.
   *
   * @param {RegisterBody} newUser - The updated user data object conforming to the `RegisterBody` interface.
   * @returns {Promise<any>} - A promise that resolves after the update request is sent.
   * @throws {Error} - If the request fails (e.g., network error, server-side error).
   */
  updateUser(newUser: RegisterBody) {
    return lastValueFrom(
      this.httpClient.put<any>(`${this.API_URL}/users/update`, newUser)
    );
  }

  /**
   * Updates a user's password using a PUT request to the `/users/updatePwd` endpoint.
   *
   * @param {RegisterBody} password - The updated user data object conforming to the `RegisterBody` interface.
   * @returns {Promise<any>} - A promise that resolves after the update request is sent.
   * @throws {Error} - If the request fails (e.g., network error, server-side error).
   */
  updatePassword(newPassword: object) {
    return lastValueFrom(
      this.httpClient.put<updateResponse>(`${this.API_URL}/users/updatePwd`, newPassword)
    );
  }

  /**
   * Unsubscribes a user using a DELETE request to the `/users/:UserId` endpoint.
   *
   * @param {RegisterBody} password - The updated user data object conforming to the `RegisterBody` interface.
   * @returns {Promise<any>} - A promise that resolves after the update request is sent.
   * @throws {Error} - If the request fails (e.g., network error, server-side error).
   */
  unsubscribe(userId: number) {
    return lastValueFrom(this.httpClient.delete <any> (`${this.API_URL}/users/${userId}`))
  }

  /**
   * Deletes a user using a DELETE request to the `/users/:UserId` endpoint.
   * @param group_id 
   * @param user_id 
   * @returns 
   */
  deleteMember(group_id: number, user_id: number)
  {
    return lastValueFrom(
      this.httpClient.delete<updateResponse>(`${this.API_URL}/members/${group_id}/${user_id}`)
    );
  }

  /**
   * Get member by user_id and group_id
   * @param group_id 
   * @param user_id 
   * @returns 
   */
  getMemberByUserIdByGroupId(group_id: number, user_id: number)
  {
    return lastValueFrom(
      this.httpClient.get<ImemberGroup>(`${this.API_URL}/members/${group_id}/${user_id}`)
    );
  }

/**
 * Updates a member using a PUT request to the `/members/:group_id/:user_id` endpoint.
 * @param newMember - The data with the new member to be updated
 * @returns 
 */
  updateMember(newMember: ImemberGroup) {
    return lastValueFrom(
      this.httpClient.put<ImemberGroup>(`${this.API_URL}/members/${newMember.group_id}/${newMember.user_id}`, newMember)
    );
  }
}
