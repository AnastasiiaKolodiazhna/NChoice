import React, { useEffect, useState } from 'react';
import './Register.css';
import { Form, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import { setUserLogged, setUserLoading } from "../../actions";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../Loading-spinner";
import { SignupSchemaRegister } from '../../configs/login-register-config'
import withStoreService from '../hoc';

const addDataToLocalStorage = (token) => {
    localStorage.setItem('accessToken', JSON.stringify(token.accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(token.refreshToken));
    localStorage.setItem('userId', JSON.stringify(token.user._id))
}

const USER_DATA = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
}

const eye = <FontAwesomeIcon icon={faEye} />;

const Register = ({ storeService, setUserLogged, setUserLoading, userLogged, userLoading, cartNumbers, cartProducts }) => {
    
    const initialUser = { ...USER_DATA, cart: { cartNumbers, cartProducts } }
    
    const [user, setUser] = useState(initialUser);
    const [errorMsg, setErrorMsg] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

    const { register, handleSubmit, errors } = useForm({
        validationSchema: SignupSchemaRegister
    });

    useEffect(() => {
        setUserLogged(false)
    }, [setUserLogged])

    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };

    const toggleConfirmPasswordVisiblity = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    };

    const handleChange = (event) => {
        event.persist();
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const postUser = async () => {
        try {
            setUserLoading();
            const res = await storeService.registerUser(user);
            if (!res) throw new Error('User with such an email already exist.')
            addDataToLocalStorage(res);
            setUserLogged(true);
        } catch (err) {
            setUserLogged(false)
            setErrorMsg(err.message)
        }
    }

    const handleOnSubmit = () => {
        postUser();
    };

    if (userLoading) {
        return <LoadingSpinner />
    }

    if (userLogged) {
        return <Redirect to='/' />
    }

    return (
        <Form className="register" onSubmit={handleSubmit(handleOnSubmit)}>
            <Form.Label className="lable">Register</Form.Label>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="First name"
                    name={'firstName'}
                    value={user.firstName}
                    onChange={handleChange}
                    ref={register}
                />
                {errors.firstName && <p className="errorMessage">{errors.firstName.message}</p>}
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Last name"
                    name={'lastName'}
                    value={user.lastName}
                    onChange={handleChange}
                    ref={register}
                />
                {errors.lastName && <p className="errorMessage">{errors.lastName.message}</p>}
            </Form.Group>
           
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        name={'email'}
                        value={user.email}
                        onChange={handleChange}
                        ref={register}
                    />
                    {errors.email && <p className="errorMessage">{errors.email.message}</p>}
                    <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Group className="pass-wrapper">
                        <Form.Control
                            type={passwordShown ? "text" : "password"}
                            placeholder="Password"
                            name={'password'}
                            value={user.password}
                            onChange={handleChange}
                            ref={register}
                            autoComplete="on"
                        />
                        <i onClick={togglePasswordVisiblity}>{eye}</i>
                    </Form.Group>
                </Form.Group>
                {errors.password && <p className="errorMessage">{errors.password.message}</p>}
                <Form.Group controlId="formBasicPassword">
                    <Form.Label> Confirm Password</Form.Label>
                    <Form.Group className="pass-wrapper">
                        <Form.Control placeholder="Password"
                            name={'confirmPassword'}
                            ref={register}
                            type={confirmPasswordShown ? "text" : "password"}
                            autoComplete="on"
                        />
                        <i onClick={toggleConfirmPasswordVisiblity}>{eye}</i>
                    </Form.Group>
                    {errors.confirmPassword && <p className="errorMessage">{errors.confirmPassword.message}</p>}
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="I agree to terms"
                        name={'agreeToTerms'}
                        ref={register}
                    />
                </Form.Group>

                {errors.agreeToTerms && <p className="errorMessage">{errors.agreeToTerms.message}</p>}
                <Form.Group>
                    <Button variant="dark" type="submit" block>
                        REGISTER
                        </Button>
                    <span>{errorMsg}</span>
                </Form.Group>
                <Form.Group className="link">
                    <Link to="/login" className="btn btn-link" >LOG IN</Link>
                </Form.Group>
        </Form>

    );
}


const mapDispatchToProps = { setUserLogged, setUserLoading };

const mapStateToProps = ({ authReducer: { userLogged, userLoading }, cartReducer: { cartNumbers, cartProducts } }) => ({
    userLogged, userLoading, cartNumbers, cartProducts
});

export default withStoreService()(connect(mapStateToProps, mapDispatchToProps)(Register));


