import { extend } from "joi";

export type ResponseType = {
  status: number;
  message: string;
  body: any;
};

export function getOKResponse(
  message: string = "OK",
  status: number = 200,
  body = null
): ResponseType {
  return {
    message,
    status,
    body,
  };
}
