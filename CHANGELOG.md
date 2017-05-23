## Release 0.53.0 - 0.53.6 (2017-05-22)

### Security Fixes

- Stored XSS in IndexAPI URLs #444

### Fixes

- Fix settings icon and org name flex #448
- Windows App has a very big Roaming Profile #5243
- Link preview: append size to thumbnail url #401
- Don't throw when channel doesn't exist any more #403
- Grape input action icons are too small #447
- Group names cut-off w/o ellipsis on navigation #273
- Mentions and Grape Search filter are styled bold suddenly #435
- Clicking "only search in activities" only searches in current conversation #391
- Org title and org menu is missing in IE11 #387
- Org dropdown menu layout broken on IE11 #436
- Link preview can't be removed #456
- Delete Group is not working #449
- Sidebar not scrollable on FireFox #393

### New Features

- NLP Sidebar

### Chore changes

- Upgrade to JSS 7 #406
- Rewrite the chat footer #113
- Proxy #382
- Redux Dev Tools
- Get rid of NOOP actions #388

## Release 0.52.0 (2017-03-14)

### Fixes

- Menu uses wrong font (#343)
- AutoScroll history to the bottom when modifying messages (#302)
- Remove scrollbars from the org menu (#349)
- Grape Search: path more readable (#223)

### New Features

- Link Attachments removal (#321)
- Show multiple consequent newlines in the history (#203)
- Deleatable activities (#377)

### Chore changes

- Theme for MUI button (#362)
- Rewrite Delete Room Dialog (#355)
- Overrides for MUI (#348)
- Integrate redux-devtools-extension (#373)

## Release 0.51.1 (2017-02-13)

### Fixes

- Use 64x64 icons for activity icons (#346)

## Release 0.51.0 (2017-02-13)

### New Features

- Custom icons for Activities (#324)
- Quote messages (#323)

### Fixes

- Fix icons
- Link attachments adjustments (#330)

### Chore changes

- Add a Styleguide via react styleguidish
- Upgrate to react-virtualized ^8.11.4 (#322)

## Release 0.50.0 (2017-02-03)

### New Features

- Activities search (#316)

### Fixes

- Links in link previews shouldn't be full width (#317)

### Chore changes

- Org menu rewrite (#311)

## Release 0.49.0 (2017-02-01)

### New Features

- Link Attachments (ubergrape/chatgrape#4883)

## Release 0.48.0 (2017-01-27)

### Fixes

- Visible scroll bars in code blocks of messages when mouse is connected (#275)
- Multiple bugs in "invite people to org" dialog (ubergrape/chatgrape#3549, #229)
- Multiple bugs with wording, styling and UX (#283)

### New Features

- Activity messages have now a menu with "Copy to clipboard" and are linkeable (#243)
- User online status in the sidebar (ubergrape/chatgrape#4247)
- Intercome opens now in a separate window (#221)

## Release 0.47.1 (2017-01-17)

### Fixes

- Revert *Show newlines in history- (#253)

## Release 0.47.0 (2016-12-23)

### Fixes

- Markdown hint above the input field
- Show consequent newlines in history (#203)

## Release 0.46.0 (2016-12-22)

### Fixes

- Message delivery status icon (#146)
- Grape viewport not viewable in small sizes if room has a long description in the header bar (#111)
- Electron: Go to login when lastUrl info loading fails (#244)
- Wrong user to group invite handling in web client - invites the wrong person (#217)
- Formatted text and codeblocks are not full width (#218)

### New Features

- New file upload (#188)

### Chore changes

- Manage Contacts / PM dialog rewrite (#111)
- Manage Groups rewrite (#115)
- Flexible height of toast notification (#232)

## Release 0.42.4 (2016-12-06)

- Fixed history icons


## Release 0.42.3 (2016-12-05)

- Fixed activity message data normalization (#209)


## Release 0.42.2 (2016-12-05)

### Chore changes

- Make attachments field for activity message optional


## Release 0.42.1 (2016-12-02)

### New Features

- Activity can now display attachments (#180)


## Release 0.41.0 (2016-11-01)

### New Features

- Sound notifications (ubergrape/chatgrape#844)

### Fixes

- Open Skype contact links with Skype (`callto:sip`)

### Chore changes

- Add utility function to manage `z-index`
- Markdown Tips rewrite (#150)
- Hide organization menu popover on click
- Autofocus *Invite to Org- e-mail input (#154)
- React components extend `PureComponent` (#121)
