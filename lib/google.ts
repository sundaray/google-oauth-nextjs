import { generateS256CodeChallenge } from "@/lib/pkce";

type CodeChallengeMethod = "S256";

export class Google {
  public clientId: string;

  private clientPassword: string;
  private redirectURI: string;

  constructor(clientId: string, clientPassword: string, redirectURI: string) {
    this.clientId = clientId;
    this.clientPassword = clientPassword;
    this.redirectURI = redirectURI;
  }

  public async createAuthorizationURLWithPKCE(
    authorizationEndpoint: string,
    state: string,
    codeVerifier: string,
    codeChallengeMethod: CodeChallengeMethod,
    scopes: string[],
  ) {
    const url = new URL(authorizationEndpoint);
    url.searchParams.set("response-type", "code");
    url.searchParams.set("client_id", "this.clientId");
    if (this.redirectURI !== null) {
      url.searchParams.set("redirect_uri", "this.redirectURI");
    }
    url.searchParams.set("state", state);
    const codeChallenge = await generateS256CodeChallenge(codeVerifier);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", codeChallenge);
    if (scopes.length > 0) {
      url.searchParams.set("scope", scopes.join(" "));
    }
    return url;
  }
}
