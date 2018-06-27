import { DynamicInputModel } from '@ng2-dynamic-forms/core'

export const FORM_LOGIN = [

  new DynamicInputModel(
    {
      id:            'username',
      maxLength:     51,
      label:         'Username',
      validators:    {
        required: null,
      },
      errorMessages: {
        required: 'Field is required',
      },
    },
  ),

  new DynamicInputModel(
    {
      id:            'password',
      inputType:     'password',
      maxLength:     51,
      label:         'Password',
      validators:    {
        required: null,
      },
      errorMessages: {
        required: 'Field is required',
      },
    },
  ),
]
