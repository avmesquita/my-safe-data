import { Injectable } from '@angular/core';
import { ContactDto } from '../models/contact.dto';
import { LinkDto } from '../models/link.dto';
import { NoteDto } from '../models/note.dto';
import { PasswordDto } from '../models/password.dto';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private statusMessage: string = '';
  isDbConnected: boolean = true;

  constructor() {
    this.statusMessage = 'Pronto';
  }
  
  setStatusMessage(message: string) {
    this.statusMessage = message;
  }

  getStatusMessage(): string {
    return this.statusMessage;
  }

  /*
      USER
   */

  async getUser() {
      return await (window as any).dbAPI.getUser();
  }

  async addUser(dto: UserDto) {
    if (dto.isValid()) {
      return await (window as any).dbAPI.addUser(dto);      
    }
  }

  /*
      CONTACTS
   */

  async listContacts() {
      return await (window as any).dbAPI.listContacts();
  }

  async addContact(dto: ContactDto) {
    if (dto.isValid()) {
      return await (window as any).dbAPI.addContact(dto);
    }
  }

  async deleteContact(id: number) {
    return await (window as any).dbAPI.deleteContact(id);      
  }

  /*
      LINKS
   */
  async listLinks() {
    return await (window as any).dbAPI.listLinks();
  }

  async addLink(dto: LinkDto) {
    if (dto.isValid()) {
      return await (window as any).dbAPI.addLink(dto);
    }
  }

  async deleteLink(id: number) {
    return await (window as any).dbAPI.deleteLink(id);      
  }

  /*
      NOTES
   */
  async listNotes() {
      return await (window as any).dbAPI.listNotes();
  }

  async addNote(dto: NoteDto) {
    if (dto.isValid()) {
      return await (window as any).dbAPI.addNote(dto);
    }
  }

  async deleteNote(id: number) {
    return await (window as any).dbAPI.deleteNote(id);
  }

  /*
      PASSWORDS
   */
  async listPasswords() {
    return await (window as any).dbAPI.listPasswords();
  }

  async addPassword(dto: PasswordDto) {
    if (dto.isValid()) {
      return await (window as any).dbAPI.addPassword(dto);
    }
  }

  async deletePassword(id: number) {
    return await (window as any).dbAPI.deletePassword(id);      
  }

}
