export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/blog-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'BLOG7==1fost%5v2k*q9xc)zm0%on!5!jk&qjmqr7gk=ht*&JWT'
}