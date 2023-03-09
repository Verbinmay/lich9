import express from 'express'
import bodyParser from "body-parser";
import { runDb } from './repositories/db';
import { blogsRouter } from './routers/blogsRouter';
import { postsRouter } from './routers/postsRouter';
import { authRouter } from './routers/authRouter';
import { usersRouter } from './routers/usersRouter';
import { commentsRouter } from './routers/commentsRouter';
import { testingRouter } from './routers/testingRouter';
import cookieParser from 'cookie-parser'
import { securityRouter } from './routers/securityDevices';
import { app, startApp } from './settings';

const jsonBodyMiddleware = bodyParser.json()
app.use (jsonBodyMiddleware)
app.use(cookieParser())


app.set('trust proxy', true)
//прописываем наши роуты
app.use('/blogs', blogsRouter) 
app.use('/posts', postsRouter) 
app.use('/auth', authRouter) 
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)

startApp();

export default app
