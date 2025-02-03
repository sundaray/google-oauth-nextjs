import { generateS256CodeChallenge } from "@/lib/oauth2/pkce";
import { encodeBasicCredentials } from "@/lib/oauth2/utils";

const authorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export async function createAuthorizationURLWithPKCE(
  state: string,
  clientId: string,
  redirectURI: string,
  codeVerifier: string,
  scopes: string[],
) {
  const codeChallenge = await generateS256CodeChallenge(codeVerifier);

  const url = new URL(authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectURI);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  if (scopes.length > 0) {
    url.searchParams.set("scope", scopes.join(" "));
  }
  return url;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  clientPassword: string,
  redirectURI: string,
) {
  const encodedCredentials = encodeBasicCredentials(clientId, clientPassword);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${encodedCredentials}`,
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      code_verifier: codeVerifier,
      redirect_uri: redirectURI,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    console.log("Access Token Response Error: ", data);
  }

  const data = await response.json();
  console.log("Access Token response: ", data);
}
