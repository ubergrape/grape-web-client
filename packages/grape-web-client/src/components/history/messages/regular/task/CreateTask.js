import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'
import FormGroup from 'grape-web/lib/components/form/formGroup'
import FormControl from 'grape-web/lib/components/form/formControl'
import FormLabel from 'grape-web/lib/components/form/formLabel'
import Input from 'grape-web/lib/components/input'
import List from 'grape-web/lib/components/list/list'
import Button from 'grape-web/lib/components/button'
import Divider from 'grape-web/lib/components/divider'
import { small } from 'grape-theme/dist/fonts'

import { Enter } from '../../../../i18n'
import Header from './Header'
import ServicesItem from './ServicesItem'

const messages = defineMessages({
  moreServices: {
    id: 'moreServices',
    defaultMessage: 'More Services',
    description: 'More Services button in message nlp create task dialog.',
  },
  createTask: {
    id: 'createTask',
    defaultMessage: 'Create Task',
    description: 'NLP create task dialog title.',
  },
})

const styles = {
  link: {
    padding: 10,
  },
  linkLabel: {
    extend: small,
    fontWeight: 'bold',
  },
  linkInput: {
    flex: 1,
    marginRight: 10,
  },
  linkEnter: {
    textTransform: 'uppercase',
  },
}

const LinkSection = ({ classes, onFocus, onBlur, isFocused }) => (
  <FormControl className={classes.link}>
    <FormLabel className={classes.linkLabel}>
      <FormattedMessage
        id="linkToAConnectedTask"
        defaultMessage="Link to a connected Task"
        description="NLP create task dialog link label."
      />
    </FormLabel>
    <FormGroup row>
      <Input
        placeholder="https://tasks.com/taskid=124…"
        autoFocus
        className={classes.linkInput}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {isFocused && (
        <Button color="accent" compact className={classes.linkEnter}>
          <Enter />
        </Button>
      )}
    </FormGroup>
  </FormControl>
)

@injectSheet(styles)
@injectIntl
export default class CreateTask extends PureComponent {
  static propTypes = {
    intl: intlShape,
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    onGoBack: PropTypes.func,
    onSelectService: PropTypes.func,
    task: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ),
  }

  static defaultProps = {
    services: [],
  }

  state = { linkInputIsFocused: false }

  onFocusLinkInput = () => {
    this.setState({ linkInputIsFocused: true })
  }

  onBlurLinkInput = () => {
    this.setState({ linkInputIsFocused: false })
  }

  render() {
    const {
      classes,
      onClose,
      onGoBack,
      onSelectService,
      task,
      services,
      intl: { formatMessage },
    } = this.props
    const { linkInputIsFocused } = this.state

    return (
      <div className={classes.createTask}>
        <Header
          title={formatMessage(messages.createTask)}
          description={task.text}
          icon="lightningBolt"
          onClose={onClose}
          onGoBack={onGoBack}
        />
        <LinkSection
          classes={classes}
          onFocus={this.onFocusLinkInput}
          onBlur={this.onBlurLinkInput}
          isFocused={linkInputIsFocused}
        />
        <Divider light />
        <List className={classes.list}>
          {services.map(service => (
            <ServicesItem
              service={service}
              onSelect={onSelectService}
              key={service.id}
            />
          ))}
          <ServicesItem
            service={{
              id: 'moreServices',
              name: formatMessage(messages.moreServices),
            }}
            onSelect={onSelectService}
            key="moreServicesButton"
            icon="moreOptions"
          />
        </List>
      </div>
    )
  }
}
