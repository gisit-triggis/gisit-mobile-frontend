export interface IUser {
	email: string
	name: string
	surname: string
	full_name: string
}

export interface IProfileChange {
	name?: string
	surname?: string
}

export interface IProfileChangeResponse {
	message: string
	data: {
		name: string
		surname: string
	}
}

export interface IProfileResponse {
	message: string
	data: IUser
}

// "message": "Successful",
//     "data": {
//         "id": "01jqzk3kczd9vx50d4855zx78g",
//         "email": "dulluur@gmail.com",
//         "name": "Dulluur",
//         "surname": "Okoneshnikov",
//         "full_name": "Dulluur Okoneshnikov"
//     }
