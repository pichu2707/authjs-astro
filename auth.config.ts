import { defineConfig } from 'auth-astro';
import { db, eq, User } from 'astro:db';
import Credentials from '@auth/core/providers/credentials';
import bcrypt from 'bcryptjs';
import type { Adapter, AdapterUser } from '@auth/core/adapters';


export default defineConfig({
  providers: [
    //TODO:
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),

    Credentials({
        credentials: {
            email: {label: 'Correo', type:'email'},
            password: {label: 'Contraseña', type:'password'},
        },
        authorize: async ( { email, password }) => {

            const [user] = await db
            .select()
            .from(User)
            .where(eq(User.email, email as string));

            if ( !user ) {
                throw new Error (' Usuario no encontrado')
            }

            if (!bcrypt.compareSync(password as string, user.password)) {
                throw new Error(' Contraseña incorrecta')
            }

            //no enviamos la contraseña al cliente
            const { password: _, ...rest} = user;
            console.log({rest});

            return rest;
        },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {

        if (user) {
            token.user = user;
        }

        return token;
    },

    session: ({ session, token }) => {
        
        session.user = token.user as AdapterUser;
        return session;
    }
  }
});