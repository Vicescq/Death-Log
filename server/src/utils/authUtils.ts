export function validateRegisterInfo(user: any, req: any) {
    
    return (req.is("application/json") && (typeof user.password == "string") && (user.password.length >= 5) && user.username.length >= 3)
}