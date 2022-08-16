export interface Domain {
	id: string;
	domain: string;
	isActive: boolean;
	isPrivate: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Mail {
	id: string;
	accountId: string;
	msgid: string;
	from: {
		address: string;
		name: string;
	};
	to: {
		address: string;
		name: string;
	}[];
	subject: string;
	intro: string;
	seen: boolean;
	isDeleted: boolean;
	hasAttachment: boolean;
	downloadUrl: string;
	size: number;
	createdAt: string;
	updatedAt: string;
}
