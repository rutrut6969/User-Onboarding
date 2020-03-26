import React, { useState, useEffect } from 'react';
import { FormStyle, Input, Btn, Label, LabelTos } from './styledComps';
import * as yup from 'yup';
import axios from 'axios';

const userSchema = yup.object().shape({
  name: yup.string().required('You must enter a Name!'),
  email: yup
    .string()
    .email('Must be a valid email address')
    .required('Email must be filled out to continue!'),
  tos: yup
    .boolean()
    .oneOf([true], 'Please agree to Terms of Service to continue!'),
  password: yup.string().required('You have to create a password to continue!')
});

export default function Form(props) {
  // This is how the information is imported for new users
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    tos: ''
  });

  // Tracking Errors with this State Object
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    tos: ''
  });
  const [btnDis, setBtnDis] = useState(true);
  const [post, setPost] = useState([]);

  // Validates if the form is filled, makes the button clickable if so, if not the button will be disabled.
  useEffect(() => {
    userSchema.isValid(newUser).then(valid => {
      setBtnDis(!valid);
    });
  }, [newUser]);

  const validateChange = e => {
    yup
      .reach(userSchema, e.target.name)
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
  };

  const addNewUser = e => {
    e.persist();
    const addedUser = {
      ...newUser,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    };
    validateChange(e);
    setNewUser(addedUser);
  };
  const prevDef = e => {
    e.preventDefault();
    axios
      .post('https://reqres.in/api/users', newUser)
      .then(res => {
        setPost(res.data);
        console.log('success', post);
        setNewUser({
          name: '',
          email: '',
          password: '',
          tos: ''
        });
      })
      .catch(err => console.log(err.response));
    console.log('Event default Prevented');
  };
  return (
    <FormStyle onSubmit={prevDef}>
      <Label htmlFor='name'>
        Name
        <Input
          type='text'
          name='name'
          id='name'
          placeholder='Name: '
          onChange={addNewUser}
        />
        {errors.name.length > 0 ? <p className='error'>{errors.name}</p> : null}
      </Label>
      <Label htmlFor='email'>
        E-mail
        <Input
          type='text'
          name='email'
          id='email'
          placeholder='E-mail:'
          onChange={addNewUser}
        />
        {errors.email.length > 0 ? (
          <p className='error'>{errors.email}</p>
        ) : null}
      </Label>
      <Label htmlFor='password'>
        Password
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          onChange={addNewUser}
        />
        {errors.password.length > 0 ? (
          <p className='error'>{errors.password}</p>
        ) : null}
      </Label>
      <LabelTos htmlFor='tos'>
        <input
          type='checkbox'
          name='tos'
          id='tos'
          onChange={addNewUser}
          checked={newUser.tos}
        />
        Please Agree to Terms of Service!
      </LabelTos>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <Btn type='submit' disabled={btnDis}>
        Submit
      </Btn>

      {console.log(post)}
    </FormStyle>
  );
}
