import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	// Override to add debug logs when authentication fails
	handleRequest(err: any, user: any, info: any, context: any) {
		try {
			const req = context.switchToHttp().getRequest();
			console.log('🛡️ JwtAuthGuard.handleRequest called', {
				path: req.path,
				method: req.method,
				err: err && (err.message || err.name),
				userPresent: !!user,
				info: info && (info.message || info.name),
			});
		} catch (e) {
			console.error('Error logging JwtAuthGuard.handleRequest', e);
		}

		if (err || !user) {
			// Log details for debugging
			console.warn('Unauthorized request blocked by JwtAuthGuard', { err, info });
			throw err || new UnauthorizedException();
		}

		return user;
	}
}
