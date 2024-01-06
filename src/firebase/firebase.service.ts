import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    this.firebase = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(configService.get<string>('FIREBASE_KEY')),
      ),
    });

    this.auth = this.firebase.auth();
  }

  private firebase: admin.app.App;
  private auth: admin.auth.Auth;
  getAuth() {
    return this.auth;
  }
}
