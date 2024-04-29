export type Note = {
	id: string;
	title: string;
	content: string;
	updated_at: number;
}

export type ResponseNote = {
	id: string;
	title: string;
	content: string;
	updated_at: string;
}

export type EditNote = {
	isUpdate: boolean;
	updateNoteId: string;
}