import { Request, Response } from "express";

const executeCode = async(req: Request, res: Response) => {
    res.status(200).json({success: true, message: "Hii execution route"});
};

const checkExecutionStatus = async(req: Request, res: Response) => {
    res.status(200).json({success: true, message: "Hii check route"});
}

export const controllers = { executeCode, checkExecutionStatus };
