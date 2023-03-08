import {Request, Response, Router } from "express";
import { blogsCollections, postsCollections, usersCollections, commentsCollections, authCollections, ipDataCollections } from "../repositories/db";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    let result = await blogsCollections.deleteMany({});
    let result1 =await postsCollections.deleteMany({});
    let result2 =await usersCollections.deleteMany({});
    let result3 =await commentsCollections.deleteMany({});
    let result4 =await authCollections.deleteMany({});
    let result5 =await ipDataCollections.deleteMany({});
    
    res.send(204);
  });