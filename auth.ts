import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { comparePasswords } from '@lib/server/auth';
import { loginSchema } from 'lib/zod';
import { getUserFromDb } from 'app/api/users/route';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        try {
          // Validate input using Zod
          const { username, password } = await loginSchema.parseAsync(
            credentials
          );

          // Fetch user by email
          const user = await getUserFromDb(username);

          if (!user) {
            // If user not found, return null to indicate invalid credentials
            return null;
          }

          // Compare the provided password with the stored password hash
          const isPasswordValid = await comparePasswords(
            password,
            user.passwordHash!
          );

          if (!isPasswordValid) {
            // If password does not match, return null to indicate invalid credentials
            return null;
          }

          // If authentication is successful, return the user object
          // Exclude sensitive fields if necessary
          const user1: User = {
            id: user.id,
            name: user.username,
            email: user.email,
            avatar: '/avatars/default-avatar.jpg',
          };
          return user1;
        } catch (error) {
          if (error instanceof ZodError) {
            // If validation fails, return null
            return null;
          }

          // Log other errors and return null
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Add other fields as needed
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.email = token.email as string;
        session.user.name = token.name as string;

        // Add other fields as needed
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
