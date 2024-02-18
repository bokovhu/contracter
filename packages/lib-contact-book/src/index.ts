import { AppContact } from "../../contract-model/src";

const CONTACT_BOOK_KEY = "contracter.contactBook";

class ContactBookImpl {

    private _contacts: Array<AppContact> = [];

    constructor() {

        const persistedData = localStorage.getItem(CONTACT_BOOK_KEY);
        if (persistedData) {
            this._contacts = JSON.parse(persistedData);
        }

    }

    private async flush() {
        localStorage.setItem(CONTACT_BOOK_KEY, JSON.stringify(this._contacts));
    }

    public async listContacts(): Promise<Array<AppContact>> {
        return this._contacts;
    }

    public async createContact(
        newContact: AppContact
    ): Promise<void> {
        const existingContactIndex = this._contacts.findIndex(
            contact => contact.address === newContact.address
        );

        if (existingContactIndex !== -1) {
            this._contacts[existingContactIndex] = newContact;
        } else {
            this._contacts.push(newContact);
        }

        await this.flush();
    }

    public async deleteContact(
        address: string
    ): Promise<void> {
        this._contacts = this._contacts.filter(
            contact => contact.address !== address
        );

        await this.flush();
    }

}

const contactBookInstance = new ContactBookImpl();

export const listContacts = contactBookInstance.listContacts.bind(contactBookInstance);
export const createContact = contactBookInstance.createContact.bind(contactBookInstance);
export const deleteContact = contactBookInstance.deleteContact.bind(contactBookInstance);
