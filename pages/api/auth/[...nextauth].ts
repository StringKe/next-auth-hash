import NextAuth, { NextAuthOptions } from "next-auth";
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
             server: process.env.EMAIL_SERVER,
             from: process.env.EMAIL_FROM,
           }),
        // Temporarily removing the Apple provider from the demo site as the
        // callback URL for it needs updating due to Vercel changing domains
    
        Providers.Apple({
          clientId: process.env.APPLE_ID,
          clientSecret: {
            appleId: process.env.APPLE_ID,
            teamId: process.env.APPLE_TEAM_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY,
            keyId: process.env.APPLE_KEY_ID,
          },
        }),
        */

    {
      id: "facebook",
      name: "Facebook",
      type: "oauth",
      authorization:
        "https://www.facebook.com/v11.0/dialog/oauth?scope=email#some_hashing",
      token: "https://graph.facebook.com/oauth/access_token",
      userinfo: {
        url: "https://graph.facebook.com/me",
        // https://developers.facebook.com/docs/graph-api/reference/user/#fields
        params: { fields: "id,name,email,picture" },
        async request({ tokens, client, provider }) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return await client.userinfo(tokens.access_token!, {
            // @ts-expect-error
            params: provider.userinfo?.params,
          });
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
        };
      },
      style: {
        logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/facebook.svg",
        logoDark:
          "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/facebook-dark.svg",
        bg: "#fff",
        text: "#006aff",
        bgDark: "#006aff",
        textDark: "#fff",
      },
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    },
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },
  },
};

export default NextAuth(authOptions);
