import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { FirebaseFunctionsRateLimiter } from 'firebase-functions-rate-limiter';

export class RateLimiter {
  public static tryCreate(firestore: admin.firestore.Firestore, maxIpCallsPerMinute: number): RateLimiter | null {
    if (maxIpCallsPerMinute < 1) {
      return null;
    }

    const limiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
      {
        name: 'moralisApiRateLimiter',
        maxCalls: maxIpCallsPerMinute,
        periodSeconds: 60,
      },
      firestore,
    );
    return new RateLimiter(limiter);
  }

  private constructor(private readonly limiter: FirebaseFunctionsRateLimiter) {}

  public async ensure(request: functions.https.Request): Promise<void> {
    const qualifier = this.convertIpToQualifier(request);
    await this.limiter.rejectOnQuotaExceededOrRecordUsage(qualifier, () => {
      return new functions.https.HttpsError('resource-exhausted', 'Too many requests')
    });
  }

  private convertIpToQualifier(request: functions.https.Request): string {
    return request.ip ? request.ip.replace(/\.|:/g, '-') : 'unknown';
  }
}
