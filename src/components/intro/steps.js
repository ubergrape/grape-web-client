import React from 'react'
import {
  white,
  blue,
  green,
  orange,
  purple,
} from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import Button from 'grape-web/lib/components/button'

import { mascot } from '../../constants/images'
import View from './View'

export default permissions => {
  const steps = []

  steps.push(props => (
    <View
      {...props}
      headline={
        <FormattedMessage
          id="introHlWelcome"
          defaultMessage="Welcome"
          description="Intro welcome hl."
        />
      }
      text={
        <FormattedMessage
          id="introTextWelcome"
          defaultMessage="Grape is a chat application for teams. We help you to make your team communication more efficient, productive and fun. If you haven't used Grape already, we recommend you to take our 90 seconds tutorial."
          description="Intro welcome text."
        />
      }
      image={mascot.regular}
    />
  ))

  if (permissions.canUseGrapesearch)
    steps.push(props => (
      <View
        {...props}
        beacon="searchBrowser"
        headline={
          <FormattedMessage
            id="introHlSearchBrowser"
            defaultMessage="Find your team data"
            description="Intro SearchBrowser hl."
          />
        }
        text={
          <FormattedMessage
            id="introTextSearchBrowser"
            defaultMessage="Search appointments, files and more from service integrations (like Google Apps or Exchange) or browse the web (e.g. GIFs). To open Grape Search click the button or press #"
            description="Intro SearchBrowser text."
          />
        }
        image={mascot.reading}
        background={green}
      />
    ))

  if (permissions.canCreateRoom)
    steps.push(props => (
      <View
        {...props}
        beacon="manageGroups"
        headline={
          <FormattedMessage
            id="introHlManageGroups"
            defaultMessage="Manage groups"
            description="Intro data hl."
          />
        }
        text={
          <FormattedMessage
            id="introTextGroups"
            defaultMessage="Chat groups can be public or private and can be based on projects, topics (e.g. daily lunch) or your departments (e.g. marketing)."
            description="Intro data text."
          />
        }
        image={mascot.holdingLock}
        background={orange}
      />
    ))

  if (permissions.canCreateRoom)
    steps.push(props => (
      <View
        {...props}
        beacon="pm"
        headline={
          <FormattedMessage
            id="introHlPm"
            defaultMessage="Communicate 1-to-1"
            description="Intro data hl."
          />
        }
        text={
          <FormattedMessage
            id="introTextPm"
            defaultMessage="Start private conversations with your colleagues - even if they haven’t joined Grape yet."
            description="Intro data text."
          />
        }
        image={mascot.holdingMail}
        background={purple}
      />
    ))

  steps.push(props => (
    <View
      {...props}
      beacon="search"
      headline={
        <FormattedMessage
          id="introHlSearch"
          defaultMessage="Stay productive"
          description="Intro search hl."
        />
      }
      text={
        <FormattedMessage
          id="introTextSearch"
          defaultMessage="Search conversations, browse your mentions or view shared files - these handy helpers make your life a lot easier."
          description="Intro search text."
        />
      }
      image={mascot.juggling}
      background={blue}
    />
  ))

  const AddTeamMembersLink = props => (
    <FormattedMessage
      id="addTeamMembersLinkIntro"
      defaultMessage="add your team members"
      description="Link to the members admin within 'Well done' intro screen."
    >
      {(...children) => (
        <Button href="/accounts/organization/settings/members/" {...props}>
          {children}
        </Button>
      )}
    </FormattedMessage>
  )

  const ConnectServicesLink = props => (
    <FormattedMessage
      id="connectServicesLinkIntro"
      defaultMessage="connect your services"
      description="Link to the integrations admin within 'Well done' intro screen."
    >
      {(...children) => (
        <Button href="/integrations/" {...props}>
          {children}
        </Button>
      )}
    </FormattedMessage>
  )

  const StepDone = ({ classes, ...rest }) => (
    <View
      {...rest}
      headline={
        <FormattedMessage
          id="introHlDone"
          defaultMessage="Well done!"
          description="Intro data hl."
        />
      }
      text={
        <FormattedMessage
          id="introTextDone"
          defaultMessage="Don't forget to {addTeamMembersLink} and to {connectServicesLink}. If you have any question, do not hesitate to write us!"
          description="Intro data text."
          values={{
            addTeamMembersLink: <AddTeamMembersLink className={classes.link} />,
            connectServicesLink: (
              <ConnectServicesLink className={classes.link} />
            ),
          }}
        />
      }
      image={mascot.inSpace}
      background={green}
    />
  )

  steps.push(
    injectSheet({
      link: {
        '&[href]': {
          color: white,
          textDecoration: 'underline',
        },
        '&[href]:hover': {
          color: white,
          opacity: 0.8,
        },
      },
    })(StepDone),
  )

  return steps
}
