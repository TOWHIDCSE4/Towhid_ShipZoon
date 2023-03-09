import Exception from "@core/Exception";

class ThirdPartyException extends Exception {
  constructor(message: string = "", data: any = null) {
    super(500, message, data, 500);
  }
}

export default ThirdPartyException;
