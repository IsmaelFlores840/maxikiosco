import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

/* eslint class-methods-use-this: 0 */

class AuthenticationHelper {
  static isUserAuthenticated() {
    return sessionStorage.jwtToken ? true : false;
  }

  static logout = (callback = () => {}) => {
    AuthenticationHelper.removeJwtToken();
    AuthenticationHelper.removeUser();
    AuthenticationHelper.removeRol();
    AuthenticationHelper.removeHasChangedPassword();
    sessionStorage.removeItem("userPermissions");
    callback();
  };

  static isJwtTokenStored() {
    return sessionStorage.jwtToken ? true : false;
  }

  static getJwtToken() {
    return AuthenticationHelper.isJwtTokenStored()
      ? sessionStorage.jwtToken
      : null;
  }

  static storeJwtToken(jwtToken) {
    if (jwtToken.indexOf("Bearer ") >= 0) {
      jwtToken = jwtToken.replace("Bearer ", "");
    }
    sessionStorage.setItem("jwtToken", jwtToken);
    return null;
  }

  static removeJwtToken() {
    sessionStorage.removeItem("jwtToken");
    return null;
  }

  static hasJwtPayloadKey(key) {
    if (AuthenticationHelper.isJwtTokenStored()) {
      const decodedToken = jwtDecode(sessionStorage.jwtToken);
      if (!key) {
        return null;
      }
      return decodedToken[key] !== undefined;
    }
    return null;
  }

  static getValueFromJwtPayload(key) {
    if (AuthenticationHelper.isJwtTokenStored) {
      const decodedToken = jwtDecode(sessionStorage.jwtToken);
      if (!key) {
        return null;
      }
      return decodedToken[key];
    }
    return null;
  }

  static getDecodedToken() {
    return AuthenticationHelper.isJwtTokenStored
      ? jwtDecode(sessionStorage.jwtToken)
      : null;
  }

  static storeUser(user) {
    sessionStorage.setItem("user", user);
    return null;
  }

  static getUser() {
    return sessionStorage.user ? sessionStorage.user : "";
  }

  static removeUser() {
    sessionStorage.removeItem("user");
    return null;
  }

  static storeRol(rol) {
    const rolUser = encriptarCadena(rol);
    sessionStorage.setItem("rolUser", rolUser);
    return null;
  }

  static getRol() {
    const rolUser = sessionStorage.rolUser
      ? desencriptarCadena(sessionStorage.rolUser)
      : "";
    return rolUser;
  }

  static removeRol() {
    sessionStorage.removeItem("rolUser");
    return null;
  }

  static storeHasChangedPassword(hasChangedPassword) {
    const hasChangedPasswordString = hasChangedPassword.toString();
    const hasChangedPasswordUser = encriptarCadena(hasChangedPasswordString);
    sessionStorage.setItem("hasChangedPassword", hasChangedPasswordUser);
  }

  static getHasChangedPassword() {
    const hasChangedPasswordUser = sessionStorage.getItem("hasChangedPassword");
    if (hasChangedPasswordUser) {
      const decryptedHasChangedPasswordString = desencriptarCadena(
        hasChangedPasswordUser
      );
      const hasChangedPassword = decryptedHasChangedPasswordString === "true";
      return hasChangedPassword;
    }
    return false;
  }

  static removeHasChangedPassword() {
    sessionStorage.removeItem("hasChangedPassword");
    return null;
  }
}
export default AuthenticationHelper;

function encriptarCadena(cadena) {
  const cadenaEncriptada = CryptoJS.AES.encrypt(
    cadena,
    "KeyClienteUnico"
  ).toString();
  return cadenaEncriptada;
}

function desencriptarCadena(cadenaEncriptada) {
  const cadena = CryptoJS.AES.decrypt(
    cadenaEncriptada,
    "KeyClienteUnico"
  ).toString(CryptoJS.enc.Utf8);
  return cadena;
}
