import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import { uniqueId } from 'lodash'
import Button from 'grape-web/lib/components/button'
import Input from 'grape-web/lib/components/input'
import FormControl from 'grape-web/lib/components/form/formControl'
import FormLabel from 'grape-web/lib/components/form/formLabel'
import fonts from 'grape-theme/dist/fonts'

const styles = {
  root: {
    display: 'block',
    padding: [20, 0],
  },
  label: fonts.small,
  formControl: {
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    padding: [12, 16],
  },
}

const Form = ({
  classes,
  value,
  onSubmit,
  onChange,
  onRefInput,
  onInvalid,
  isValid,
  errorMessage,
  inputId = uniqueId(),
  inputPlaceholder,
}) => (
  <form onSubmit={onSubmit}>
    <div className={classes.root}>
      <FormControl error={!isValid} className={classes.formControl}>
        <FormLabel htmlFor={inputId} className={classes.label}>
          <FormattedMessage
            id="groupDeleteDialogInputLabel"
            defaultMessage="Please type in the name of the group to confirm"
            description="Group Delete Dialog: input label"
          />
        </FormLabel>
        <Input
          type="text"
          id={inputId}
          required
          value={value}
          ref={onRefInput}
          onChange={onChange}
          placeholder={inputPlaceholder}
          autoComplete="off"
          onInvalid={onInvalid}
          error={!isValid}
        />
        {errorMessage && (
          <FormLabel htmlFor={inputId} className={classes.label}>
            {errorMessage}
          </FormLabel>
        )}
      </FormControl>
    </div>
    <div className={classes.buttonContainer}>
      <Button color="accent" raised type="submit" className={classes.button}>
        <FormattedMessage
          id="groupDeleteDialogDelete"
          defaultMessage="delete"
          description="Group Delete Dialog: delete button message"
        />
      </Button>
    </div>
  </form>
)

export default injectSheet(styles)(Form)
