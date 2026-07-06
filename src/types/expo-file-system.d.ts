// src/types/expo-file-system.d.ts
declare module 'expo-file-system' {
  // Các hằng số
  export const documentDirectory: string;
  export const cacheDirectory: string;
  export const bundleDirectory: string;
  
  // Các hàm
  export function getInfoAsync(
    fileUri: string,
    options?: { size?: boolean; md5?: boolean }
  ): Promise<{
    exists: boolean;
    uri: string;
    size?: number;
    modificationTime?: number;
    md5?: string;
  }>;
  
  export function makeDirectoryAsync(
    fileUri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;
  
  export function deleteAsync(
    fileUri: string,
    options?: { idempotent?: boolean }
  ): Promise<void>;
  
  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: 'utf8' | 'base64' }
  ): Promise<string>;
  
  export function writeAsStringAsync(
    fileUri: string,
    content: string,
    options?: { encoding?: 'utf8' | 'base64' }
  ): Promise<void>;
  
  export function createDownloadResumable(
    uri: string,
    fileUri: string,
    options?: {
      headers?: Record<string, string>;
      sessionType?: 'background' | 'foreground';
    },
    callback?: (downloadProgress: {
      totalBytesWritten: number;
      totalBytesExpectedToWrite: number;
    }) => void
  ): {
    downloadAsync: () => Promise<{ uri: string } | undefined>;
    pauseAsync: () => Promise<{ uri: string }>;
    resumeAsync: () => Promise<{ uri: string }>;
  };
  
  export function uploadAsync(
    url: string,
    fileUri: string,
    options?: {
      headers?: Record<string, string>;
      uploadType?: 'binary' | 'multipart';
      fieldName?: string;
      parameters?: Record<string, string>;
    }
  ): Promise<{
    body: string;
    status: number;
    headers: Record<string, string>;
  }>;
}