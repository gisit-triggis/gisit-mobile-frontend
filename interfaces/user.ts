export interface IUser {
  email: string;
  name: string;
  surname: string;
  full_name: string;
  avatar_url?: string; // <-- новое поле
}

export interface IProfileChange {
  name?: string;
  surname?: string;
}

export interface IProfileChangeResponse {
  message: string;
  data: {
    name: string;
    surname: string;
  };
}

export interface IProfileResponse {
  message: string;
  data: IUser;
}

// Дополнительный интерфейс для ответа при загрузке аватара
export interface IProfilePhotoResponse {
  message: string;
  data: {
    url: string;
  };
}
