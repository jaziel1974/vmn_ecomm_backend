import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['jaziel1974@gmail.com', 'vanessagtorlai@gmail.com', 'jorgeoliveira1995@gmail.com', 'brendasiloliveira06@gmail.com' ];

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.WEB_AUTH_CLIENT_ID,
      clientSecret: process.env.WEB_AUTH_CLIENT_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      }
      return false;
    }
  }
}


export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  } 
  console.log('isAdminRequest'); 
}