import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'react-bootstrap';

const FormDiv = styled.div`
  display:flex;
  flex-direction: column;
  align-content: space-around
`

const SyledErrors = styled.div`
    color: red;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Form = () => {
    const [ formState, setFormState ] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        terms: '',
    });

    const [ errors, setErrors ] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        terms: '',
    });

    const [ btnDisabled, setBtnDisabled ] = useState('');

    const [ post, setPost ] = useState([]);

    const validForm = yup.object().shape({
        fname: yup.string()
            .trim()
            .min(2, 'The first name must be at least two characters long')
            .required('The first name is a required field'),
        lname: yup.string()
            .trim()
            .min(2, 'The last name must be at least two characters long')
            .required('The last name is a required field'),
        password: yup.string()
            .trim()
            .max(25, 'The password max character limit is twenty-five (25')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-a\d@$!%*#?&]{8,}$/,
            'Must contain 8 characters, One Uppercase, One Lowercase, One Number')
            .required('The password is a required field'),
        email: yup.string()
            .email('The email must be a valid email address')
            .required('The email is a required field'),
        terms: yup.boolean()
            .oneOf([true], 'You must accept the Terms of Service')
    });

    useEffect (() => {
        console.log("form state has change")
        validForm.isValid(formState).then(valid => {
            setBtnDisabled(!valid)
        });
    });

    const validateChange = e => {
        yup
            .reach(validForm, e.target.name)
            .validate(e.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [e.target.name]: ''
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                });
            });
    }

    const inputChange = e => {
        e.persist();

        const newFormData = {
            ...formState,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
        };
        validateChange(e);
        setFormState(newFormData);
    }

    const formSubmit = e => {
        e.preventDefault();
        axios
        .post('https://regres.in/api/users', formState)
        .then(res => {
            setPost(res.data)
            console.log('success', post)
            setFormState({
                fname: '',
                lname: '',
                email: '',
                password: '',
                terms: '',
            })
        })
        .catch(err => {
            console.log('Error in form Submit fn', err.response);
        });
    };


    return (
        // <Form>
        //     <Form.Group>
        //         <Form.Label>Email Address</Form.Label>
        //         <Form.Control type="email" placeholder="example@email.com" />
        //         <Form.Text className="text-muted">
        //             We'll never share you're email address, trust us!
        //         </Form.Text>
        //     </Form.Group>
        // </Form>
         // <Form>
        //     <Form.Group>
        //         <Form.Label>Password</Form.Label>
        //         <Form.Control type="password" placeholder="password" />
        //     </Form.Group>
        // </Form>
        <form onSubmit={formSubmit}>
            <FormDiv>

                {/* // Text Input // */}
                <label>
                    First Name: &nbsp;
                    <input
                        value = {formState.fname}
                        onChange={inputChange}
                        id="first-name"
                        name="fname"
                        type="text"
                        placeholder="John"
                    />
                </label>

                <label>
                    Last Name: &nbsp;
                    <input
                        value = {formState.lname}
                        onChange={inputChange}
                        id="last-name"
                        name="lname"
                        type="text"
                        placeholder="Doe"
                    />
                </label>

                <label>
                    Email: &nbsp;
                    <input
                        value = {formState.email}
                        onChange={inputChange}
                        id="emailInput"
                        name="email"
                        type="email"
                        placeholder="johndoe@email.com"
                    />
                </label>

                <label>
                    Password: &nbsp;
                    <input
                        value = {formState.password}
                        onChange={inputChange}
                        id="passwordInput"
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </label>

                {/* // Errors // */}
                <SyledErrors>
                    <div> {errors.fname} </div>
                    <div> {errors.lname} </div>
                    <div> {errors.email} </div>
                    <div> {errors.password} </div>
                    <div> {errors.terms} </div>
                </SyledErrors>

                <div>
                    <label>
                        <h4>Do you agree to the Terms of Service?</h4>
                        <input
                            type="checkbox"
                            name="terms"
                            id="termsInput"
                            checked={formState.terms}
                            onChange={inputChange}
                        />
                    </label>
                </div>

                {/* // Submit Button // */}
                <div>
                    {/* // disable button until form is complete // */}
                    <Button variant='primary'disable={btnDisabled} type="submit">
                        Submit
                    </Button>
                </div>
                {/* // Ends from submit-btn div // */}
            </FormDiv>
            {/* // Ends from text div // */}
        </form>
    );
};

export default Form;
