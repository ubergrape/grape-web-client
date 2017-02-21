import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import {Input} from 'material-ui/Input'
import {FormControl, FormLabel} from 'material-ui/Form'
import {small} from 'grape-theme/dist/fonts'

import Header from './Header'
import Divider from './Divider'

@injectSheet({
  link: {
    padding: 10
  },
  linkLabel: {
    extend: small,
    fontWeight: 'bold'
  }
})
export default class CreateTask extends PureComponent {
  render() {
    const {classes, onClose, onGoBack, task} = this.props
    return (
      <div className={classes.createTask}>
        <Header
          title={
            <FormattedMessage
              id="createTask"
              defaultMessage="Create Task"
              description="NLP create task dialog title."
            />
          }
          description={task.text}
          icon="lightningBolt"
          onClose={onClose}
          onGoBack={onGoBack}
        />
        <FormControl className={classes.link}>
          <FormLabel className={classes.linkLabel}>
            <FormattedMessage
              id="linkToAConnectedTask"
              defaultMessage="Link to a connected Task"
              description="Nlp create task dialog link label."
            />
          </FormLabel>
          <Input placeholder="https://tasks.com/taskid=124…" />
        </FormControl>
        <Divider />
      </div>
    )
  }
}
