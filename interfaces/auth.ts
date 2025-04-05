export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  data: {
    token: string;
    valid_until: string;
  };
}

export interface IRegisterRequest {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  message: string;
  data: {
    token: string;
    valid_until: string;
  };
}

export interface IAvaChangeRequest {
  file: File;
}

export interface IAvaChangeResponse {
  message: string;
  data: {
    url: string;
  };
}

// "message": "Successful",
//     "data": {
//         "token": "3|MYGJDCQu34HFqUeXK8P4NnvAMmGe6zrq9hOP9C2r7d85507c",
//         "valid_until": "2025-05-04 05:08:30"
//     }
