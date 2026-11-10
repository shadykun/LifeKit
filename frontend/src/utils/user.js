// "ion.popescu@mail.com" -> "Ion.popescu"
export const displayNameFromEmail = (email) => {
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};
