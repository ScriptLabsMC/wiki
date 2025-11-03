export default function EvalPswd(password){
  return password === process.env.ADMIN_PSWD
}