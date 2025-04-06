/**
 * Checks if the given password is valid according to the following rules:
 * * Must be at least 8 characters long.
 * * Must contain at least one uppercase letter.
 * * Must contain at least one lowercase letter.
 * * Must contain at least one number.
 * * Must contain at least one special character.
 * @param password The password to check.
 * @returns True if the password is valid; false otherwise.
 */
const validatePassword = (password: string) => {
    const specialCharacters = "@!#$%^&*()_+/-=[]{}|;:,.<>?~";

    if (password.length < 8) {
        return false;
    }

    if (!password.match(/[A-Z]/)) {
        return false;
    }

    if (!password.match(/[a-z]/)) {
        return false;
    }

    if (!password.match(/[0-9]/)) {
        return false;
    }

    let passwordHasSpecialCharacter = false;
    for (const c of password) {
        if (specialCharacters.includes(c)) {
            passwordHasSpecialCharacter = true;
            break;
        }
    }

    if (!passwordHasSpecialCharacter) {
        return false;
    }

    return true;
};

export { validatePassword };
