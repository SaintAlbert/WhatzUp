import {
  DynamicCheckboxModel,
  DynamicDatePickerModel,
  DynamicInputModel,
  DynamicSelectModel,
} from '@ng2-dynamic-forms/core'

export const FORM_EDIT = [

  new DynamicInputModel(
    {
      id:            'name',
      maxLength:     51,
      label:         'Name',
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
      id:            'email',
      inputType:     'email',
      maxLength:     51,
      label:         'Email',
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



  new DynamicSelectModel<string>(
    {
      id:       'gender',
      label:    'Gender',
      multiple: false,
      options:  [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
      ],
    },
  ),


  new DynamicDatePickerModel(
    {
      id:    'birthday',
      label: 'Birthday',
      value: new Date(),
    },
  ),

]
