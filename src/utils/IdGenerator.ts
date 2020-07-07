import { v4 as uuid } from 'uuid';

export class IdGenerator {
    static generateId() :string {
        return uuid();
    }
}