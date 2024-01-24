import { Request, Response, NextFunction } from 'express';

const reslogger = (req: Request, res: Response, next: NextFunction) => {
    const oldSend = res.send;

    res.send = function sendReplacement(body) {
        // console.log('Response:', body);
        return oldSend.apply(res, [body]);
    };

    next();
};

export default reslogger;
