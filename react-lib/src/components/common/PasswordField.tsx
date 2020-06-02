import React, { FC, useMemo, useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import { StringsProps } from '../../internationalization';
import { ErrorMessage, ObjectOfStrings } from '../../api/types';

export interface PasswordFieldProps extends StringsProps {
  className?: string;
  password: string;
  errorMessage: ErrorMessage;
  label?: string;
  id?: string;
  onChange?: (value: string) => void;
}

export const PasswordField: FC<PasswordFieldProps> = (
  {
    className,
    errorMessage,
    password,
    label,
    id,
    onChange,
    strings,
  },
) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldErrors: ObjectOfStrings = useMemo(
    () => strings.Common.FieldErrors,
    [strings],
  );


  return (
    <TextField
      className={className}
      fullWidth
      id={id || 'login_password'}
      label={label || strings.Common.Password}
      variant="outlined"
      value={password}
      type={showPassword ? 'text' : 'password'}
      helperText={errorMessage.password ? errorMessage.password.map((message: string) => (
        `${fieldErrors[message]} `)) : ''}
      error={errorMessage.password && errorMessage.password.length > 0}
      onChange={(event) => {
        if (onChange) {
          onChange(event.target.value);
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
