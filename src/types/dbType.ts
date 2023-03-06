import {ObjectId} from "mongodb";
import {CommentatorInfo} from "./commentsType";

export type BlogDBModel = {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    id: string;
};

export type PostDBModel = {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    id: string;
};

export type CommentDBModel = {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    id: string;
};

export type UserDBModel = {
    _id: ObjectId;
    login: string;
    email: string;
    createdAt: string;
    hash: string;
    id: string;
    emailConfimation: {
        confimationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
};

export type AuthDBModel = {
    id: string;
    token: string;
    _id: ObjectId;
};

export type SecurityDevicesModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
    userId: string;
    _id: ObjectId;
};


