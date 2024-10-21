import jwt from 'jsonwebtoken';


// payload is an object that takes the info to be encrypted
export function tokenGenerator(payload){
  return new Promise((resolve, reject)=>{
    jwt.sign(payload, "secretKey", {expiresIn: '1h'}, (error, token)=>{
      if (error) {
        reject({error})
      } else {
        resolve({token})
      }
    })
  })
}
