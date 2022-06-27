const jwt = require("jsonwebtoken");

const secret = 'AuG0AlHxWovY48COOKUgQM8bvEPrPtA+YfFyu2ZOreyEEVxWO8zVCHzrV0378mZKLOtMFB/qKzzBpRsjGv3h74Y3azNDt1DhkLzIkC692sua4IVAMVtli245wMRJSv/0XqbcZ9ylUdM6z8yH6mH99Hr7AnSNoMyegHdEXkaM7t85G1GZKr4+usM8U5obHLTr0b5hpR10rei1AJgoqjSdPG17INWjyPWFjYEHqsqai0/8+2QVy6ZSE6I9Mrkfh3TYnygOrSHQNLs7OUs/wLQ2NXgGZ2Jog4++42Ot9IfbKRq5juXBKJBHOhhZ/Cy0QJvBXruwjv6JWtivgJ6fBywuyA=='
const test = 'oAuG0AlHxWovY48COOKUgQM8bvEPrPtA+YfFyu2ZOreyEEVxWO8zVCHzrV0378mZKLOtMFB/qKzzBpRsjGv3h74Y3azNDt1DhkLzIkC692sua4IVAMVtli245wMRJSv/0XqbcZ9ylUdM6z8yH6mH99Hr7AnSNoMyegHdEXkaM7t85G1GZKr4+usM8U5obHLTr0b5hpR10rei1AJgoqjSdPG17INWjyPWFjYEHqsqai0/8+2QVy6ZSE6I9Mrkfh3TYnygOrSHQNLs7OUs/wLQ2NXgGZ2Jog4++42Ot9IfbKRq5juXBKJBHOhhZ/Cy0QJvBXruwjv6JWtivgJ6fBywuyA=='

const token = jwt.sign({id: "mil"}, secret)


    const decrypt = jwt.verify(token, test)
    console.log(decrypt)



