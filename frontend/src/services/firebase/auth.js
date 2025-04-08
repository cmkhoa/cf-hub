import { auth } from "./firebase";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	sendPasswordResetEmail,
	updatePassword,
} from "firebase/auth";

// export const doCreateUserWithEmailAndPassword = async (email, password) => {
// 	try {
// 		const response = await createUserWithEmailAndPassword(
// 			auth,
// 			email,
// 			password
// 		);
// 		return response;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// export const doSignInWithEmailAndPassword = async (email, password) => {
// 	try {
// 		const response = await signInWithEmailAndPassword(auth, email, password);
// 		return response;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export const doSignInWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Check if it's a Google user like this:
		const isGoogle = user.providerData.some(
			(provider) => provider.providerId === "google.com"
		);

		return {
			email: user.email,
			name: user.displayName,
			isGoogle,
		};
	} catch (error) {
		console.error("Google login failed", error);
		throw error; // Re-throw the error so it can be handled by the caller
	}
};

export const doSignOut = () => {
	return auth.signOut();
};

export const doPasswordReset = (email) => {
	return sendPasswordResetEmail(auth.currentUser, email);
};

export const doPasswordUpdate = (password) => {
	return updatePassword(auth.currentUser, password);
};

// export const doSendEmailVerification = () => {
// 	return sendEmailVerification(auth.currentUser);
// };
