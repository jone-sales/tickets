import express from 'express'
import { currentuser } from '@js_tickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentuser, (req, res) => {
    res.send({currentUser: req.currentUser || null });
});

export { router as currentUserRouter };