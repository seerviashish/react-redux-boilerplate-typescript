import axios from "axios";

class AppNetwork {
  private baseUrl?: string;
  private token?: string;
  private version?: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_SERVICE_URL;
    this.version = "v1";
  }

  private isRefreshTokenExpired = (): boolean => {
    return true;
  };

  private getRefreshToken = (): string => {
    return "";
  };

  private getUrl = (apiPath: string): string => {
    return this.baseUrl + "/" + this.version + "/" + apiPath;
  };

  get = async (apiPath: string, headers?: any): Promise<any> => {
    return await axios.get(this.getUrl(apiPath), {
      headers,
    });
  };

  post = async (apiPath: string, data?: any, headers?: any): Promise<any> => {
    return await axios.post(this.getUrl(apiPath), data, {
      headers,
    });
  };
}

const appNetwork: AppNetwork = new AppNetwork();

export default appNetwork;
