import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { InjectionKey } from 'vue';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly api: AxiosInstance;
  }
}

export const apiKey: InjectionKey<AxiosInstance> = Symbol('api-key');
export function createApi() {
  return axios.create({
    baseURL: '/api',
  });
}

export function useApi() {
  const api = inject(apiKey);
  if (!api) {
    throw 'api not injected';
  }
  return api;
}
