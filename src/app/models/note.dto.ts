export class NoteDto {
    id?: number;
    name: string;
    data: string;
    instant?: Date;

    constructor() {
        this.name = '';
        this.data = '';
    }

    isValid(): boolean{
        return !(this.name == '' && this.data == '');
    }
}

