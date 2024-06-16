export const authConfig = {
  issuerBaseURL: "https://dev-r07u7mel6oip3xhm.us.auth0.com",
  audience: "https://cspjainilauthapi.jainilpatel.tech",
};

export let authRoleConfig = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://login.auth0.com/api/v2/users/:id/roles",
  headers: {
    Accept: "application/json",
    Authorization:
      `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
  },
};

export const authHederConfig = {
  headers: {
    "Authorization":
      `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
  },
}
