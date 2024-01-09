import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private firebase: admin.app.App;
  private auth: admin.auth.Auth;

  constructor(private configService: ConfigService) {
    this.firebase = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(configService.get<string>('FIREBASE_KEY')),
      ),
    });

    this.auth = this.firebase.auth();
  }

  getAuth() {
    return this.auth;
  }
}
