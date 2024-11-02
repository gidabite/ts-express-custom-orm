import express, { NextFunction, Request, Response } from 'express';
import { validateData } from '../../middlewares/validation';

import orderModel from '../../models/order';
import { orderCreateSchema } from './scheme';

const router = express.Router();

router
    .route('/order')
    .get(async (_: Request, res: Response, next: NextFunction) => {
        try {
            res.send({
                orders: await orderModel.get(),
            });
        } catch (e) {
            next(e);
        }
    })
    .post(
        validateData(orderCreateSchema),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const commitedObject = await orderModel.create([
                    {
                        id: '',
                        name: req.body.name,
                        type: req.body.type,
                        depth: req.body.depth,
                    },
                ]);
                if (!(commitedObject instanceof Error)) {
                    res.status(201).send(commitedObject[0]);
                }
            } catch (e) {
                next(e);
            }
        },
    );

router.get(
    '/order/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await orderModel.get({
                type: 'PREDICATE',
                name: 'id',
                operation: '==',
                valueType: 'DIRECT',
                value: req.params.id,
            });
            if (!(orders instanceof Error)) {
                if (orders.length) {
                    res.send(orders[0]);
                } else res.send({});
            }
        } catch (e) {
            next(e);
        }
    },
);

export default router;
