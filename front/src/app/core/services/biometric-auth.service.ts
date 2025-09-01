import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BiometricCredential {
  id: string;
  publicKey: string;
  username: string;
  displayName: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BiometricAuthService {
  private readonly CREDENTIALS_KEY = 'biometric_credentials';
  private biometricSupportSubject = new BehaviorSubject<boolean>(false);
  public biometricSupport$ = this.biometricSupportSubject.asObservable();

  constructor() {
    this.checkBiometricSupport();
  }

  /**
   * Verifica si el dispositivo soporta autenticación biométrica
   */
  private async checkBiometricSupport(): Promise<void> {
    try {
      // Verificar si WebAuthn está disponible
      const isWebAuthnSupported = !!(navigator.credentials && navigator.credentials.create);
      
      if (isWebAuthnSupported) {
        // Verificar si hay autenticadores disponibles
        const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        this.biometricSupportSubject.next(isAvailable);
      } else {
        this.biometricSupportSubject.next(false);
      }
    } catch (error) {
      console.warn('Error checking biometric support:', error);
      this.biometricSupportSubject.next(false);
    }
  }

  /**
   * Registra una nueva credencial biométrica
   */
  async registerBiometric(username: string, displayName: string): Promise<boolean> {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "App Gastos",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: displayName,
        },
        pubKeyCredParams: [
          {
            alg: -7, // ES256
            type: "public-key"
          },
          {
            alg: -257, // RS256
            type: "public-key"
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (credential && credential.response) {
        const response = credential.response as AuthenticatorAttestationResponse;
        // Guardar credencial en localStorage (en producción usar backend seguro)
        const biometricCred: BiometricCredential = {
          id: credential.id,
          publicKey: this.arrayBufferToBase64(response.getPublicKey() || new ArrayBuffer(0)),
          username: username,
          displayName: displayName,
          createdAt: new Date()
        };

        this.saveCredential(biometricCred);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error registering biometric:', error);
      return false;
    }
  }

  /**
   * Autentica usando biométrica
   */
  async authenticateWithBiometric(): Promise<string | null> {
    try {
      const savedCredentials = this.getSavedCredentials();
      
      if (savedCredentials.length === 0) {
        throw new Error('No hay credenciales biométricas registradas');
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge,
        allowCredentials: savedCredentials.map(cred => ({
          id: this.base64ToArrayBuffer(cred.id),
          type: "public-key"
        })),
        userVerification: "required",
        timeout: 60000
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (assertion) {
        // Buscar la credencial correspondiente
        const matchingCred = savedCredentials.find(cred => cred.id === assertion.id);
        
        if (matchingCred) {
          // En una implementación real, aquí verificarías la firma con el backend
          return matchingCred.username;
        }
      }

      return null;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return null;
    }
  }

  /**
   * Obtiene las credenciales guardadas
   */
  getSavedCredentials(): BiometricCredential[] {
    try {
      const stored = localStorage.getItem(this.CREDENTIALS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Verifica si hay credenciales registradas para un usuario
   */
  hasCredentialsForUser(username: string): boolean {
    const credentials = this.getSavedCredentials();
    return credentials.some(cred => cred.username === username);
  }

  /**
   * Elimina todas las credenciales biométricas
   */
  clearAllCredentials(): void {
    localStorage.removeItem(this.CREDENTIALS_KEY);
  }

  /**
   * Elimina credenciales de un usuario específico
   */
  removeUserCredentials(username: string): void {
    const credentials = this.getSavedCredentials();
    const filtered = credentials.filter(cred => cred.username !== username);
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(filtered));
  }

  // Métodos utilitarios privados
  private saveCredential(credential: BiometricCredential): void {
    const existing = this.getSavedCredentials();
    // Remover credenciales existentes del mismo usuario
    const filtered = existing.filter(cred => cred.username !== credential.username);
    filtered.push(credential);
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(filtered));
  }

  private generateChallenge(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
