import React, { FC, useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import { ErrorMessage } from '../../api/types';
import { Translator } from '../../internationalization';

export interface PasswordFieldProps {
  className?: string;
  password: string;
  errorMessage: ErrorMessage;
  label?: string;
  id?: string;
  onChange?: (value: string) => void;
  translator: Translator;
}

export const PasswordField: FC<PasswordFieldProps> = (
  {
    className,
    errorMessage,
    password,
    label,
    id,
    onChange,
    translator,
  },
) => {
  const [showPassword, setShowPassword] = useState(false);
  const t = translator;
  const errorMap = (error: string) => t(`auth:Common.FieldErrors.${error}`);

  return (
    <TextField
      className={className}
      fullWidth
      id={id || 'login_password'}
      label={label || t('auth:Common.Password')}
      variant="outlined"
      value={password}
      type={showPassword ? 'text' : 'password'}
      helperText={errorMessage.password ? errorMessage.password.map(errorMap).join(' - ') : ''}
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
