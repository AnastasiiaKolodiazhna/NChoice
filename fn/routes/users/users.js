const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../../models/User');
const { userValidationRules, validate } = require('../../middleware/validator');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = await Users.find();
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findById(id);
        if (!user) {
            throw { message: 'User doesnt exist' };
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/', userValidationRules(), validate, async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await Users.findOne({ email });
        if (user) {
            throw { message: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(200).send({ message: 'User saved', user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).send('Success');
        } else {
            res.status(200).send('Not allowed');
        }
    } catch (err) {
        req.status(500).send(err.message);
    }
});

module.exports = router;
